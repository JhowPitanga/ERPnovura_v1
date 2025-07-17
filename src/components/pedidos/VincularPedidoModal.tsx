import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, X, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts"; // Certifique-se que este import está correto

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

  const { products: produtosDisponiveis, loading: loadingProdutos, refetch: refetchProdutos } = useProducts();

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

  useEffect(() => {
    if (open && pedido?.itens) {
      const initialVinculacoes: Record<string, string> = {};
      pedido.itens.forEach((item) => {
        if (item.product_id) {
          initialVinculacoes[item.id] = item.product_id;
        }
      });
      setItemVinculacoes(initialVinculacoes);
      setSearchTerm("");
      setSelectedOrderItemId(null);
      refetchProdutos();
    }
  }, [open, pedido?.id, pedido?.itens, refetchProdutos]);

  // FUNÇÃO PARA SETAR selectedOrderItemId E ADICIONAR LOG
  const handleSetSelectedOrderItemId = useCallback((id: string) => {
    setSelectedOrderItemId(id);
    console.log(">>> VincularPedidoModal: Item do pedido selecionado:", id); // LOG DE DEBUG
  }, []);

  const handleVincularProduto = useCallback((produtoSistemaId: string) => {
    if (!selectedOrderItemId) {
      toast({
        title: "Atenção",
        description: "Selecione um item do pedido à esquerda para vincular.",
        variant: "destructive",
      });
      return;
    }

    const produtoSelecionado = produtosDisponiveis?.find(p => p.id === produtoSistemaId);
    const itemPedidoSelecionado = pedido?.itens?.find(item => item.id === selectedOrderItemId);

    if (!produtoSelecionado || !itemPedidoSelecionado) {
      toast({
        title: "Erro",
        description: "Produto do sistema ou item do pedido não encontrado.",
        variant: "destructive",
      });
      return;
    }

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
        order_item_id: originalItem.id,
        product_system_id: itemVinculacoes[originalItem.id],
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
      console.error('Error saving vinculacao:', error);
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
    <Dialog open={open} onOpenChange={handleClose}> // Force Recompile
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
                    const produtoDoSistema = produtoVinculadoId ? produtosDisponiveis?.find(p => p.id === produtoVinculadoId) : null;
                    const isPreLinkedFromDB = item.product_id !== null && !!produtoDoSistema;

                    return (
                      <div
                        key={item.id}
                        className={`bg-white p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected ? 'border-novura-primary shadow-md ring-2 ring-novura-primary/20'
                          : isPreLinkedFromDB ? 'border-green-300 bg-green-50 opacity-90'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleSetSelectedOrderItemId(item.id)} // <<< AQUI É ONDE SELECIONA O ITEM DO PEDIDO
                      >
                        <div className="flex items-start space-x-3 mb-3">
                          <img
                            src="/placeholder.svg" // Ícone genérico para item do pedido
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
                                <p className="text-xs font-medium text-green-800">{produtoDo