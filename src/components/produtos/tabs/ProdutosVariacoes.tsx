
import { useState } from "react";
import { ProductFilters } from "../ProductFilters";
import { VariationsAccordion } from "../VariationsAccordion";
import { useCategories } from "@/hooks/useCategories";
import { useVariations } from "@/hooks/useVariations";

export function ProdutosVariacoes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { categories, createCategory } = useCategories();
  const { variationGroups, loading } = useVariations();
  
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

  // Filtrar variações pela categoria selecionada e termo de busca
  const filteredVariations = variationGroups
    .filter(group => {
      if (!selectedCategory) return true;
      return group.category_id === selectedCategory;
    })
    .filter(group => {
      if (!searchTerm) return true;
      return (
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.sku.toLowerCase().includes(searchTerm.toLowerCase())
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
        placeholder="Buscar produtos com variações..."
      />

      <VariationsAccordion products={filteredVariations} loading={loading} />
    </div>
  );
}
