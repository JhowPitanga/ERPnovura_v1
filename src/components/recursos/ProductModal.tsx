
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, Store, Calendar, Plus } from "lucide-react";

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: number;
    nome: string;
    preco: number;
    categoria: string;
    image: string;
    descricao: string;
    estoque: number;
  } | null;
  onAddToCart?: (product: any) => void;
}

export function ProductModal({ open, onOpenChange, product, onAddToCart }: ProductModalProps) {
  if (!product) return null;

  const seller = "Embalagens Express";
  const deliveryTime = "1-2 dias úteis";
  const hasFreightFree = product.preco > 50;
  const hasFastDelivery = product.categoria === "etiquetas" || product.categoria === "fitas";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Detalhes do Produto
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img 
                src={product.image} 
                alt={product.nome}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {hasFastDelivery && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  <Truck className="w-3 h-3 mr-1" />
                  Envio Rápido
                </Badge>
              )}
              {hasFreightFree && (
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                  Frete Grátis
                </Badge>
              )}
              {product.preco < 20 && (
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                  15% OFF
                </Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {product.nome}
              </h3>
              <p className="text-gray-600 mb-4">{product.descricao}</p>
              <div className="text-3xl font-bold text-novura-primary">
                R$ {product.preco.toFixed(2)}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Store className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Vendido por</p>
                    <p className="text-sm text-gray-600">{seller}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Entrega</p>
                    <p className="text-sm text-gray-600">{deliveryTime}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-novura-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">N</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Clube Novura</p>
                    <p className="text-sm text-gray-600">5% de desconto adicional para membros</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => {
                onAddToCart?.(product);
                onOpenChange(false);
              }}
              className="w-full bg-novura-primary hover:bg-novura-primary/90"
              disabled={product.estoque === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              {product.estoque > 0 ? "Adicionar ao Carrinho" : "Sem Estoque"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
