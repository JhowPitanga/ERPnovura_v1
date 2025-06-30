
import { useState } from "react";
import { Plus, Search, Filter, ExternalLink, Edit, Pause, Play, TrendingUp, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CleanNavigation } from "@/components/CleanNavigation";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const navigationItems = [
  { title: "Todos", path: "", description: "Visualizar todos os anúncios" },
  { title: "Ativos", path: "/ativos", description: "Anúncios ativos" },
  { title: "Pausados", path: "/pausados", description: "Anúncios pausados" },
];

const mockAds = [
  {
    id: 1,
    title: "Smartphone Galaxy S24 Ultra",
    sku: "SM-S24U-001",
    marketplace: "Mercado Livre",
    price: 4999.99,
    status: "Ativo",
    visits: 1245,
    questions: 8,
    sales: 23,
    stock: 15,
    marketplaceId: "MLB123456789",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Notebook Dell Inspiron 15",
    sku: "NB-DEL-002",
    marketplace: "Amazon",
    price: 3299.99,
    status: "Pausado",
    visits: 892,
    questions: 3,
    sales: 12,
    stock: 8,
    marketplaceId: "ASIN-B08N5WRWNW",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Fone JBL Tune 720BT",
    sku: "FN-JBL-003",
    marketplace: "Shopee",
    price: 289.99,
    status: "Ativo",
    visits: 567,
    questions: 12,
    sales: 45,
    stock: 32,
    marketplaceId: "SPE789123456",
    image: "/placeholder.svg"
  },
];

const salesChartData = [
  { name: 'Jan', ML: 65, Amazon: 45, Shopee: 25 },
  { name: 'Fev', ML: 59, Amazon: 52, Shopee: 30 },
  { name: 'Mar', ML: 80, Amazon: 48, Shopee: 35 },
  { name: 'Abr', ML: 81, Amazon: 55, Shopee: 40 },
  { name: 'Mai', ML: 56, Amazon: 60, Shopee: 45 },
  { name: 'Jun', ML: 55, Amazon: 58, Shopee: 50 },
];

export default function Anuncios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAd, setSelectedAd] = useState(null);

  const filteredAds = mockAds.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.marketplaceId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getMarketplaceColor = (marketplace: string) => {
    const colors = {
      "Mercado Livre": "bg-yellow-500",
      "Amazon": "bg-orange-500",
      "Shopee": "bg-red-500",
      "Magazine Luiza": "bg-blue-500",
      "Casas Bahia": "bg-purple-500"
    };
    return colors[marketplace as keyof typeof colors] || "bg-gray-500";
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
                <div className="w-8 h-8 bg-gradient-to-br from-novura-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Central de Anúncios</h2>
              </div>
            </div>
          </header>

          {/* Navigation */}
          <CleanNavigation items={navigationItems} basePath="/anuncios" />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestão de Anúncios</h1>
                  <p className="text-gray-600">Monitore e gerencie seus anúncios em todos os marketplaces</p>
                </div>
                <Button className="bg-novura-primary hover:bg-novura-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Anúncio
                </Button>
              </div>

              {/* Search */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por título, SKU ou ID do anúncio..."
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

              {/* Ads List */}
              <Card>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {filteredAds.map((ad) => (
                      <div key={ad.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                        <div className="flex items-center space-x-4">
                          <img
                            src={ad.image}
                            alt={ad.title}
                            className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">{ad.title}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={`${getMarketplaceColor(ad.marketplace)} text-white text-xs`}>
                                {ad.marketplace}
                              </Badge>
                              <span className="text-sm text-gray-500">SKU: {ad.sku}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">ID: {ad.marketplaceId}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-8">
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">R$ {ad.price.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{ad.stock} em estoque</p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-900">{ad.visits} visitas</p>
                            <p className="text-sm text-gray-500">{ad.questions} perguntas</p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-lg font-bold text-novura-primary">{ad.sales}</p>
                            <p className="text-sm text-gray-500">vendas</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge variant={ad.status === "Ativo" ? "default" : "secondary"}>
                              {ad.status}
                            </Badge>
                            
                            <div className="flex space-x-1">
                              <Drawer>
                                <DrawerTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedAd(ad)}>
                                    <TrendingUp className="w-4 h-4" />
                                  </Button>
                                </DrawerTrigger>
                                <DrawerContent>
                                  <DrawerHeader>
                                    <DrawerTitle>Desempenho do Anúncio</DrawerTitle>
                                    <DrawerDescription>
                                      Acompanhe as vendas e métricas do seu anúncio
                                    </DrawerDescription>
                                  </DrawerHeader>
                                  <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                      <Card>
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-sm">Vendas Totais</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="text-2xl font-bold text-novura-primary">{ad.sales}</div>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-sm">Visualizações</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="text-2xl font-bold">{ad.visits}</div>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-sm">Taxa de Conversão</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="text-2xl font-bold">{((ad.sales / ad.visits) * 100).toFixed(1)}%</div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                    
                                    <Card>
                                      <CardHeader>
                                        <CardTitle>Vendas por Marketplace</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="h-64">
                                          <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={salesChartData}>
                                              <CartesianGrid strokeDasharray="3 3" />
                                              <XAxis dataKey="name" />
                                              <YAxis />
                                              <Tooltip />
                                              <Line type="monotone" dataKey="ML" stroke="#f59e0b" strokeWidth={2} />
                                              <Line type="monotone" dataKey="Amazon" stroke="#f97316" strokeWidth={2} />
                                              <Line type="monotone" dataKey="Shopee" stroke="#ef4444" strokeWidth={2} />
                                            </LineChart>
                                          </ResponsiveContainer>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </DrawerContent>
                              </Drawer>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                {ad.status === "Ativo" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
