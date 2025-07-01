import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CleanNavigation } from "@/components/CleanNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, Package, MapPin, Award, Calendar as CalendarIcon, Filter } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

const navigationItems = [
  { title: "Visão Geral", path: "", description: "Métricas principais" },
  { title: "Por Produto", path: "/produtos", description: "Desempenho individual" },
  { title: "Produtos em Alta", path: "/alta", description: "Tendências de mercado" },
  { title: "Ranking Vendas", path: "/ranking", description: "Top performers" },
  { title: "Por Localização", path: "/localizacao", description: "Vendas por estado" },
];

const chartData = [
  { day: "Seg", value: 2400, label: "R$ 2.400" },
  { day: "Ter", value: 1398, label: "R$ 1.398" },
  { day: "Qua", value: 9800, label: "R$ 9.800" },
  { day: "Qui", value: 3908, label: "R$ 3.908" },
  { day: "Sex", value: 4800, label: "R$ 4.800" },
  { day: "Sáb", value: 3800, label: "R$ 3.800" },
  { day: "Dom", value: 4300, label: "R$ 4.300" },
];

const produtosVendidos = [
  { id: 1, nome: "iPhone 15 Pro Max", pedidos: 15, unidades: 18, valor: 161999.82, margem: 23.5 },
  { id: 2, nome: "MacBook Air M3", pedidos: 8, unidades: 8, valor: 103999.92, margem: 18.2 },
  { id: 3, nome: "Samsung Galaxy S24", pedidos: 22, unidades: 25, valor: 149999.75, margem: 25.8 },
  { id: 4, nome: "iPad Pro 12.9", pedidos: 12, unidades: 14, valor: 132999.86, margem: 19.7 },
];

