
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((produto) => (
        <Card key={produto.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-square overflow-hidden">
            <img 
              src={produto.image} 
              alt={produto.nome}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{produto.nome}</CardTitle>
            <CardDescription>{produto.descricao}</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-between mb-2">
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
              className="w-full bg-novura-primary hover:bg-novura-primary/90"
              disabled={produto.estoque === 0}
            >
              <Plus className="w-4 h-4 mr-1" />
              {produto.estoque > 0 ? "Adicionar" : "Sem Estoque"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
