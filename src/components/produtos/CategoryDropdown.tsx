
import { useState } from "react";
import { ChevronDown, Plus, Tag, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  parent_id?: string;
  children?: Category[];
}

interface CategoryDropdownProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onAddCategory: (category: { name: string; parent_id?: string }) => void;
  onUpdateCategory?: (categoryId: string, name: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
}

export function CategoryDropdown({ categories, selectedCategory, onCategoryChange, onAddCategory, onUpdateCategory, onDeleteCategory }: CategoryDropdownProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newChildCategoryName, setNewChildCategoryName] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState("");

  const handleSaveCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory({ name: newCategoryName.trim() });
      setNewCategoryName("");
      setIsDrawerOpen(false);
    }
  };

  const handleSaveChildCategory = () => {
    if (newChildCategoryName.trim() && selectedParentCategory) {
      onAddCategory({ 
        name: newChildCategoryName.trim(), 
        parent_id: selectedParentCategory 
      });
      setNewChildCategoryName("");
      setSelectedParentCategory("");
      setIsDrawerOpen(false);
    }
  };

  const renderCategoryItems = (cats: Category[], level = 0) => {
    return cats.map((category) => (
      <div key={category.id}>
        <DropdownMenuItem
          onClick={() => onCategoryChange(category.id)}
          className={`${level > 0 ? 'pl-6' : ''} ${selectedCategory === category.id ? 'bg-muted' : ''}`}
        >
          <Tag className="w-4 h-4 mr-2" />
          {category.name}
        </DropdownMenuItem>
        {category.children && category.children.length > 0 && (
          <>
            {renderCategoryItems(category.children, level + 1)}
          </>
        )}
      </div>
    ));
  };

  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || "Todas as categorias";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Tag className="w-4 h-4 mr-2" />
            {selectedCategoryName}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem
            onClick={() => onCategoryChange("")}
            className={selectedCategory === "" ? 'bg-muted' : ''}
          >
            <Tag className="w-4 h-4 mr-2" />
            Todas as categorias
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {renderCategoryItems(categories)}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDrawerOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar/Editar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Gerenciar Categorias</DrawerTitle>
          </DrawerHeader>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 - Cadastrar Categoria */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Cadastrar Categoria
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-name">Nome da Categoria</Label>
                    <Input
                      id="category-name"
                      placeholder="Ex: Eletrônicos"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleSaveCategory}
                    className="w-full"
                    disabled={!newCategoryName.trim()}
                  >
                    Salvar
                  </Button>
                </CardContent>
              </Card>

              {/* Card 2 - Adicionar Categoria Filho */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Adicionar Categoria Filho
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent-category">Categoria Pai</Label>
                    <Select value={selectedParentCategory} onValueChange={setSelectedParentCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria pai" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="child-category-name">Nome da Categoria Filho</Label>
                    <Input
                      id="child-category-name"
                      placeholder="Ex: Celulares"
                      value={newChildCategoryName}
                      onChange={(e) => setNewChildCategoryName(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleSaveChildCategory}
                    className="w-full"
                    disabled={!newChildCategoryName.trim() || !selectedParentCategory}
                  >
                    Salvar
                  </Button>
                </CardContent>
              </Card>

              {/* Card 3 - Editar Categorias */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Edit className="w-5 h-5 mr-2" />
                    Editar Categorias
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-60 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{category.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDeleteCategory?.(category.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-sm text-gray-500 text-center">Nenhuma categoria cadastrada</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
