
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
  const [selectedProdutos, setSelectedProdutos] = useState<string[]>([]);
  const [selectedProdutoDetails, setSelectedProdutoDetails] = useState<any[]>([]);

  const filteredProdutos = mockProdutos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduto = (produto: any) => {
    if (!selectedProdutos.includes(produto.id)) {
      setSelectedProdutos([...selectedProdutos, produto.id]);
      setSelectedProdutoDetails([...selectedProdutoDetails, produto]);
    }
  };

  const handleRemoveProduto = (produtoId: string) => {
    setSelectedProdutos(selectedProdutos.filter(id => id !== produtoId));
    setSelectedProdutoDetails(selectedProdutoDetails.filter(p => p.id !== produtoId));
  };

  const handleSalvar = () => {
    if (selectedProdutos.length > 0) {
      // Here you would normally save the vinculation
      console.log("Vinculando produtos:", selectedProdutoDetails, "ao pedido:", pedido);
      onOpenChange(false);
      // Reset state
      setSelectedProdutos([]);
      setSelectedProdutoDetails([]);
      setSearchTerm("");
    }
  };

  const canClose = selectedProdutos.length >= (pedido?.items?.length || 1);

  return (
    <Dialog open={open} onOpenChange={canClose ? onOpenChange : undefined}>
      <DialogContent className="max-w-6xl h-[80vh] bg-white rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">Vincular Produto ao Pedido {pedido?.id}</DialogTitle>
              <p className="text-gray-600 mt-1">Selecione os produtos para vincular a este pedido</p>
            </div>
            {canClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
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
                {filteredProdutos.map((produto) => (
                  <div
                    key={produto.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                      selectedProdutos.includes(produto.id)
                        ? 'border-novura-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectProduto(produto)}
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
                      {selectedProdutos.includes(produto.id) && (
                        <Check className="w-5 h-5 text-novura-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Produtos Selecionados - Right Side */}
          <div className="w-96 flex flex-col bg-gray-50">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Produtos Selecionados</h3>
              <p className="text-sm text-gray-600">
                {selectedProdutos.length} de {pedido?.items?.length || 1} item(s) vinculado(s)
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {selectedProdutoDetails.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>Nenhum produto selecionado</p>
                  <p className="text-sm mt-1">Selecione produtos da lista ao lado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedProdutoDetails.map((produto) => (
                    <div key={produto.id} className="bg-white p-3 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <img
                          src={produto.image}
                          alt={produto.nome}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate text-sm">{produto.nome}</h4>
                          <p className="text-xs text-gray-500">SKU: {produto.sku}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProduto(produto.id)}
                          className="p-1 h-auto rounded-full hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={handleSalvar}
                disabled={selectedProdutos.length === 0}
                className="w-full h-12 rounded-2xl bg-novura-primary"
              >
                Salvar Vinculação ({selectedProdutos.length})
              </Button>
              {!canClose && (
                <p className="text-xs text-amber-600 mt-2 text-center">
                  Você deve vincular todos os itens do pedido antes de fechar
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
