
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
  id: string;
  product_id: string | null;
  product: string;
  sku: string;
  quantidade: number;
  valor: number;
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
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(null);

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
        description: "Selecione um item do pedido à esquerda para vincular.",
        variant: "default",
      });
      return;
    }

    const produtoSelecionado = produtosDisponiveis.find(p => p.id === produtoSistemaId);
    const itemPedido = pedido?.itens?.find(item => item.id === selectedOrderItemId);

    if (produtoSelecionado && itemPedido) {
      if (produtoSelecionado.total_current_stock <= 0) {
        toast({
          title: "Estoque Insuficiente",
          description: "Este produto não possui estoque disponível.",
          variant: "destructive",
        });
        return;
      }

      if (produtoSelecionado.total_current_stock < itemPedido.quantidade) {
        toast({
          title: "Estoque Insuficiente",
          description: `Estoque disponível (${produtoSelecionado.total_current_stock}) é menor que a quantidade do pedido (${itemPedido.quantidade}).`,
          variant: "destructive",
        });
        return;
      }
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
        variant: "destructive",
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

  const getSelectedOrderItem = () => {
    return pedido?.itens?.find(item => item.id === selectedOrderItemId);
  };

  const selectedOrderItem = getSelectedOrderItem();

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
          {/* Itens do Pedido - Agora à esquerda */}
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

                    return (
                      <div
                        key={item.id}
                        className={`bg-white p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected ? 'border-novura-primary shadow-md ring-2 ring-novura-primary/20' : 'border-gray-200 hover:border-gray-300'
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
                                <p className="text-xs text-green-600">Desconto: -{item.quantidade} unidades</p>
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
                              {isSelected ? "Produto selecionado. Escolha um produto à direita para vincular." : "Clique para selecionar"}
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

          {/* Lista de Produtos - Agora à direita */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex-none">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Produtos do Sistema</h3>
                {selectedOrderItem && (
                  <Badge variant="outline" className="text-sm">
                    Selecionado: {selectedOrderItem.product} (Qtd: {selectedOrderItem.quantidade})
                  </Badge>
                )}
              </div>
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
              {!selectedOrderItemId ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>Selecione um item do pedido à esquerda para vincular</p>
                </div>
              ) : loadingProdutos ? (
                <div className="text-center text-gray-500 mt-8">Carregando produtos...</div>
              ) : filteredProdutos.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">Nenhum produto encontrado.</div>
              ) : (
                <div className="space-y-2">
                  {filteredProdutos.map((produto) => {
                    const isUsed = Object.values(itemVinculacoes).includes(produto.id);
                    const isLinkedToSelectedOrderItem = selectedOrderItemId !== null && itemVinculacoes[selectedOrderItemId] === produto.id;
                    const isDisabled = isUsed && !isLinkedToSelectedOrderItem;
                    const hasInsufficientStock = produto.total_current_stock <= 0;
                    const selectedItem = getSelectedOrderItem();
                    const hasInsufficientStockForQuantity = selectedItem && produto.total_current_stock < selectedItem.quantidade;

                    return (
                      <div
                        key={produto.id}
                        onClick={() => !isDisabled && !hasInsufficientStock && !hasInsufficientStockForQuantity && handleVincularProduto(produto.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                          isLinkedToSelectedOrderItem ? 'border-novura-primary bg-novura-primary-light'
                          : isDisabled || hasInsufficientStock || hasInsufficientStockForQuantity ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
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
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  produto.total_current_stock <= 0 ? 'border-red-500 text-red-500 bg-red-50' : 
                                  hasInsufficientStockForQuantity ? 'border-orange-500 text-orange-500 bg-orange-50' : ''
                                }`}
                              >
                                Estoque: {produto.total_current_stock}
                              </Badge>
                              {selectedItem && (
                                <span className="text-xs text-gray-600">
                                  Necessário: {selectedItem.quantidade}
                                </span>
                              )}
                            </div>
                          </div>
                          {isLinkedToSelectedOrderItem && (
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
