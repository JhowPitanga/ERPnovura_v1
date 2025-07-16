
import { useState } from "react";
import { ChevronDown, Plus, Tag, Trash2, Edit, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

type DrawerStep = 'filter' | 'create' | 'addChild' | 'edit';

export function CategoryDropdown({ categories, selectedCategory, onCategoryChange, onAddCategory, onUpdateCategory, onDeleteCategory }: CategoryDropdownProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<DrawerStep>('filter');
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newChildCategoryName, setNewChildCategoryName] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState("");

  const handleSaveCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory({ name: newCategoryName.trim() });
      setNewCategoryName("");
      setCurrentStep('filter');
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
      setCurrentStep('filter');
      setIsDrawerOpen(false);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (onDeleteCategory) {
      onDeleteCategory(categoryId);
    }
  };

  const resetDrawer = () => {
    setCurrentStep('filter');
    setNewCategoryName("");
    setNewChildCategoryName("");
    setSelectedParentCategory("");
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

  const renderDrawerContent = () => {
    switch (currentStep) {
      case 'filter':
        return (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TooltipProvider>
                {/* Card 1 - Cadastrar Categoria */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
                      onClick={() => setCurrentStep('create')}
                    >
                      <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                          <Tag className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Cadastrar Categoria</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Criar uma nova categoria principal
                        </p>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clique para criar uma nova categoria principal para organizar seus produtos</p>
                  </TooltipContent>
                </Tooltip>

                {/* Card 2 - Adicionar Categoria Filho */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
                      onClick={() => setCurrentStep('addChild')}
                    >
                      <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                          <Plus className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Categoria Filho</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Adicionar subcategoria a uma categoria existente
                        </p>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clique para adicionar uma subcategoria dentro de uma categoria principal existente</p>
                  </TooltipContent>
                </Tooltip>

                {/* Card 3 - Editar Categorias */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
                      onClick={() => setCurrentStep('edit')}
                    >
                      <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                          <Edit className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Editar Categorias</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Gerenciar e excluir categorias existentes
                        </p>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clique para editar nomes ou excluir categorias já cadastradas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        );

      case 'create':
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setCurrentStep('filter')}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
              <h3 className="text-lg font-semibold">Cadastrar Nova Categoria</h3>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Informações da Categoria
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
                  Salvar Categoria
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'addChild':
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setCurrentStep('filter')}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
              <h3 className="text-lg font-semibold">Adicionar Categoria Filho</h3>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Subcategoria
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
                  <Label htmlFor="child-category-name">Nome da Subcategoria</Label>
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
                  Salvar Subcategoria
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'edit':
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setCurrentStep('filter')}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
              <h3 className="text-lg font-semibold">Editar Categorias</h3>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Edit className="w-5 h-5 mr-2" />
                  Categorias Cadastradas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="text-center py-8">
                    <Info className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

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
          <DropdownMenuItem onClick={() => {
            resetDrawer();
            setIsDrawerOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar/Editar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Drawer open={isDrawerOpen} onOpenChange={(open) => {
        setIsDrawerOpen(open);
        if (!open) resetDrawer();
      }}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Gerenciar Categorias</DrawerTitle>
          </DrawerHeader>
          {renderDrawerContent()}
        </DrawerContent>
      </Drawer>
    </>
  );
}
