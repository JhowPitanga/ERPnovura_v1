
import { useState } from "react";
import { Package, Warehouse, TrendingUp, TrendingDown, AlertTriangle, Search, Filter, Eye, Edit, MoreHorizontal, Plus, Truck, PackageCheck, PackageOpen, Archive, BarChart3, MapPin, Building2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const armazens = [
  { id: "todos", name: "Todos os Galpões" },
  { id: "galpao1", name: "Galpão Principal SP" },
  { id: "galpao2", name: "Galpão Secundário RJ" },
  { id: "galpao3", name: "Galpão Norte MG" },
  { id: "fulfillment", name: "Centro Fulfillment" },
];

const marketplaces = [
  { id: "todos", name: "Todos Marketplaces" },
  { id: "mercadolivre", name: "Mercado Livre" },
  { id: "amazon", name: "Amazon" },
  { id: "shopee", name: "Shopee" },
  { id: "magalu", name: "Magazine Luiza" },
];

const estoqueData = [
  { id: 1, produto: "iPhone 15 Pro", sku: "IPH15P-001", galpao: "Galpão Principal SP", endereco: "A01-B02-C03", estoque: 25, reservado: 5, disponivel: 20, minimo: 10, maximo: 50, status: "Normal", ultimaMovimentacao: "2024-01-15", valor: 199997.50, marketplace: "Mercado Livre" },
  { id: 2, produto: "MacBook Air M2", sku: "MBA-M2-002", galpao: "Centro Fulfillment", endereco: "B05-A01-D02", estoque: 8, reservado: 3, disponivel: 5, minimo: 15, maximo: 30, status: "Baixo", ultimaMovimentacao: "2024-01-14", valor: 79999.20, marketplace: "Amazon" },
  { id: 3, produto: "AirPods Pro", sku: "APP-003", galpao: "Galpão Secundário RJ", endereco: "C02-B03-A01", estoque: 45, reservado: 10, disponivel: 35, minimo: 20, maximo: 100, status: "Normal", ultimaMovimentacao: "2024-01-13", valor: 103495.50, marketplace: "Shopee" },
  { id: 4, produto: "iPad Air", sku: "IPA-004", galpao: "Galpão Principal SP", endereco: "A03-C01-B02", estoque: 2, reservado: 1, disponivel: 1, minimo: 5, maximo: 25, status: "Crítico", ultimaMovimentacao: "2024-01-12", valor: 9999.98, marketplace: "Magazine Luiza" },
];

const recebimentoData = [
  { id: 1, nf: "12345", fornecedor: "Apple Inc", produtos: 15, dataChegada: "2024-01-20", status: "Pendente", galpao: "Galpão Principal SP" },
  { id: 2, nf: "12346", fornecedor: "Samsung", produtos: 8, dataChegada: "2024-01-19", status: "Conferindo", galpao: "Centro Fulfillment" },
  { id: 3, nf: "12347", fornecedor: "Xiaomi", produtos: 25, dataChegada: "2024-01-18", status: "Concluído", galpao: "Galpão Secundário RJ" },
];

const pickingData = [
  { id: 1, pedido: "PED-001", cliente: "João Silva", produtos: 3, prioridade: "Alta", status: "Em Separação", operador: "Maria Santos", galpao: "Galpão Principal SP" },
  { id: 2, pedido: "PED-002", cliente: "Ana Costa", produtos: 1, prioridade: "Normal", status: "Aguardando", operador: "-", galpao: "Centro Fulfillment" },
  { id: 3, pedido: "PED-003", cliente: "Pedro Lima", produtos: 5, prioridade: "Urgente", status: "Separado", operador: "Carlos Oliveira", galpao: "Galpão Principal SP" },
];

const expedicaoData = [
  { id: 1, pedido: "PED-001", transportadora: "Correios", rastreamento: "BR123456789", status: "Embalado", previsao: "2024-01-22", galpao: "Galpão Principal SP" },
  { id: 2, pedido: "PED-003", transportadora: "Jadlog", rastreamento: "JD987654321", status: "Expedido", previsao: "2024-01-21", galpao: "Galpão Principal SP" },
  { id: 3, pedido: "PED-004", transportadora: "Total Express", rastreamento: "TE456789123", status: "Em Trânsito", previsao: "2024-01-20", galpao: "Centro Fulfillment" },
];

export default function Estoque() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGalpao, setSelectedGalpao] = useState("todos");
  const [selectedMarketplace, setSelectedMarketplace] = useState("todos");
  const [activeTab, setActiveTab] = useState("estoque");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Crítico":
        return <Badge variant="destructive">Crítico</Badge>;
      case "Baixo":
        return <Badge className="bg-yellow-500">Baixo</Badge>;
      case "Pendente":
        return <Badge className="bg-orange-500">Pendente</Badge>;
      case "Conferindo":
        return <Badge className="bg-blue-500">Conferindo</Badge>;
      case "Concluído":
        return <Badge className="bg-green-500">Concluído</Badge>;
      case "Em Separação":
        return <Badge className="bg-blue-500">Em Separação</Badge>;
      case "Aguardando":
        return <Badge className="bg-gray-500">Aguardando</Badge>;
      case "Separado":
        return <Badge className="bg-green-500">Separado</Badge>;
      case "Embalado":
        return <Badge className="bg-purple-500">Embalado</Badge>;
      case "Expedido":
        return <Badge className="bg-green-500">Expedido</Badge>;
      case "Em Trânsito":
        return <Badge className="bg-blue-500">Em Trânsito</Badge>;
      case "Urgente":
        return <Badge variant="destructive">Urgente</Badge>;
      case "Alta":
        return <Badge className="bg-orange-500">Alta</Badge>;
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
                <h2 className="text-lg font-semibold text-gray-900">Sistema WMS - Gestão Completa</h2>
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
                <h1 className="text-2xl font-bold text-gray-900">Sistema WMS Completo</h1>
                <p className="text-gray-600">Gestão completa de armazém com controle de fulfillment</p>
              </div>
              <Button className="bg-novura-primary hover:bg-novura-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Nova Operação
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">R$ 515.991,83</div>
                  <p className="text-xs text-muted-foreground">+8% vs mês anterior</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estoque Total</CardTitle>
                  <Archive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">115</div>
                  <p className="text-xs text-muted-foreground">5 produtos</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Picking Pendente</CardTitle>
                  <PackageOpen className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-orange-600">8</div>
                  <p className="text-xs text-muted-foreground">Pedidos aguardando</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expedições Hoje</CardTitle>
                  <Truck className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-blue-600">23</div>
                  <p className="text-xs text-muted-foreground">+12% vs ontem</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recebimentos</CardTitle>
                  <PackageCheck className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-green-600">3</div>
                  <p className="text-xs text-muted-foreground">Pendentes conferência</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fulfillment</CardTitle>
                  <Building2 className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-purple-600">45</div>
                  <p className="text-xs text-muted-foreground">Produtos ativos</p>
                </CardContent>
              </Card>
            </div>

            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-6 bg-white border-0 shadow-sm">
                <TabsTrigger value="estoque" className="data-[state=active]:bg-novura-primary data-[state=active]:text-white">
                  <Archive className="w-4 h-4 mr-2" />
                  Estoque
                </TabsTrigger>
                <TabsTrigger value="recebimento" className="data-[state=active]:bg-novura-primary data-[state=active]:text-white">
                  <PackageCheck className="w-4 h-4 mr-2" />
                  Recebimento
                </TabsTrigger>
                <TabsTrigger value="picking" className="data-[state=active]:bg-novura-primary data-[state=active]:text-white">
                  <PackageOpen className="w-4 h-4 mr-2" />
                  Picking
                </TabsTrigger>
                <TabsTrigger value="expedicao" className="data-[state=active]:bg-novura-primary data-[state=active]:text-white">
                  <Truck className="w-4 h-4 mr-2" />
                  Expedição
                </TabsTrigger>
                <TabsTrigger value="fulfillment" className="data-[state=active]:bg-novura-primary data-[state=active]:text-white">
                  <Building2 className="w-4 h-4 mr-2" />
                  Fulfillment
                </TabsTrigger>
                <TabsTrigger value="inventario" className="data-[state=active]:bg-novura-primary data-[state=active]:text-white">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Inventário
                </TabsTrigger>
              </TabsList>

              {/* Filters */}
              <div className="flex items-center space-x-4 mt-6 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar produtos, SKU, pedidos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedGalpao} onValueChange={setSelectedGalpao}>
                  <SelectTrigger className="w-48">
                    <MapPin className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {armazens.map((galpao) => (
                      <SelectItem key={galpao.id} value={galpao.id}>
                        {galpao.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedMarketplace} onValueChange={setSelectedMarketplace}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {marketplaces.map((marketplace) => (
                      <SelectItem key={marketplace.id} value={marketplace.id}>
                        {marketplace.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros Avançados
                </Button>
              </div>

              {/* Content */}
              <TabsContent value="estoque">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-100">
                          <TableHead>Produto</TableHead>
                          <TableHead>Galpão</TableHead>
                          <TableHead>Endereço</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Reservado</TableHead>
                          <TableHead>Disponível</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Marketplace</TableHead>
                          <TableHead>Valor</TableHead>
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
                              <span className="text-sm">{item.galpao}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.endereco}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(item.status)}
                                <span className="font-medium">{item.estoque}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-orange-600">{item.reservado}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-green-600 font-medium">{item.disponivel}</span>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(item.status)}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">{item.marketplace}</span>
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
                                    Movimentar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Realocar
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
              </TabsContent>

              <TabsContent value="recebimento">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-100">
                          <TableHead>Nota Fiscal</TableHead>
                          <TableHead>Fornecedor</TableHead>
                          <TableHead>Qtd Produtos</TableHead>
                          <TableHead>Data Chegada</TableHead>
                          <TableHead>Galpão</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-20">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recebimentoData.map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50/50">
                            <TableCell>
                              <span className="font-medium">{item.nf}</span>
                            </TableCell>
                            <TableCell>{item.fornecedor}</TableCell>
                            <TableCell>{item.produtos}</TableCell>
                            <TableCell>{new Date(item.dataChegada).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell>{item.galpao}</TableCell>
                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem>
                                    <PackageCheck className="w-4 h-4 mr-2" />
                                    Conferir
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Detalhes
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
              </TabsContent>

              <TabsContent value="picking">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-100">
                          <TableHead>Pedido</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Qtd Produtos</TableHead>
                          <TableHead>Prioridade</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Operador</TableHead>
                          <TableHead>Galpão</TableHead>
                          <TableHead className="w-20">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pickingData.map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50/50">
                            <TableCell>
                              <span className="font-medium">{item.pedido}</span>
                            </TableCell>
                            <TableCell>{item.cliente}</TableCell>
                            <TableCell>{item.produtos}</TableCell>
                            <TableCell>{getStatusBadge(item.prioridade)}</TableCell>
                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                            <TableCell>{item.operador}</TableCell>
                            <TableCell>{item.galpao}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem>
                                    <PackageOpen className="w-4 h-4 mr-2" />
                                    Iniciar Picking
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver Roteiro
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
              </TabsContent>

              <TabsContent value="expedicao">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-100">
                          <TableHead>Pedido</TableHead>
                          <TableHead>Transportadora</TableHead>
                          <TableHead>Rastreamento</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Previsão</TableHead>
                          <TableHead>Galpão</TableHead>
                          <TableHead className="w-20">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expedicaoData.map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50/50">
                            <TableCell>
                              <span className="font-medium">{item.pedido}</span>
                            </TableCell>
                            <TableCell>{item.transportadora}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.rastreamento}</Badge>
                            </TableCell>
                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                            <TableCell>{new Date(item.previsao).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell>{item.galpao}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem>
                                    <Truck className="w-4 h-4 mr-2" />
                                    Rastrear
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Detalhes
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
              </TabsContent>

              <TabsContent value="fulfillment">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Mercado Livre Full</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Produtos ativos:</span>
                          <span className="font-bold">15</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estoque total:</span>
                          <span className="font-bold">245</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vendas hoje:</span>
                          <span className="font-bold text-green-600">8</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Amazon FBA</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Produtos ativos:</span>
                          <span className="font-bold">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estoque total:</span>
                          <span className="font-bold">189</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vendas hoje:</span>
                          <span className="font-bold text-green-600">5</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Centro Próprio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Produtos ativos:</span>
                          <span className="font-bold">18</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estoque total:</span>
                          <span className="font-bold">312</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vendas hoje:</span>
                          <span className="font-bold text-green-600">12</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Produtos Fulfillment</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Marketplace</TableHead>
                          <TableHead>Estoque</TableHead>
                          <TableHead>Vendas 7d</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>iPhone 15 Pro</TableCell>
                          <TableCell>Mercado Livre</TableCell>
                          <TableCell>25</TableCell>
                          <TableCell>8</TableCell>
                          <TableCell><Badge className="bg-green-500">Ativo</Badge></TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inventario">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Próximos Inventários</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <p className="font-medium">Galpão Principal SP</p>
                            <p className="text-sm text-gray-600">Setor A - Eletrônicos</p>
                          </div>
                          <Badge>Agendado 25/01</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div>
                            <p className="font-medium">Centro Fulfillment</p>
                            <p className="text-sm text-gray-600">Geral</p>
                          </div>
                          <Badge className="bg-orange-500">Em Andamento</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Divergências Encontradas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div>
                            <p className="font-medium">iPad Air - IPA-004</p>
                            <p className="text-sm text-gray-600">Sistema: 5 | Físico: 3</p>
                          </div>
                          <Badge variant="destructive">-2</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-medium">AirPods Pro - APP-003</p>
                            <p className="text-sm text-gray-600">Sistema: 45 | Físico: 47</p>
                          </div>
                          <Badge className="bg-green-500">+2</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Relatório de Acuracidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">98.5%</p>
                        <p className="text-sm text-gray-600">Acuracidade Geral</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">12</p>
                        <p className="text-sm text-gray-600">Inventários Realizados</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600">3</p>
                        <p className="text-sm text-gray-600">Divergências Pendentes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
