
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CleanNavigation } from "@/components/CleanNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Package, MapPin, Award, Lightbulb } from "lucide-react";
import { Routes, Route, Navigate } from "react-router-dom";

const navigationItems = [
  { title: "Visão Geral", path: "", description: "Métricas principais" },
  { title: "Por Produto", path: "/produtos", description: "Desempenho individual" },
  { title: "Produtos em Alta", path: "/alta", description: "Tendências de mercado" },
  { title: "Ranking Vendas", path: "/ranking", description: "Top performers" },
  { title: "Por Localização", path: "/localizacao", description: "Vendas por estado" },
];

// Componentes das diferentes abas
function VisaoGeral() {
  return (
    <div className="space-y-6">
      {/* IA Suggestions */}
      <Card className="border-l-4 border-l-novura-primary bg-novura-primary/5">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-novura-primary" />
            <CardTitle className="text-lg">Sugestões da IA</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg border border-novura-primary/20">
              <p className="text-sm text-gray-700">
                📈 <strong>Oportunidade:</strong> Seus produtos da categoria "Eletrônicos" tiveram aumento de 23% nas vendas. Considere aumentar o estoque.
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-novura-primary/20">
              <p className="text-sm text-gray-700">
                🎯 <strong>Otimização:</strong> Anúncios no Mercado Livre estão com CTR baixo. Recomendamos melhorar as imagens dos produtos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <CardTitle className="text-sm font-medium text-gray-600">Pedidos</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">89</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% vs ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ticket Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">R$ 144</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5% vs ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conversão</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">3.2%</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +0.3% vs ontem
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PorProduto() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Produto</CardTitle>
          <CardDescription>Análise detalhada de cada produto</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Conteúdo em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ProdutosEmAlta() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Produtos em Alta</CardTitle>
          <CardDescription>Tendências de mercado nos marketplaces</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Conteúdo em desenvolvimento...</p>
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
              <Route path="/ranking" element={<RankingVendas />} />
              <Route path="/localizacao" element={<PorLocalizacao />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Desempenho;