function VisaoGeral() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: new Date(), to: new Date() });
  const [selectedMarketplace, setSelectedMarketplace] = useState("todos");

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y", { locale: ptBR })} -{" "}
                    {format(dateRange.to, "LLL dd, y", { locale: ptBR })}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y", { locale: ptBR })
                )
              ) : (
                "Selecione o período"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Select value={selectedMarketplace} onValueChange={setSelectedMarketplace}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Marketplace" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="mercadolivre">Mercado Livre</SelectItem>
            <SelectItem value="amazon">Amazon</SelectItem>
            <SelectItem value="shopee">Shopee</SelectItem>
            <SelectItem value="magazineluiza">Magazine Luiza</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Vendas Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">R$ 12.847</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +18% vs ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Unidades Vendidas</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">147</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +22% vs ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pedidos</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">89</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% vs ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ticket Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">R$ 144</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5% vs ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Margem</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">22.5%</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +1.2% vs ontem
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas por Dia</CardTitle>
          <CardDescription>Últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Vendas",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Lista de Produtos Vendidos */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos Vendidos no Período</CardTitle>
          <CardDescription>Lista completa de produtos vendidos</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Unidades Vendidas</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Margem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtosVendidos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="font-medium">{produto.nome}</TableCell>
                  <TableCell>{produto.pedidos}</TableCell>
                  <TableCell>{produto.unidades}</TableCell>
                  <TableCell>R$ {produto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <Badge variant={produto.margem > 20 ? "default" : "secondary"}>
                      {produto.margem}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function PorProduto() {
  const [activeTab, setActiveTab] = useState("produtos");

  const produtosData = [
    { id: 1, nome: "iPhone 15 Pro Max", pedidos: 15, unidades: 18, valor: 161999.82, margem: 23.5, vinculos: 5 },
    { id: 2, nome: "MacBook Air M3", pedidos: 8, unidades: 8, valor: 103999.92, margem: 18.2, vinculos: 3 },
  ];

  const anunciosData = [
    { id: 1, titulo: "iPhone 15 Pro Max 256GB Titânio", marketplace: "Mercado Livre", vendas: 12, valor: 8999.99 },
    { id: 2, titulo: "iPhone 15 Pro Max Azul Titânio", marketplace: "Amazon", vendas: 8, valor: 9299.99 },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("produtos")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "produtos" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Produtos
        </button>
        <button
          onClick={() => setActiveTab("anuncios")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "anuncios" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Anúncios
        </button>
      </div>

      {activeTab === "produtos" && (
        <Card>
          <CardHeader>
            <CardTitle>Produtos por Desempenho</CardTitle>
            <CardDescription>Lista de produtos vendidos no período</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Pedidos</TableHead>
                  <TableHead>Unidades Vendidas</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Margem</TableHead>
                  <TableHead>Vínculos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtosData.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell>{produto.pedidos}</TableCell>
                    <TableCell>{produto.unidades}</TableCell>
                    <TableCell>R$ {produto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge variant={produto.margem > 20 ? "default" : "secondary"}>
                        {produto.margem}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button variant="outline" size="sm">
                            {produto.vinculos} vínculos
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Anúncios Vinculados</DrawerTitle>
                            <DrawerDescription>
                              Lista de anúncios para {produto.nome}
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="p-6">
                            <div className="space-y-4">
                              {anunciosData.map((anuncio) => (
                                <div key={anuncio.id} className="flex justify-between items-center p-4 border rounded-lg">
                                  <div>
                                    <h4 className="font-medium">{anuncio.titulo}</h4>
                                    <Badge variant="outline">{anuncio.marketplace}</Badge>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">{anuncio.vendas} vendas</p>
                                    <p className="text-sm text-gray-600">R$ {anuncio.valor}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </DrawerContent>
                      </Drawer>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "anuncios" && (
        <Card>
          <CardHeader>
            <CardTitle>Anúncios por Desempenho</CardTitle>
            <CardDescription>Lista de anúncios vendidos no período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-4">
              <Select defaultValue="todos">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Marketplace" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="mercadolivre">Mercado Livre</SelectItem>
                  <SelectItem value="amazon">Amazon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Anúncio</TableHead>
                  <TableHead>Marketplace</TableHead>
                  <TableHead>Vendas</TableHead>
                  <TableHead>Valor Unitário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anunciosData.map((anuncio) => (
                  <TableRow key={anuncio.id}>
                    <TableCell className="font-medium">{anuncio.titulo}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{anuncio.marketplace}</Badge>
                    </TableCell>
                    <TableCell>{anuncio.vendas}</TableCell>
                    <TableCell>R$ {anuncio.valor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProdutosEmAlta() {
  const [selectedMarketplace, setSelectedMarketplace] = useState("mercadolivre");

  const topProdutos = [
    { categoria: "Eletrônicos", produtos: ["iPhone 15", "Samsung Galaxy S24", "MacBook Air"] },
    { categoria: "Casa e Jardim", produtos: ["Aspirador Robot", "Panela Elétrica", "Ventilador"] },
    { categoria: "Moda", produtos: ["Tênis Nike", "Relógio Smart", "Óculos Sol"] },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation por Marketplace */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {["mercadolivre", "amazon", "shopee", "magazineluiza"].map((marketplace) => (
          <button
            key={marketplace}
            onClick={() => setSelectedMarketplace(marketplace)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              selectedMarketplace === marketplace ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {marketplace === "mercadolivre" ? "Mercado Livre" : 
             marketplace === "magazineluiza" ? "Magazine Luiza" : marketplace}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>TOP 30 - Últimos 30 dias</CardTitle>
          <CardDescription>Produtos em alta no {selectedMarketplace}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {topProdutos.map((item, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-3">{item.categoria}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {item.produtos.map((produto, idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <h4 className="font-medium">{produto}</h4>
                      <p className="text-sm text-gray-600">#{idx + 1} em {item.categoria}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RankingVendas() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Vendas</CardTitle>
          <CardDescription>Top performers por marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Conteúdo em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function PorLocalizacao() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vendas por Localização</CardTitle>
          <CardDescription>Distribuição geográfica das vendas</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Conteúdo em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
}

const Desempenho = () => {
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
                <h2 className="text-lg font-semibold text-gray-900">Desempenho</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </header>

          {/* Navigation */}
          <CleanNavigation items={navigationItems} basePath="/desempenho" />

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="" element={<VisaoGeral />} />
              <Route path="/produtos" element={<PorProduto />} />
              <Route path="/alta" element={<ProdutosEmAlta />} />
              {/* <Route path="/ranking" element={<RankingVendas />} />
              <Route path="/localizacao" element={<PorLocalizacao />} /> */}
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Desempenho;
