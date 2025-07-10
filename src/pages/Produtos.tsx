import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Eye, Trash2, Copy, Package, Link, Filter } from "lucide-react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CleanNavigation } from "@/components/CleanNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Bell, Users } from "lucide-react";
import { CriarProduto } from "@/components/produtos/CriarProduto";
import { EditarProduto } from "@/components/produtos/EditarProduto";
import { CategoryDropdown } from "@/components/produtos/CategoryDropdown";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const navigationItems = [
  { title: "Únicos", path: "", description: "Produtos únicos" },
  { title: "Variações", path: "/variacoes", description: "Produtos com variações" },
  { title: "Kits", path: "/kits", description: "Kits e combos" },
];

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

function ProductTable({ products, loading }: { products: any[]; loading: boolean }) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="w-20">Imagem</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Custo de Compra</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Vínculos</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const stockAmount = product.products_stock?.current || 0;
                const categoryName = product.categories?.name || 'Sem categoria';
                const imageUrl = product.image_urls?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
                
                return (
                  <TableRow 
                    key={product.id} 
                    className="hover:bg-gray-50/50 cursor-pointer"
                    onClick={() => window.location.href = `/produtos/editar/${product.id}`}
                  >
                    <TableCell>
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{categoryName}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">R$ {(product.cost_price || 0).toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <span className={stockAmount < 10 ? "text-red-600 font-medium" : "text-gray-900"}>
                        {stockAmount} unidades
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Open vinculos modal
                        }}
                      >
                        <Link className="w-4 h-4 mr-1" />
                        0 vínculos
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => window.location.href = `/produtos/editar/${product.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.location.href = `/produtos/editar/${product.id}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ProdutosUnicos() {
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
      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar produtos únicos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <CategoryDropdown
          categories={categories.map(cat => ({ id: cat.id, name: cat.name, children: [] }))}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onAddCategory={handleAddCategory}
        />
      </div>

      <ProductTable products={filteredProducts} loading={loading} />
    </div>
  );
}

function ProdutosVariacoes() {
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
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar produtos com variações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <CategoryDropdown
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onAddCategory={handleAddCategory}
        />
      </div>

      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {produtosVariacoes.map((produto) => (
              <AccordionItem key={produto.id} value={`item-${produto.id}`}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full pr-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={produto.image}
                        alt={produto.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                      />
                      <span className="font-medium">{produto.name}</span>
                    </div>
                    <Badge variant="outline">{produto.variacoes.length} variações</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>SKU</TableHead>
                          <TableHead>Tamanho</TableHead>
                          <TableHead>Cor</TableHead>
                          <TableHead>Preço</TableHead>
                          <TableHead>Estoque</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {produto.variacoes.map((variacao, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-mono text-sm">{variacao.sku}</TableCell>
                            <TableCell>{variacao.tamanho}</TableCell>
                            <TableCell>{variacao.cor}</TableCell>
                            <TableCell>R$ {variacao.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <span className={variacao.stock < 10 ? "text-red-600 font-medium" : "text-gray-900"}>
                                {variacao.stock}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

function ProdutosKits() {
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
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar kits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <CategoryDropdown
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onAddCategory={handleAddCategory}
        />
      </div>

      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {produtosKits.map((kit) => (
              <AccordionItem key={kit.id} value={`kit-${kit.id}`}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full pr-4">
                    <div className="flex items-center space-x-4 text-left">
                      <img
                        src={kit.image}
                        alt={kit.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                      />
                      <div>
                        <span className="font-medium block">{kit.name}</span>
                        <span className="text-sm text-gray-500">SKU: {kit.sku}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">R$ {kit.price.toFixed(2)}</span>
                      <Badge variant="outline" className="ml-2">{kit.produtos.length} itens</Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Quantidade</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {kit.produtos.map((produto, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{produto.name}</TableCell>
                            <TableCell className="font-mono text-sm">{produto.sku}</TableCell>
                            <TableCell>{produto.quantidade}x</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Estoque disponível:</span>
                        <span className={kit.stock < 10 ? "text-red-600 font-medium" : "text-gray-900 font-medium"}>
                          {kit.stock} kits
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Produtos() {
  const location = useLocation();
  
  // Check if we're on create or edit pages
  const isCreateOrEditPage = location.pathname.includes('/criar') || location.pathname.includes('/editar');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Package className="w-6 h-6 text-novura-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Produtos</h2>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      Equipe
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Chat da Equipe</DrawerTitle>
                      <DrawerDescription>
                        Converse com sua equipe em tempo real
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 h-96">
                      <div className="bg-gray-50 rounded-lg p-4 h-full flex items-center justify-center">
                        <p className="text-gray-500">Chat da equipe em desenvolvimento</p>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </header>

          {/* Navigation - Only show on main listing pages */}
          {!isCreateOrEditPage && (
            <CleanNavigation items={navigationItems} basePath="/produtos" />
          )}
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {/* Header - Only show on main listing pages */}
              {!isCreateOrEditPage && (
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestão de Produtos</h1>
                    <p className="text-gray-600">Gerencie seus produtos de forma inteligente</p>
                  </div>
                  <Button className="bg-novura-primary hover:bg-novura-primary/90" asChild>
                    <a href="/produtos/criar">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Produto
                    </a>
                  </Button>
                </div>
              )}

              {/* Routes */}
              <Routes>
                <Route path="/" element={<ProdutosUnicos />} />
                <Route path="/variacoes" element={<ProdutosVariacoes />} />
                <Route path="/kits" element={<ProdutosKits />} />
                <Route path="/criar" element={<CriarProduto />} />
                <Route path="/editar/:id" element={<EditarProduto />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
