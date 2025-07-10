
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategoryDropdown } from "./CategoryDropdown";

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: any[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onAddCategory: (newCategory: { name: string; parent_id?: string }) => void;
  placeholder?: string;
}

export function ProductFilters({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  onAddCategory,
  placeholder = "Buscar produtos..."
}: ProductFiltersProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <CategoryDropdown
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        onAddCategory={onAddCategory}
      />
    </div>
  );
}
