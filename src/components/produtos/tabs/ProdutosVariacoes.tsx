
import { useState } from "react";
import { ProductFilters } from "../ProductFilters";
import { VariationsAccordion } from "../VariationsAccordion";

// Mock data for categories
const mockCategories = [
  { 
    id: "1", 
    name: "Eletrônicos",
    children: [
      { id: "11", name: "Celulares", parent_id: "1" },
      { id: "12", name: "Computadores", parent_id: "1" },
    ]
  },
  { 
    id: "2", 
    name: "Roupas",
    children: [
      { id: "21", name: "Camisetas", parent_id: "2" },
      { id: "22", name: "Calças", parent_id: "2" },
    ]
  },
  { id: "3", name: "Casa e Jardim" },
];

const produtosVariacoes = [
  {
    id: 1,
    name: "Camiseta Basic",
    sku_base: "CB-001",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
    variacoes: [
      { sku: "CB-001-P-AZ", tamanho: "P", cor: "Azul", price: 89.99, stock: 50 },
      { sku: "CB-001-M-AZ", tamanho: "M", cor: "Azul", price: 89.99, stock: 45 },
      { sku: "CB-001-G-VM", tamanho: "G", cor: "Vermelho", price: 89.99, stock: 35 },
    ]
  },
  {
    id: 2,
    name: "Tênis Esportivo",
    sku_base: "TE-002",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop",
    variacoes: [
      { sku: "TE-002-38-PT", tamanho: "38", cor: "Preto", price: 299.99, stock: 25 },
      { sku: "TE-002-39-PT", tamanho: "39", cor: "Preto", price: 299.99, stock: 30 },
      { sku: "TE-002-40-BR", tamanho: "40", cor: "Branco", price: 299.99, stock: 20 },
    ]
  },
];

export function ProdutosVariacoes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState(mockCategories);
  
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleAddCategory = (newCategory: { name: string; parent_id?: string }) => {
    const newId = Date.now().toString();
    
    if (newCategory.parent_id) {
      setCategories(prev => prev.map(cat => {
        if (cat.id === newCategory.parent_id) {
          return {
            ...cat,
            children: [
              ...(cat.children || []),
              { id: newId, name: newCategory.name, parent_id: newCategory.parent_id }
            ]
          };
        }
        return cat;
      }));
    } else {
      setCategories(prev => [
        ...prev,
        { id: newId, name: newCategory.name, children: [] }
      ]);
    }
  };
  
  return (
    <div className="space-y-6">
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onAddCategory={handleAddCategory}
        placeholder="Buscar produtos com variações..."
      />

      <VariationsAccordion products={produtosVariacoes} />
    </div>
  );
}
