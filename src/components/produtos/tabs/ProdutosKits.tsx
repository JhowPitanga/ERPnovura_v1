
import { useState } from "react";
import { ProductFilters } from "../ProductFilters";
import { KitsAccordion } from "../KitsAccordion";

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

const produtosKits = [
  {
    id: 1,
    name: "Kit Gamer Completo",
    sku: "KGC-001",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop",
    produtos: [
      { name: "Teclado Mecânico", sku: "TM-001", quantidade: 1 },
      { name: "Mouse Gamer", sku: "MG-001", quantidade: 1 },
      { name: "Headset", sku: "HS-001", quantidade: 1 },
    ],
    price: 2499.99,
    stock: 10
  },
  {
    id: 2,
    name: "Kit Escritório Home Office",
    sku: "KEHO-002",
    image: "https://images.unsplash.com/photo-1487252665478-49b61b47f302?w=300&h=300&fit=crop",
    produtos: [
      { name: "Cadeira Ergonômica", sku: "CE-001", quantidade: 1 },
      { name: "Mesa Ajustável", sku: "MA-001", quantidade: 1 },
      { name: "Luminária LED", sku: "LL-001", quantidade: 1 },
    ],
    price: 899.99,
    stock: 18
  },
];

export function ProdutosKits() {
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
        placeholder="Buscar kits..."
      />

      <KitsAccordion kits={produtosKits} />
    </div>
  );
}
