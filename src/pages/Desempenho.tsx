
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  BarChart3, 
  MapPin, 
  Target,
  Sparkles,
  ArrowUpRight,
  Trophy
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Desempenho = () => {
  const salesData = [
    { name: 'Jan', vendas: 4000, lucro: 2400 },
    { name: 'Fev', vendas: 3000, lucro: 1398 },
    { name: 'Mar', vendas: 2000, lucro: 9800 },
    { name: 'Abr', vendas: 2780, lucro: 3908 },
    { name: 'Mai', vendas: 1890, lucro: 4800 },
    { name: 'Jun', vendas: 2390, lucro: 3800 },
  ];

  const topProducts = [
    { name: 'Tênis Nike Air', vendas: 145, receita: 'R$ 12.450' },
    { name: 'Smartphone Samsung', vendas: 89, receita: 'R$ 28.900' },
    { name: 'Fone Bluetooth', vendas: 234, receita: 'R$ 8.750' },
    { name: 'Camiseta Premium', vendas: 167, receita: 'R$ 5.680' },
  ];

  const marketplaceData = [
    { name: 'Mercado Livre', value: 45, color: '#FFE600' },
    { name: 'Amazon', value: 25, color: '#FF9900' },
    { name: 'Shopee', value: 20, color: '#FB6445' },
    { name: 'Outros', value: 10, color: '#7C3AED' },
  ];

  const statesSales = [
    { estado: 'SP', vendas: 2840, percentual: 35 },
    { estado: 'RJ', vendas: 1680, percentual: 21 },
    { estado: 'MG', vendas: 1200, percentual: 15 },
    { estado: 'RS', vendas: 980, percentual: 12 },
    { estado: 'PR', vendas: 760, percentual: 9 },
    { estado: 'SC', vendas: 540, percentual: 8 },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Desempenho e Métricas</h2>
              <Button className="bg-novura-primary hover:bg-novura-dark">
                <Sparkles className="w-4 h-4 mr-2" />
                Sugestões IA
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            <div className="space-y-6">
              {/* Métricas Principais */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Receita Total</p>
                        <p className="text-2xl font-bold">R$ 127.450</p>
                        <p className="text-sm text-green-100">+15% vs mês anterior</p>
                      </div>
                      <TrendingUp className="w-8 h-8" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Vendas</p>
                        <p className="text-2xl font-bold">847</p>
                        <p className="text-sm text-blue-100">+8% esta semana</p>
                      </div>
                      <BarChart3 className="w-8 h-8" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Taxa Conversão</p>
                        <p className="text-2xl font-bold">3.8%</p>
                        <p className="text-sm text-purple-100">+0.3% hoje</p>
                      </div>
                      <Target className="w-8 h-8" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100">Ticket Médio</p>
                        <p className="text-2xl font-bold">R$ 156</p>
                        <p className="text-sm text-orange-100">+R$ 12 vs média</p>
                      </div>
                      <Trophy className="w-8 h-8" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs de Navegação */}
              <Tabs defaultValue="vendas" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="vendas">Vendas Detalhadas</TabsTrigger>
                  <TabsTrigger value="produtos">Produtos em Alta</TabsTrigger>
                  <TabsTrigger value="marketplaces">Marketplaces</TabsTrigger>
                  <TabsTrigger value="geografia">Por Estado</TabsTrigger>
                </TabsList>

                {/* Tab Vendas Detalhadas */}
                <TabsContent value="vendas" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Evolução de Vendas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="vendas" fill="#7C3AED" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Lucro por Mês</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="lucro" stroke="#10B981" strokeWidth={3} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sugestões IA para Vendas */}
                  <Card className="border-2 border-novura-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center text-novura-primary">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Insights de IA - Vendas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2">📈 Tendência Positiva</h4>
                          <p className="text-green-700 text-sm">
                            Suas vendas estão 15% acima da média. Continue investindo em produtos de alta performance como "Tênis Nike Air".
                          </p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <h4 className="font-semibold text-yellow-800 mb-2">⚡ Oportunidade</h4>
                          <p className="text-yellow-700 text-sm">
                            Quinta-feira é seu melhor dia de vendas. Considere fazer promoções estratégicas nas quintas-feiras.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab Produtos em Alta */}
                <TabsContent value="produtos" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ranking dos Mais Vendidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topProducts.map((product, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-4">
                              <div className="w-8 h-8 bg-novura-primary text-white rounded-full flex items-center justify-center font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                <p className="text-sm text-gray-600">{product.vendas} vendas</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">{product.receita}</p>
                              <Button size="sm" variant="outline" className="mt-2">
                                Ver Detalhes
                                <ArrowUpRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab Marketplaces */}
                <TabsContent value="marketplaces" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Distribuição por Marketplace</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={marketplaceData}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}%`}
                            >
                              {marketplaceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Performance por Marketplace</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {marketplaceData.map((marketplace, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: marketplace.color }}
                              />
                              <span className="font-medium">{marketplace.name}</span>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary">{marketplace.value}%</Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Tab Por Estado */}
                <TabsContent value="geografia" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-novura-primary" />
                        Vendas por Estado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {statesSales.map((state, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm">
                                {state.estado}
                              </div>
                              <div>
                                <p className="font-medium">{state.vendas} vendas</p>
                                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                                  <div 
                                    className="bg-novura-primary h-2 rounded-full" 
                                    style={{ width: `${state.percentual}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-novura-primary">{state.percentual}%</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Desempenho;
