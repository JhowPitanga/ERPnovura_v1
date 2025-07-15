
import { useState } from "react";
import { MoreHorizontal, Edit, Copy, Trash2, Link, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductTableProps {
  products: any[];
  loading: boolean;
  onDeleteProduct: (productId: string) => void;
  onRefresh?: () => void;
}

export function ProductTable({ products, loading, onDeleteProduct, onRefresh }: ProductTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleEdit = (productId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    window.location.href = `/produtos/editar/${productId}`;
  };

  const handleDuplicate = async (product: any, event: React.MouseEvent) => {
    event.stopPropagation();
    await duplicateProduct(product);
  };

  const handleDelete = (product: any, event: React.MouseEvent) => {
    event.stopPropagation();
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const duplicateProduct = async (product: any) => {
    try {
      const duplicatedProduct = {
        ...product,
        name: `${product.name} (Cópia)`,
        sku: `${product.sku}-COPY-${Date.now()}`,
        id: undefined, // Remove the ID so a new one is generated
        created_at: undefined,
        updated_at: undefined
      };

      const { data, error } = await supabase
        .from('products')
        .insert(duplicatedProduct)
        .select()
        .single();

      if (error) throw error;

      // If the original product has stock, duplicate it too
      if (product.products_stock && product.products_stock.length > 0) {
        const stockPromises = product.products_stock.map((stock: any) => 
          supabase.rpc('upsert_product_stock', {
            p_product_id: data.id,
            p_storage_id: stock.storage_id,
            p_quantity: stock.current || 0,
            p_reserved: stock.reserved || 0,
            p_in_transit: stock.in_transit || 0
          })
        );
        
        await Promise.all(stockPromises);
      }

      toast({
        title: "Sucesso",
        description: "Produto duplicado com sucesso",
      });

      if (onRefresh) onRefresh();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: `Erro ao duplicar produto: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    setBulkActionLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedProducts);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${selectedProducts.length} produtos excluídos com sucesso`,
      });

      setSelectedProducts([]);
      if (onRefresh) onRefresh();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: `Erro ao excluir produtos: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkDuplicate = async () => {
    setBulkActionLoading(true);
    try {
      const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));
      
      for (const product of selectedProductsData) {
        await duplicateProduct(product);
      }

      toast({
        title: "Sucesso",
        description: `${selectedProducts.length} produtos duplicados com sucesso`,
      });

      setSelectedProducts([]);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: `Erro ao duplicar produtos: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

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

  const allSelected = selectedProducts.length === products.length && products.length > 0;
  const someSelected = selectedProducts.length > 0 && selectedProducts.length < products.length;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedProducts.length} produto(s) selecionado(s)
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={bulkActionLoading}>
                    Ações em massa
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleBulkDuplicate}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicar selecionados
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBulkDelete} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir selecionados
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100">
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    ref={(ref) => {
                      if (ref) {
                        ref.indeterminate = someSelected;
                      }
                    }}
                  />
                </TableHead>
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
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const stockAmount = product.products_stock?.current || 0;
                  const categoryName = product.categories?.name || 'Sem categoria';
                  const imageUrl = product.image_urls?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
                  const isSelected = selectedProducts.includes(product.id);
                  
                  return (
                    <TableRow 
                      key={product.id} 
                      className="hover:bg-gray-50/50"
                    >
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                        />
                      </TableCell>
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
                            <DropdownMenuItem onClick={(e) => handleEdit(product.id, e)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleDuplicate(product, e)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={(e) => handleDelete(product, e)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{productToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (productToDelete) {
                  onDeleteProduct(productToDelete.id);
                  setDeleteDialogOpen(false);
                  setProductToDelete(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
