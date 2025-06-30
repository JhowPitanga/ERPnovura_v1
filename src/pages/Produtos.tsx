
import { useState } from "react";
import { Plus, Package, Search, Filter, Grid3X3, Layers, Package2 } from "lucide-react";
import { CleanNavigation } from "@/components/CleanNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Bell, Users } from "lucide-react";

const navigationItems = [
  { title: "Únicos", path: "", description: "Produtos únicos" },
  { title: "Variações", path: "/variacoes", description: "Produtos com variações" },
  { title: "Kits", path: "/kits", description: "Kits e combos" },
];

const mockProducts = [
  {
    id: 1,
    name: "Smartphone Galaxy S24",
    sku: "SM-S24-001",
    price: 2999.99,
    stock: 45,
    category: "Eletrônicos",
    status: "Ativo",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Notebook Dell Inspiron",
    sku: "NB-DEL-002",
    price: 3499.99,
    stock: 23,
    category: "Informática",
    status: "Ativo",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Fone JBL Tune 720BT",
    sku: "FN-JBL-003",
    price: 299.99,
    stock: 8,
    category: "Áudio",
    status: "Baixo Estoque",
    image: "/placeholder.svg"
  },
];

export default function Produtos() {
  const [searchTerm, setSearchTerm] = useState("");

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
                <h2 className="text-lg font-semibold text-gray-900">Produtos</h2>
              </div>
              <div className="flex items-center space-x-4">
                {/* Bell for notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                
                {/* Team Drawer */}
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
          <main className="flex-1 p-6 overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
                <p className="text-gray-600">Gerencie seus produtos de forma inteligente</p>
              </div>
              <Button className="bg-novura-primary hover:bg-novura-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar produtos..."
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Produtos Únicos</CardTitle>
                  <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">856</div>
                  <p className="text-xs text-muted-foreground">69% do total</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Com Variações</CardTitle>
                  <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">312</div>
                  <p className="text-xs text-muted-foreground">25% do total</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Kits</CardTitle>
                  <Package2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">66</div>
                  <p className="text-xs text-muted-foreground">6% do total</p>
                </CardContent>
              </Card>
            </div>

            {/* Products List */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">R$ {product.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{product.stock} unidades</p>
                          <Badge variant={product.status === "Ativo" ? "default" : "destructive"}>
                            {product.status}
                          </Badge>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
