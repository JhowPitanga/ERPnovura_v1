
interface Category {
  id: string;
  nome: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex space-x-1">
      {categories.map((categoria) => (
        <button
          key={categoria.id}
          onClick={() => onCategoryChange(categoria.id)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeCategory === categoria.id
              ? "bg-novura-primary text-white" 
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          {categoria.nome} ({categoria.count})
        </button>
      ))}
    </div>
  );
}
