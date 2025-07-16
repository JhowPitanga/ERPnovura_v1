
import { useState } from "react";
import { ProductFilters } from "../ProductFilters";
import { KitsAccordion } from "../KitsAccordion";
import { useCategories } from "@/hooks/useCategories";
import { useKits } from "@/hooks/useKits";

export function ProdutosKits() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { categories, createCategory } = useCategories();
  const { kits, loading } = useKits();
  
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

  // Filtrar kits pela categoria selecionada e termo de busca
  const filteredKits = kits
    .filter(kit => {
      if (!selectedCategory) return true;
      return kit.category_id === selectedCategory;
    })
    .filter(kit => {
      if (!searchTerm) return true;
      return (
        kit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kit.sku.toLowerCase().includes(searchTerm.toLowerCase())
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
        placeholder="Buscar kits..."
      />

      <KitsAccordion kits={filteredKits} loading={loading} />
    </div>
  );
}
