
import { useState } from "react";
import { Package, Warehouse, TrendingUp, TrendingDown, AlertTriangle, Search, Filter, Eye, Edit, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Bell, Users } from "lucide-react";

const armazens = [
  { id: "todos", name: "Todos os Armazéns" },
  { id: "principal", name: "Armazém Principal" },
  { id: "secundario", name: "Armazém Secundário" },
  { id: "externo", name: "Armazém Externo" },
];

const estoqueData = [
  { id: 1, produto: "iPhone 15 Pro", sku: "IPH15P-001", armazem: "Armazém Principal", estoque: 25, minimo: 10, maximo: 50, status: "Normal", ultimaMovimentacao: "2024-01-15", valor: 199997.50 },
  { id: 2, produto: "MacBook Air M2", sku: "MBA-M2-002", armazem: "Armazém Principal", estoque: 8, minimo: 15, maximo: 30, status: "Baixo", ultimaMovimentacao: "2024-01-14", valor: 79999.20 },
  { id: 3, produto: "AirPods Pro", sku: "APP-003", armazem: "Armazém Secundário", estoque: 45, minimo: 20, maximo: 100, status: "Normal", ultimaMovimentacao: "2024-01-13", valor: 103495.50 },
  { id: 4, produto: "iPad Air", sku: "IPA-004", armazem: "Armazém Principal", estoque: 2, minimo: 5, maximo: 25, status: "Crítico", ultimaMovimentacao: "2024-01-12", valor: 9999.98 },
  { id: 5, produto: "Apple Watch Series 9", sku: "AWS9-005", armazem: "Armazém Externo", estoque: 35, minimo: 15, maximo: 40, status: "Normal", ultimaMovimentacao: "2024-01-11", valor: 122499.65 },
];

const movimentacoes = [
  { id: 1, tipo: "Entrada", produto: "iPhone 15 Pro", quantidade: 10, data: "2024-01-15", usuario: "João Silva", observacao: "Compra fornecedor" },
  { id: 2, tipo: "Saída", produto: "MacBook Air M2", quantidade: -3, data: "2024-01-14", usuario: "Maria Santos", observacao: "Venda Mercado Livre" },
  { id: 3, tipo: "Entrada", produto: "AirPods Pro", quantidade: 20, data: "2024-01-13", usuario: "Pedro Costa", observacao: "Transferência armazém" },
  { id: 4, tipo: "Saída", produto: "iPad Air", quantidade: -1, data: "2024-01-12", usuario: "Ana Lima", observacao: "Venda Amazon" },
];

export default function Estoque() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArmazem, setSelectedArmazem] = useState("todos");
  const [activeTab, setActiveTab] = useState("estoque");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Crítico":
        return <Badge variant="destructive">Crítico</Badge>;
      case "Baixo":
        return <Badge className="bg-yellow-500">Baixo</Badge>;
      default:
        return <Badge variant="default">Normal</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Crítico":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "Baixo":
        return <TrendingDown className="w-4 h-4 text-yellow-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-green-500" />;
    }
  };

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
                <Warehouse className="w-6 h-6 text-novura-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Controle de Estoque</h2>
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
          
          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestão de Estoque</h1>
                <p className="text-gray-600">Controle operacional completo do seu estoque</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Total em Estoque</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 515.991,83</div>
                  <p className="text-xs text-muted-foreground">+8% desde o mês passado</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">115</div>
                  <p className="text-xs text-muted-foreground">5 itens</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
                  <TrendingDown className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <p className="text-xs text-muted-foreground">Produtos abaixo do mínimo</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estoque Crítico</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <p className="text-xs text-muted-foreground">Reposição urgente</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex space-x-4 border-b">
                <button
                  onClick={() => setActiveTab("estoque")}
                  className={`pb-2 px-1 border-b-2 transition-colors ${
                    activeTab === "estoque"
                      ? "border-novura-primary text-novura-primary"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Controle de Estoque
                </button>
                <button
                  onClick={() => setActiveTab("movimentacoes")}
                  className={`pb-2 px-1 border-b-2 transition-colors ${
                    activeTab === "movimentacoes"
                      ? "border-novura-primary text-novura-primary"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Movimentações
                </button>
              </div>
            </div>

            {/* Filters */}
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
              <Select value={selectedArmazem} onValueChange={setSelectedArmazem}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {armazens.map((armazem) => (
                    <SelectItem key={armazem.id} value={armazem.id}>
                      {armazem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Content */}
            {activeTab === "estoque" && (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-100">
                        <TableHead>Produto</TableHead>
                        <TableHead>Armazém</TableHead>
                        <TableHead>Em Estoque</TableHead>
                        <TableHead>Estoque Mín.</TableHead>
                        <TableHead>Estoque Máx.</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Valor Total</TableHead>
                        <TableHead className="w-20">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {estoqueData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50/50">
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{item.produto}</p>
                              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{item.armazem}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(item.status)}
                              <span className="font-medium">{item.estoque}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-gray-600">{item.minimo}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-gray-600">{item.maximo}</span>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(item.status)}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
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
                                  Ajustar Estoque
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
            )}

            {activeTab === "movimentacoes" && (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-100">
                        <TableHead>Tipo</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Observação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movimentacoes.map((mov) => (
                        <TableRow key={mov.id} className="hover:bg-gray-50/50">
                          <TableCell>
                            <Badge variant={mov.tipo === "Entrada" ? "default" : "destructive"}>
                              {mov.tipo}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{mov.produto}</span>
                          </TableCell>
                          <TableCell>
                            <span className={mov.quantidade > 0 ? "text-green-600" : "text-red-600"}>
                              {mov.quantidade > 0 ? "+" : ""}{mov.quantidade}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-gray-600">{new Date(mov.data).toLocaleDateString('pt-BR')}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-gray-900">{mov.usuario}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-gray-600">{mov.observacao}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
