
import { useState } from "react";
import { ProductTable } from "../ProductTable";
import { ProductFilters } from "../ProductFilters";
import { useProducts, useCategories } from "@/hooks/useProducts";

export function ProdutosUnicos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { products, loading, refetch } = useProducts();
  const { categories, createCategory } = useCategories();
  
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleAddCategory = async (newCategory: { name: string; parent_id?: string }) => {
    try {
      await createCategory(newCategory.name);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  // Filtrar produtos únicos pela categoria selecionada e termo de busca
  const filteredProducts = products
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
        placeholder="Buscar produtos únicos..."
      />

      <ProductTable products={filteredProducts} loading={loading} />
    </div>
  );
}
