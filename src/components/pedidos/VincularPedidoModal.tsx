import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, X, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts"; // Importa useProducts, que contém a lista de produtos do sistema

interface OrderItem {
  id: string; // ID do item do pedido (do DB)
  product_id: string | null; // ID do produto do sistema (se já vinculado)
  product: string; // Nome do produto do pedido (do marketplace)
  sku: string; // SKU do produto do pedido
  quantidade: number; // Quantidade deste item no pedido
  valor: number; // Valor unitário do item no pedido
}

interface PedidoData {
  id: string; // ID interno do pedido
  marketplace_order_id: string;
  status: string;
  itens: OrderItem[]; // Agora os itens do pedido contêm o ID real do item do pedido
}

interface VincularPedidoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedido: PedidoData | null;
  onVinculacaoSucesso: () => void;
}

export function VincularPedidoModal({ open, onOpenChange, pedido, onVinculacaoSucesso }: VincularPedidoModalProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [itemVinculacoes, setItemVinculacoes] = useState<Record<string, string>>({});
  const [loadingVinculacao, setLoadingVinculacao] = useState(false);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(null);

  // Usa o hook useProducts para obter os produtos do sistema com estoque
  const { products: produtosDisponiveis, loading: loadingProdutos, refetch: refetchProdutos } = useProducts();

  // Filtra produtos disponíveis com base no termo de busca
  const filteredProdutos = useMemo(() => {
    if (!produtosDisponiveis) return [];
    
    if (searchTerm.length === 0) {
      return produtosDisponiveis;
    }
    
    return produtosDisponiveis.filter(produto =>
      produto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [produtosDisponiveis, searchTerm]);

  // Efeito para inicializar vinculações e carregar produtos quando o modal abre
  useEffect(() => {
    if (open && pedido?.itens) {
      const initialVinculacoes: Record<string, string> = {};
      pedido.itens.forEach((item) => {
        if (item.product_id) { // Se o item do pedido já tem um product_id vinculado no DB
          initialVinculacoes[item.id] = item.product_id;
        }
      });
      setItemVinculacoes(initialVinculacoes);
      setSearchTerm("");
      setSelectedOrderItemId(null); // Reseta a seleção
      
      // refetch ProdutosDisponiveis para ter certeza que o estoque está atualizado
      refetchProdutos(); 
    }
  }, [open, pedido?.id, pedido?.itens, refetchProdutos]);

  // Lógica para vincular um produto do sistema a um item do pedido
  const handleVincularProduto = useCallback((produtoSistemaId: string) => {
    if (!selectedOrderItemId) {
      toast({
        title: "Atenção",
        description: "Selecione um item do pedido à esquerda para vincular.",
        variant: "destructive", // Mudado para default ou warning para ser mais visível
      });
      return;
    }

    const produtoSelecionado = produtosDisponiveis.find(p => p.id === produtoSistemaId);
    const itemPedidoSelecionado = pedido?.itens?.find(item => item.id === selectedOrderItemId);

    if (!produtoSelecionado || !itemPedidoSelecionado) {
      toast({
        title: "Erro",
        description: "Produto do sistema ou item do pedido não encontrado.",
        variant: "destructive",
      });
      return;
    }

    // Verificação de estoque
    if (produtoSelecionado.total_current_stock <= 0) {
      toast({
        title: "Estoque Insuficiente",
        description: `O produto "${produtoSelecionado.name}" não possui estoque disponível.`,
        variant: "destructive",
      });
      return;
    }
    if (produtoSelecionado.total_current_stock < itemPedidoSelecionado.quantidade) {
      toast({
        title: "Estoque Insuficiente",
        description: `Estoque disponível (${produtoSelecionado.total_current_stock}) para "${produtoSelecionado.name}" é menor que a quantidade do pedido (${itemPedidoSelecionado.quantidade}).`,
        variant: "destructive",
      });
      return;
    }

    // Verificação se o produto do sistema já está vinculado a OUTRO item do pedido
    const produtoJaVinculadoEmOutroItem = Object.entries(itemVinculacoes).find(
      ([linkedOrderItemId, linkedProdutoId]) => linkedProdutoId === produtoSistemaId && linkedOrderItemId !== selectedOrderItemId
    );

    if (produtoJaVinculadoEmOutroItem) {
      toast({
        title: "Atenção",
        description: "Este produto já está vinculado a outro item do pedido. Desvincule-o primeiro.",
        variant: "destructive",
      });
      return;
    }

    setItemVinculacoes(prev => ({
      ...prev,
      [selectedOrderItemId]: produtoSistemaId
    }));
    // Não limpa setSelectedOrderItemId aqui, permitindo que o usuário desvincule/vincule o mesmo item
  }, [itemVinculacoes, selectedOrderItemId, toast, produtosDisponiveis, pedido?.itens]);

  const handleRemoverVinculacao = useCallback((linkedOrderItemId: string) => {
    setItemVinculacoes(prev => {
      const newVinculacoes = { ...prev };
      delete newVinculacoes[linkedOrderItemId];
      return newVinculacoes;
    });
  }, []);

  const handleSalvar = async () => {
    if (!pedido || !pedido.id || !pedido.itens) {
      toast({ title: "Erro", description: "Pedido inválido.", variant: "destructive" });
      return;
    }

    // Verifica se todos os itens do pedido estão vinculados
    const todosItensVinculados = pedido.itens.every(item => !!itemVinculacoes[item.id]);
    if (!todosItensVinculados) {
      toast({
        title: "Atenção",
        description: "Todos os itens do pedido precisam ser vinculados para salvar.",
        variant: "warning",
      });
      return;
    }

    const defaultStorageId = "COLOQUE_AQUI_O_UUID_DO_SEU_GALPAO_PADRAO"; // <<< ATUALIZE COM O ID REAL DO SEU GALPÃO PADRÃO
    if (!defaultStorageId) {
        toast({ title: "Erro", description: "ID do galpão padrão não configurado.", variant: "destructive" });
        return;
    }

    setLoadingVinculacao(true);
    try {
      const linkedItemsForDB = pedido.itens.map(originalItem => ({
        order_item_id: originalItem.id, // ID do item do pedido no DB
        product_system_id: itemVinculacoes[originalItem.id], // ID do produto do sistema vinculado
      }));

      const { error: vinculacaoError } = await supabase.rpc('update_order_items_and_link_stock', {
        p_order_id: pedido.id,
        p_linked_items: linkedItemsForDB,
        p_storage_id_for_reservation: defaultStorageId,
      });

      if (vinculacaoError) throw vinculacaoError;

      toast({
        title: "Sucesso",
        description: "Pedido vinculado e estoque reservado com sucesso!",
        variant: "default",
      });
      onVinculacaoSucesso();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error?.message || "Falha ao vincular pedido.",
        variant: "destructive",
      });
    } finally {
      setLoadingVinculacao(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setItemVinculacoes({});
    setSearchTerm("");
    setSelectedOrderItemId(null);
  };

  const totalItensVinculados = Object.keys(itemVinculacoes).length;
  const isSaveButtonDisabled = loadingVinculacao || totalItensVinculados === 0 || totalItensVinculados !== (pedido?.itens?.length || 0);

  const selectedOrderItem = useMemo(() => {
    return pedido?.itens?.find(item => item.id === selectedOrderItemId);
  }, [pedido?.itens, selectedOrderItemId]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[80vh] bg-white rounded-2xl p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 border-b border-gray-100 flex-row items-center justify-between flex-none">
          <div>
            <DialogTitle className="text-2xl font-bold">Vincular Produto ao Pedido {pedido?.marketplace_order_id || pedido?.id}</DialogTitle>
            <p className="text-gray-600 mt-1">Selecione um item do pedido e depois o produto correspondente para vincular</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Itens do Pedido - Lado Esquerdo */}
          <div className="w-96 flex flex-col bg-gray-50 border-r border-gray-100">
            <div className="p-4 border-b border-gray-200 flex-none">
              <h3 className="font-semibold text-gray-900">Itens do Pedido</h3>
              <p className="text-sm text-gray-600">
                {totalItensVinculados} de {pedido?.itens?.length || 0} item(s) vinculado(s)
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!pedido?.itens || pedido.itens.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>Nenhum item no pedido</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pedido.itens.map((item: OrderItem) => {
                    const isSelected = selectedOrderItemId === item.id;
                    const produtoVinculadoId = itemVinculacoes[item.id];
                    const produtoDoSistema = produtoVinculadoId ? produtosDisponiveis.find(p => p.id === produtoVinculadoId) : null;
                    const isPreLinkedFromDB = item.product_id !== null && !!produtoDoSistema; // Se já veio vinculado do DB

                    return (
                      <div
                        key={item.id}
                        className={`bg-white p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected ? 'border-novura-primary shadow-md ring-2 ring-novura-primary/20'
                          : isPreLinkedFromDB ? 'border-green-300 bg-green-50 opacity-90' // Pré-vinculado do DB
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedOrderItemId(item.id)}
                      >
                        <div className="flex items-start space-x-3 mb-3">
                          <img
                            src="/placeholder.svg"
                            alt={item.product}
                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm truncate">{item.product}</h4>
                            <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                            <div className="flex items-center justify-between mt-1">
                              <Badge variant="outline" className="text-xs">
                                Qtd: {item.quantidade}
                              </Badge>
                              <span className="text-xs text-gray-600">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {produtoDoSistema ? (
                          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center space-x-2">
                              <img
                                src={produtoDoSistema.image_urls?.[0] || "/placeholder.svg"}
                                alt={produtoDoSistema.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <div>
                                <p className="text-xs font-medium text-green-800">{produtoDoSistema.name}</p>
                                <p className="text-xs text-green-600">SKU: {produtoDoSistema.sku}</p>
                                <p className="text-xs text-green-600">Estoque: {produtoDoSistema.total_current_stock} un.</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoverVinculacao(item.id);
                              }}
                              className="p-1 h-auto rounded-full hover:bg-red-50 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-2 text-gray-500">
                            <p className="text-xs">
                              {isSelected ? "Escolha um produto à direita para vincular." : "Clique para selecionar este item do pedido."}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex-none">
              <Button
                onClick={handleSalvar}
                disabled={isSaveButtonDisabled}
                className="w-full h-12 rounded-2xl bg-novura-primary"
              >
                {loadingVinculacao ? "Salvando..." : `Salvar Vinculação (${totalItensVinculados})`}
              </Button>
            </div>
          </div>

          {/* Lista de Produtos do Sistema - Lado Direito */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex-none">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Produtos do Sistema</h3>
                {selectedOrderItem && (
                  <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
                    Item