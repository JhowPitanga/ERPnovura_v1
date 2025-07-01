
import { Dashboard } from "@/components/Dashboard";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock, Star, TrendingUp, Package, AlertCircle, MessageSquare } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const aulasData = [
  {
    id: 1,
    titulo: "Introdução ao Novura ERP",
    duracao: "15 min",
    nivel: "Iniciante",
    avaliacao: 4.9,
    thumbnail: "/placeholder.svg",
    categoria: "Fundamentos"
  },
  {
    id: 2,
    titulo: "Gestão de Produtos Avançada",
    duracao: "25 min",
    nivel: "Intermediário",
    avaliacao: 4.8,
    thumbnail: "/placeholder.svg",
    categoria: "Produtos"
  },
  {
    id: 3,
    titulo: "Automação de Pedidos",
    duracao: "20 min",
    nivel: "Avançado",
    avaliacao: 4.9,
    thumbnail: "/placeholder.svg",
    categoria: "Pedidos"
  },
  {
    id: 4,
    titulo: "Relatórios e Analytics",
    duracao: "30 min",
    nivel: "Intermediário",
    avaliacao: 4.7,
    thumbnail: "/placeholder.svg",
    categoria: "Análises"
  },
  {
    id: 5,
    titulo: "Integrações de Marketplace",
    duracao: "35 min",
    nivel: "Avançado",
    avaliacao: 4.8,
    thumbnail: "/placeholder.svg",
    categoria: "Integrações"
  },
  {
    id: 6,
    titulo: "Controle de Estoque Inteligente",
    duracao: "22 min",
    nivel: "Intermediário",
    avaliacao: 4.9,
    thumbnail: "/placeholder.svg",
    categoria: "Estoque"
  }
];

const Index = () => {
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
                <h2 className="text-lg font-semibold text-gray-900">Dashboard Principal</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
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

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {/* Banner de Ofertas */}
            <div className="mb-8">
              <Dashboard />
            </div>
            
            {/* Quadro de Vendas do Dia */}
            <Card className="mb-8 border-0 shadow-lg rounded-xl bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Resumo do Dia</h3>
                  <Button asChild variant="outline" size="sm" className="rounded-xl">
                    <Link to="/desempenho">
                      Ver Desempenho
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900 mb-1">R$ 12.847</div>
                    <div className="text-sm text-gray-600">Vendas do Dia</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900 mb-1">89</div>
                    <div className="text-sm text-gray-600">Pedidos</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900 mb-1">22.5%</div>
                    <div className="text-sm text-gray-600">Margem do Dia</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quadro de Pedidos */}
            <Card className="mb-8 border-0 shadow-lg rounded-xl bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos Pedidos</h3>
                <div className="grid grid-cols-5 gap-4">
                  <Button asChild variant="ghost" className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50 rounded-xl">
                    <Link to="/pedidos">
                      <div className="text-2xl font-bold text-gray-900">18</div>
                      <div className="text-sm text-gray-600 text-center">Vincular</div>
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50 rounded-xl">
                    <Link to="/pedidos">
                      <div className="text-2xl font-bold text-gray-900">25</div>
                      <div className="text-sm text-gray-600 text-center">Impressão</div>
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50 rounded-xl">
                    <Link to="/pedidos">
                      <div className="text-2xl font-bold text-red-600">8</div>
                      <div className="text-sm text-red-600 text-center">Coleta Atrasada</div>
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50 rounded-xl">
                    <Link to="/pedidos">
                      <div className="text-2xl font-bold text-gray-900">67</div>
                      <div className="text-sm text-gray-600 text-center">Enviado</div>
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50 rounded-xl">
                    <Link to="/pedidos">
                      <div className="text-2xl font-bold text-gray-900">3</div>
                      <div className="text-sm text-gray-600 text-center">Devoluções</div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quadro de Estoque e CRM */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <Card className="border-0 shadow-lg rounded-xl bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Status do Estoque</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Sem Estoque Full</span>
                      <span className="font-semibold text-gray-900">5</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Sem Estoque Galpão</span>
                      <span className="font-semibold text-gray-900">12</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Estoque Baixo</span>
                      <span className="font-semibold text-gray-900">23</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg rounded-xl bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">CRM</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Perguntas
                      </span>
                      <span className="font-semibold text-gray-900">7</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Reclamações
                      </span>
                      <span className="font-semibold text-red-600">3</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Mensagens de Clientes
                      </span>
                      <span className="font-semibold text-gray-900">15</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Academia Novura - Carrossel */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Academia Novura</h2>
                  <p className="text-gray-600 mt-1">Aprenda a dominar todas as funcionalidades do sistema</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button asChild variant="outline" size="sm" className="rounded-xl">
                    <Link to="/novura-academy">
                      Ver Todos os Cursos
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex space-x-6 overflow-x-auto pb-4">
                {aulasData.map((aula) => (
                  <Card key={aula.id} className="flex-shrink-0 w-80 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white rounded-xl overflow-hidden group">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img 
                          src={aula.thumbnail} 
                          alt={aula.titulo}
                          className="w-full h-48 object-cover bg-gray-100"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-novura-primary text-white">
                            {aula.categoria}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="bg-white/90 text-gray-700">
                            {aula.nivel}
                          </Badge>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-6 h-6 text-novura-primary ml-1" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{aula.titulo}</h3>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{aula.duracao}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{aula.avaliacao}</span>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-novura-primary h-1.5 rounded-full" 
                            style={{ width: `${Math.random() * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {Math.floor(Math.random() * 80 + 10)}% concluído
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
