import { useState, useEffect, useCallback } from "react";
import { Search, X, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { fetchProductsWithDetailedStock } from "@/hooks/useStockData";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  product_id?: string;
  product: string;
  sku: string;
  quantidade: number;
  valor: number;
  id: string; // Adicionado ID para o item do pedido
}

interface PedidoData {
  id: string;
  marketplace_order_id: string;
  status: string;
  itens: OrderItem[];
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
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<any[]>([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [loadingVinculacao, setLoadingVinculacao] = useState(false);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(null); // Agora usa o ID real do item do pedido

  useEffect(() => {
    if (open) {
      const loadProdutos = async () => {
        setLoadingProdutos(true);
        try {
          const data = await fetchProductsWithDetailedStock();
          setProdutosDisponiveis(data);
        } catch (error) {
          toast({
            title: "Erro",
            description: "Não foi possível carregar os produtos do sistema.",
            variant: "destructive",
          });
        } finally {
          setLoadingProdutos(false);
        }
      };
      loadProdutos();

      const initialVinculacoes: Record<string, string> = {};
      pedido?.itens?.forEach((item) => {
        if (item.product_id) {
          initialVinculacoes[item.id] = item.product_id;
        }
      });
      setItemVinculacoes(initialVinculacoes);
      setSearchTerm("");
      setSelectedOrderItemId(null);
    }
  }, [open, pedido?.id, pedido?.itens]);

  const filteredProdutos = produtosDisponiveis.filter(produto =>
    produto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVincularProduto = useCallback((produtoSistemaId: string) => {
    if (!selectedOrderItemId) {
      toast({
        title: "Atenção",
        description: "Selecione um item do pedido à direita para vincular.",
        variant: "info",
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
        variant: "warning",
      });
      return;
    }

    setItemVinculacoes(prev => ({
      ...prev,
      [selectedOrderItemId]: produtoSistemaId
    }));
    setSelectedOrderItemId(null);
  }, [itemVinculacoes, selectedOrderItemId, toast]);

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

    const todosItensVinculados = pedido.itens.every(item => itemVinculacoes[item.id]);

    if (!todosItensVinculados) {
      toast({
        title: "Atenção",
        description: "Nem todos os itens do pedido foram vinculados. Vincule todos para prosseguir.",
        variant: "warning",
      });
      return;
    }

    const defaultStorageId = "COLOQUE_AQUI_O_UUID_DO_SEU_GALPAO_PADRAO";
    if (!defaultStorageId) {
        toast({ title: "Erro", description: "ID do galpão padrão não configurado.", variant: "destructive" });
        return;
    }

    setLoadingVinculacao(true);
    try {
      const linkedItemsForDB = pedido.itens.map(originalItem => {
        return {
          order_item_id: originalItem.id,
          product_system_id: itemVinculacoes[originalItem.id],
        };
      });

      // NOVO: RPC para atualizar order_items no DB e chamar a reserva
      // Essa função precisa ser criada no banco de dados primeiro
      const { error: vinculacaoError } = await supabase.rpc('update_order_items_and_link_stock', {
        p_order_id: pedido.id,
        p_linked_items: linkedItemsForDB,
        p_storage_id_for_reservation: defaultStorageId,
      });

      if (vinculacaoError) throw vinculacaoError;

      toast({
        title: "Sucesso",
        description: "Pedido vinculado e estoque reservado com sucesso!",
        variant: "success",
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[80vh] bg-white rounded-2xl p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 border-b border-gray-100 flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-2xl font-bold">Vincular Produto ao Pedido {pedido?.marketplace_order_id || pedido?.id}</DialogTitle>
            <p className="text-gray-600 mt-1">Selecione os produtos para vincular a cada item do pedido</p>
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
          {/* Lista de Produtos - Left Side */}
          <div className="flex-1 border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 rounded-2xl border-0 bg-gray-50"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loadingProdutos ? (
                <div className="text-center text-gray-500 mt-8">Carregando produtos...</div>
              ) : filteredProdutos.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">Nenhum produto encontrado.</div>
              ) : (
                <div className="space-y-2">
                  {filteredProdutos.map((produto) => {
                    const isUsed = Object.values(itemVinculacoes).includes(produto.id);
                    const isLinkedToCurrentItem = selectedOrderItemId !== null && itemVinculacoes[selectedOrderItemId] === produto.id;
                    const isDisabled = isUsed && !isLinkedToCurrentItem;

                    return (
                      <div
                        key={produto.id}
                        onClick={() => !isDisabled && handleVincularProduto(produto.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                          isLinkedToCurrentItem ? 'border-novura-primary bg-novura-primary-light'
                          : isDisabled ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={produto.image_urls?.[0] || "/placeholder.svg"}
                            alt={produto.name}
                            className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{produto.name}</h3>
                            <p className="text-sm text-gray-500">SKU: {produto.sku}</p>
                            <div className="flex items-center justify-between mt-1">
                              <Badge variant="outline" className="text-xs">
                                Estoque: {produto.total_current_stock}
                              </Badge>
                              <span className="font-bold text-novura-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.sell_price || 0)}
                              </span>
                            </div>
                          </div>
                          {isLinkedToCurrentItem && (
                            <Check className="w-5 h-5 text-novura-primary" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Itens do Pedido - Right Side */}
          <div className="w-96 flex flex-col bg-gray-50">
            <div className="p-4 border-b border-gray-200">
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
                  {pedido.itens.map((item: OrderItem, index: number) => {
                    const isSelected = selectedOrderItemId === item.id; // Agora usa item.id
                    const produtoVinculadoId = itemVinculacoes[item.id]; // Agora usa item.id
                    const produtoDoSistema = produtoVinculadoId ? produtosDisponiveis.find(p => p.id === produtoVinculadoId) : null;

                    return (
                      <div
                        key={item.id} // Usa item.id como key
                        className={`bg-white p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected ? 'border-novura-primary shadow-md' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedOrderItemId(item.id)} // Seleciona o item do pedido pelo ID real
                      >
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-900 text-sm">{item.product}</h4>
                          <p className="text-xs text-gray-500">SKU: {item.sku} | Qtd: {item.quantidade}</p>
                          <p className="text-xs text-gray-600">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
                          </p>
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
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoverVinculacao(item.id); // Remove pelo ID real do item
                              }}
                              className="p-1 h-auto rounded-full hover:bg-red-50 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-xs text-gray-500 mb-2">Clique em um produto à esquerda para vincular</p>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {filteredProdutos.slice(0, 3).map((sugestaoProduto) => {
                                const isAlreadyUsed = Object.values(itemVinculacoes).includes(sugestaoProduto.id);
                                return (
                                  <button
                                    key={sugestaoProduto.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isSelected && !isAlreadyUsed) {
                                        handleVincularProduto(sugestaoProduto.id);
                                      } else if (isAlreadyUsed) {
                                        toast({ title: "Atenção", description: "Este produto já está vinculado a outro item.", variant: "warning" });
                                      } else {
                                        toast({ title: "Atenção", description: "Selecione o item do pedido à direita para vincular.", variant: "info" });
                                      }
                                    }}
                                    disabled={!isSelected || isAlreadyUsed}
                                    className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                                      (!isSelected || isAlreadyUsed)
                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                    }`}
                                  >
                                    {sugestaoProduto.name.substring(0, 15)}...
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex-none"> {/* flex-none para não encolher */}
              <Button
                onClick={handleSalvar}
                disabled={totalItensVinculados === 0 || loadingVinculacao || totalItensVinculados !== (pedido?.itens?.length || 0)}
                className="w-full h-12 rounded-2xl bg-novura-primary"
              >
                {loadingVinculacao ? "Salvando..." : `Salvar Vinculação (${totalItensVinculados})`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}