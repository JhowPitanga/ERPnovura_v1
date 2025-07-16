
import { useState } from "react";
import { Search, X, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface VincularPedidoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedido: any;
}

const mockProdutos = [
  { id: "1", nome: "iPhone 15 Pro Max 256GB", sku: "IPH15PM-256", estoque: 12, preco: 8999.99, image: "/placeholder.svg" },
  { id: "2", nome: "MacBook Air M3 16GB 512GB", sku: "MBA-M3-512", estoque: 5, preco: 12999.99, image: "/placeholder.svg" },
  { id: "3", nome: "Samsung Galaxy S24 Ultra", sku: "SGS24U-256", estoque: 8, preco: 6999.99, image: "/placeholder.svg" },
  { id: "4", nome: "Nintendo Switch OLED", sku: "NSW-OLED", estoque: 15, preco: 2299.99, image: "/placeholder.svg" },
  { id: "5", nome: "iPad Air 5ª Geração", sku: "IPAD-AIR5", estoque: 7, preco: 4199.99, image: "/placeholder.svg" },
];

export function VincularPedidoModal({ open, onOpenChange, pedido }: VincularPedidoModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemVinculacoes, setItemVinculacoes] = useState<Record<string, string>>({});

  const filteredProdutos = mockProdutos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVincularProduto = (itemId: string, produtoId: string) => {
    // Check if this product is already assigned to another item
    const produtoJaVinculado = Object.values(itemVinculacoes).includes(produtoId);
    if (produtoJaVinculado && itemVinculacoes[itemId] !== produtoId) {
      return; // Don't allow same product to be assigned to multiple items
    }

    setItemVinculacoes(prev => ({
      ...prev,
      [itemId]: produtoId
    }));
  };

  const handleRemoverVinculacao = (itemId: string) => {
    setItemVinculacoes(prev => {
      const newVinculacoes = { ...prev };
      delete newVinculacoes[itemId];
      return newVinculacoes;
    });
  };

  const handleSalvar = () => {
    if (Object.keys(itemVinculacoes).length > 0) {
      console.log("Vinculações salvas:", itemVinculacoes);
      onOpenChange(false);
      setItemVinculacoes({});
      setSearchTerm("");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setItemVinculacoes({});
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[80vh] bg-white rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">Vincular Produto ao Pedido {pedido?.id}</DialogTitle>
              <p className="text-gray-600 mt-1">Selecione os produtos para vincular a cada item do pedido</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
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
              <div className="space-y-2">
                {filteredProdutos.map((produto) => {
                  const isUsed = Object.values(itemVinculacoes).includes(produto.id);
                  return (
                    <div
                      key={produto.id}
                      className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                        isUsed ? 'border-green-300 bg-green-50 opacity-60' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={produto.image}
                          alt={produto.nome}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{produto.nome}</h3>
                          <p className="text-sm text-gray-500">SKU: {produto.sku}</p>
                          <div className="flex items-center justify-between mt-1">
                            <Badge variant="outline" className="text-xs">
                              Estoque: {produto.estoque}
                            </Badge>
                            <span className="font-bold text-novura-primary">
                              R$ {produto.preco.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        {isUsed && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Itens do Pedido - Right Side */}
          <div className="w-96 flex flex-col bg-gray-50">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Itens do Pedido</h3>
              <p className="text-sm text-gray-600">
                {Object.keys(itemVinculacoes).length} de {pedido?.itens?.length || 0} item(s) vinculado(s)
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!pedido?.itens || pedido.itens.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>Nenhum item no pedido</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pedido.itens.map((item: any, index: number) => {
                    const itemId = `item-${index}`;
                    const produtoVinculado = itemVinculacoes[itemId];
                    const produto = produtoVinculado ? mockProdutos.find(p => p.id === produtoVinculado) : null;

                    return (
                      <div key={itemId} className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-900 text-sm">{item.produto}</h4>
                          <p className="text-xs text-gray-500">SKU: {item.sku} | Qtd: {item.quantidade}</p>
                          <p className="text-xs text-gray-600">R$ {item.valor.toFixed(2)}</p>
                        </div>

                        {produto ? (
                          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center space-x-2">
                              <img
                                src={produto.image}
                                alt={produto.nome}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <div>
                                <p className="text-xs font-medium text-green-800">{produto.nome}</p>
                                <p className="text-xs text-green-600">SKU: {produto.sku}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoverVinculacao(itemId)}
                              className="p-1 h-auto rounded-full hover:bg-red-50 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-xs text-gray-500 mb-2">Clique em um produto à esquerda para vincular</p>
                            <div className="flex flex-wrap gap-1">
                              {filteredProdutos.slice(0, 3).map((produto) => {
                                const isAlreadyUsed = Object.values(itemVinculacoes).includes(produto.id);
                                return (
                                  <button
                                    key={produto.id}
                                    onClick={() => !isAlreadyUsed && handleVincularProduto(itemId, produto.id)}
                                    disabled={isAlreadyUsed}
                                    className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                                      isAlreadyUsed 
                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                    }`}
                                  >
                                    {produto.nome.substring(0, 15)}...
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

            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={handleSalvar}
                disabled={Object.keys(itemVinculacoes).length === 0}
                className="w-full h-12 rounded-2xl bg-novura-primary"
              >
                Salvar Vinculação ({Object.keys(itemVinculacoes).length})
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
