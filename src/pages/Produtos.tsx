
import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Edit, Eye, Trash2, Copy, Package } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import { CleanNavigation } from "@/components/CleanNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Bell, Users } from "lucide-react";
import { CriarProduto } from "@/components/produtos/CriarProduto";

const navigationItems = [
  { title: "Únicos", path: "", description: "Produtos únicos" },
  { title: "Variações", path: "/variacoes", description: "Produtos com variações" },
  { title: "Kits", path: "/kits", description: "Kits e combos" },
];

// Mock data for different product types
const produtosUnicos = [
  { id: 1, name: "iPhone 15 Pro", sku: "IPH15P-001", price: 7999.99, stock: 25, status: "Ativo", vinculos: "Mercado Livre, Amazon", image: "/placeholder.svg" },
  { id: 2, name: "MacBook Air M2", sku: "MBA-M2-002", price: 9999.99, stock: 12, status: "Ativo", vinculos: "Shopee, Magazine Luiza", image: "/placeholder.svg" },
  { id: 3, name: "AirPods Pro", sku: "APP-003", price: 2299.99, stock: 8, status: "Baixo Estoque", vinculos: "Americanas", image: "/placeholder.svg" },
  { id: 4, name: "iPad Air", sku: "IPA-004", price: 4999.99, stock: 15, status: "Ativo", vinculos: "Casas Bahia, Extra", image: "/placeholder.svg" },
  { id: 5, name: "Apple Watch Series 9", sku: "AWS9-005", price: 3499.99, stock: 20, status: "Ativo", vinculos: "Mercado Livre", image: "/placeholder.svg" },
];

const produtosVariacoes = [
  { id: 6, name: "Camiseta Basic", sku: "CB-VAR-001", price: 89.99, stock: 150, status: "Ativo", vinculos: "Shopee, Mercado Livre", image: "/placeholder.svg" },
  { id: 7, name: "Tênis Esportivo", sku: "TE-VAR-002", price: 299.99, stock: 75, status: "Ativo", vinculos: "Amazon, Netshoes", image: "/placeholder.svg" },
  { id: 8, name: "Smartphone Galaxy", sku: "SG-VAR-003", price: 1899.99, stock: 45, status: "Ativo", vinculos: "Magazine Luiza", image: "/placeholder.svg" },
];

const produtosKits = [
  { id: 9, name: "Kit Gamer Completo", sku: "KGC-001", price: 2499.99, stock: 10, status: "Ativo", vinculos: "Kabum, Pichau", image: "/placeholder.svg" },
  { id: 10, name: "Kit Escritório Home Office", sku: "KEHO-002", price: 899.99, stock: 18, status: "Ativo", vinculos: "Mercado Livre", image: "/placeholder.svg" },
];

function ProductTable({ products }: { products: any[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="w-20">Imagem</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Vínculos</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50/50">
                <TableCell>
                  <img
                    src={product.image}
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
                  <span className="font-medium">R$ {product.price.toFixed(2)}</span>
                </TableCell>
                <TableCell>
                  <span className={product.stock < 10 ? "text-red-600 font-medium" : "text-gray-900"}>
                    {product.stock} unidades
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={product.status === "Ativo" ? "default" : "destructive"}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{product.vinculos}</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ProdutosUnicos() {
  const [searchTerm, setSearchTerm] = useState("");
  
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
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      <ProductTable products={produtosUnicos} />
    </div>
  );
}

function ProdutosVariacoes() {
  const [searchTerm, setSearchTerm] = useState("");
  
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
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      <ProductTable products={produtosVariacoes} />
    </div>
  );
}

function ProdutosKits() {
  const [searchTerm, setSearchTerm] = useState("");
  
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
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      <ProductTable products={produtosKits} />
    </div>
  );
}

export default function Produtos() {
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

          {/* Navigation */}
          <CleanNavigation items={navigationItems} basePath="/produtos" />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {/* Header */}
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

              {/* Routes */}
              <Routes>
                <Route path="/" element={<ProdutosUnicos />} />
                <Route path="/variacoes" element={<ProdutosVariacoes />} />
                <Route path="/kits" element={<ProdutosKits />} />
                <Route path="/criar" element={<CriarProduto />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
