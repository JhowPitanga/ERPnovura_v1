import { useState, useEffect } from "react";
import { ProductTable } from "../ProductTable";
import { ProductFilters } from "../ProductFilters";
import { useBindableProducts } from '@/hooks/useProducts';
import { useCategories } from "@/hooks/useCategories";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function ProdutosUnicos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { bindableProducts, loading } = useBindableProducts();
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();
  const { toast } = useToast();

  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    setList(bindableProducts || []);
  }, [bindableProducts]);
  
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleAddCategory = async (newCategory: { name: string; parent_id?: string }) => {
    try {
      await createCategory(newCategory.name, newCategory.parent_id);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleUpdateCategory = async (categoryId: string, name: string) => {
    try {
      await updateCategory(categoryId, name);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setList((prev) => prev.filter((p) => p.id !== productId));

      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir produto';
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    }
  };

  // Filtrar produtos únicos pela categoria selecionada e termo de busca
  const filteredProducts = (list || [])
    .filter(product => product.type === 'UNICO')
    .filter(product => {
      if (!selectedCategory) return true;
      return product.category_id === selectedCategory;
    })
    .filter(product => {
      if (!searchTerm) return true;
      return (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  
  return (
    <div className="space-y-6">
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories.map(cat => ({ id: cat.id, name: cat.name, children: [] }))}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        placeholder="Buscar produtos únicos..."
      />

      <ProductTable 
        products={filteredProducts} 
        loading={loading} 
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
}