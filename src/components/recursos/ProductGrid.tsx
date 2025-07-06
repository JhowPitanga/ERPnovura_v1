
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Truck } from "lucide-react";
import { ProductModal } from "./ProductModal";

interface Product {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
  image: string;
  descricao: string;
  estoque: number;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleImageClick = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const getProductTags = (product: Product) => {
    const tags = [];
    
    // Envio rápido para etiquetas e fitas
    if (product.categoria === "etiquetas" || product.categoria === "fitas") {
      tags.push({ text: "Envio Rápido", variant: "blue" });
    }
    
    // Frete grátis para produtos acima de R$ 50
    if (product.preco > 50) {
      tags.push({ text: "Frete Grátis", variant: "purple" });
    }
    
    // Desconto para produtos baratos
    if (product.preco < 20) {
      tags.push({ text: "15% OFF", variant: "orange" });
    }
    
    return tags;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((produto) => {
          const tags = getProductTags(produto);
          return (
            <Card key={produto.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={produto.image} 
                  alt={produto.nome}
                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => handleImageClick(produto)}
                />
                {tags.length > 0 && (
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {tags.map((tag, index) => (
                      <Badge 
                        key={index}
                        className={`text-xs ${
                          tag.variant === "blue" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                          tag.variant === "purple" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" :
                          "bg-orange-100 text-orange-800 hover:bg-orange-100"
                        }`}
                      >
                        {tag.variant === "blue" && <Truck className="w-3 h-3 mr-1" />}
                        {tag.text}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg group-hover:text-novura-primary transition-colors">
                  {produto.nome}
                </CardTitle>
                <CardDescription>{produto.descricao}</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-novura-primary">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {produto.estoque} un.
                  </Badge>
                </div>
                <Button 
                  onClick={() => onAddToCart(produto)}
                  size="sm"
                  className="w-full bg-novura-primary hover:bg-novura-primary/90 transition-colors"
                  disabled={produto.estoque === 0}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {produto.estoque > 0 ? "Adicionar" : "Sem Estoque"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ProductModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={selectedProduct}
        onAddToCart={onAddToCart}
      />
    </>
  );
}
