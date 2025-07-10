
import { useState } from "react";
import { MoreHorizontal, Edit, Copy, Trash2, Link } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductTableProps {
  products: any[];
  loading: boolean;
}

export function ProductTable({ products, loading }: ProductTableProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="w-20">Imagem</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Custo de Compra</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Vínculos</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const stockAmount = product.products_stock?.current || 0;
                const categoryName = product.categories?.name || 'Sem categoria';
                const imageUrl = product.image_urls?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
                
                return (
                  <TableRow 
                    key={product.id} 
                    className="hover:bg-gray-50/50 cursor-pointer"
                    onClick={() => window.location.href = `/produtos/editar/${product.id}`}
                  >
                    <TableCell>
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{categoryName}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">R$ {(product.cost_price || 0).toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <span className={stockAmount < 10 ? "text-red-600 font-medium" : "text-gray-900"}>
                        {stockAmount} unidades
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Open vinculos modal
                        }}
                      >
                        <Link className="w-4 h-4 mr-1" />
                        0 vínculos
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => window.location.href = `/produtos/editar/${product.id}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            // TODO: Implement duplicate functionality
                            console.log('Duplicar produto:', product.id);
                          }}>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => {
                              // TODO: Implement delete functionality
                              console.log('Excluir produto:', product.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
