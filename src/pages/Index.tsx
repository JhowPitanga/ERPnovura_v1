
import { Dashboard } from "@/components/Dashboard";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Star } from "lucide-react";

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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-white">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100/60 flex items-center px-6 shadow-sm">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">Dashboard Principal</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 bg-white rounded-2xl px-4 py-2 shadow-sm ring-1 ring-gray-200/60">
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
            <Dashboard />
            
            {/* Aulas do Sistema - Carrossel */}
            <div className="mt-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Academia Novura
                </h2>
                <p className="text-gray-600 mt-1">Aprenda a dominar todas as funcionalidades do sistema</p>
              </div>
              
              <div className="flex space-x-6 overflow-x-auto pb-4">
                {aulasData.map((aula) => (
                  <Card key={aula.id} className="flex-shrink-0 w-80 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden group">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img 
                          src={aula.thumbnail} 
                          alt={aula.titulo}
                          className="w-full h-48 object-cover bg-gradient-to-br from-novura-primary/20 to-purple-600/20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-gradient-to-r from-novura-primary to-purple-600 text-white">
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
                            className="bg-gradient-to-r from-novura-primary to-purple-600 h-1.5 rounded-full" 
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
