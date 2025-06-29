
import { useState } from "react";
import { Plus, Search, Filter, ExternalLink, Edit, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const marketplaces = ["Todos", "Mercado Livre", "Amazon", "Shopee", "Magazine Luiza", "Casas Bahia"];

export default function Anuncios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarketplace, setSelectedMarketplace] = useState("Todos");

  const filteredAds = mockAds.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.marketplaceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMarketplace = selectedMarketplace === "Todos" || ad.marketplace === selectedMarketplace;
    return matchesSearch && matchesMarketplace;
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
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Central de Anúncios</h1>
            <p className="text-gray-600">Gerencie seus anúncios em todos os marketplaces</p>
          </div>
          <Button className="bg-novura-primary hover:bg-novura-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Novo Anúncio
          </Button>
        </div>

        {/* Search and Filters */}
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
            Filtros Avançados
          </Button>
        </div>

        {/* Marketplace Tabs */}
        <Tabs value={selectedMarketplace} onValueChange={setSelectedMarketplace} className="mb-6">
          <TabsList className="grid w-full grid-cols-6">
            {marketplaces.map((marketplace) => (
              <TabsTrigger key={marketplace} value={marketplace} className="text-sm">
                {marketplace}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Anúncios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredAds.length}</div>
              <p className="text-xs text-muted-foreground">
                {selectedMarketplace === "Todos" ? "Todos os marketplaces" : selectedMarketplace}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anúncios Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {filteredAds.filter(ad => ad.status === "Ativo").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((filteredAds.filter(ad => ad.status === "Ativo").length / filteredAds.length) * 100)}% do total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredAds.reduce((acc, ad) => acc + ad.visits, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-novura-primary">
                {filteredAds.reduce((acc, ad) => acc + ad.sales, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Ads List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Anúncios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAds.map((ad) => (
                <div key={ad.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{ad.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={`${getMarketplaceColor(ad.marketplace)} text-white`}>
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
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          {ad.status === "Ativo" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
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
    </div>
  );
}
