
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, CreditCard, MapPin, Plus, Minus } from "lucide-react";
import { Routes, Route } from "react-router-dom";

const navigationItems = [
  { title: "Carrinho", path: "", description: "Gestão de carrinho" },
  { title: "Pedidos", path: "/pedidos", description: "Histórico de pedidos" },
  { title: "Configurações", path: "/config", description: "Configurações gerais" },
];

function Navigation({ items, basePath }: { items: any[], basePath: string }) {
  return (
    <div className="bg-white px-6 py-4">
      <div className="flex space-x-1">
        {items.map((item) => (
          <a
            key={item.path}
            href={`${basePath}${item.path}`}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
}

const carrinhoItems = [
  { id: 1, nome: "iPhone 15 Pro Max", preco: 8999.99, quantidade: 1, image: "/placeholder.svg" },
  { id: 2, nome: "AirPods Pro", preco: 2299.99, quantidade: 2, image: "/placeholder.svg" },
];

const meiosPagamento = [
  { id: "pix", nome: "PIX", ativo: true },
  { id: "cartao", nome: "Cartão de Crédito", ativo: true },
  { id: "boleto", nome: "Boleto Bancário", ativo: false },
];

function Carrinho() {
  const [items, setItems] = useState(carrinhoItems);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState("endereco1");

  const updateQuantidade = (id: number, delta: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantidade: Math.max(1, item.quantidade + delta) }
        : item
    ));
  };

  const total = items.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Carrinho */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Carrinho de Compras</CardTitle>
            <CardDescription>Gerencie os itens do seu carrinho</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <img 
                  src={item.image} 
                  alt={item.nome}
                  className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.nome}</h4>
                  <p className="text-sm text-gray-600">R$ {item.preco.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateQuantidade(item.id, -1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantidade}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateQuantidade(item.id, 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="font-semibold">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Resumo e Checkout */}
      <div className="space-y-6">
        {/* Endereço de Entrega */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Endereço de Entrega</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="endereco" 
                  value="endereco1"
                  checked={enderecoSelecionado === "endereco1"}
                  onChange={(e) => setEnderecoSelecionado(e.target.value)}
                />
                <div className="text-sm">
                  <p className="font-medium">Casa</p>
                  <p className="text-gray-600">Rua das Flores, 123 - Centro</p>
                  <p className="text-gray-600">São Paulo, SP - 01234-567</p>
                </div>
              </label>
              
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="endereco" 
                  value="endereco2"
                  checked={enderecoSelecionado === "endereco2"}
                  onChange={(e) => setEnderecoSelecionado(e.target.value)}
                />
                <div className="text-sm">
                  <p className="font-medium">Trabalho</p>
                  <p className="text-gray-600">Av. Paulista, 1000 - Bela Vista</p>
                  <p className="text-gray-600">São Paulo, SP - 01310-100</p>
                </div>
              </label>
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Novo Endereço
            </Button>
          </CardContent>
        </Card>

        {/* Meios de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Meio de Pagamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {meiosPagamento.map((meio) => (
              <label key={meio.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input type="radio" name="pagamento" value={meio.id} disabled={!meio.ativo} />
                  <span className={meio.ativo ? "text-gray-900" : "text-gray-400"}>
                    {meio.nome}
                  </span>
                </div>
                {meio.ativo ? (
                  <Badge variant="default">Disponível</Badge>
                ) : (
                  <Badge variant="outline">Indisponível</Badge>
                )}
              </label>
            ))}
            
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Cartão
            </Button>
          </CardContent>
        </Card>

        {/* Resumo do Pedido */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Frete</span>
              <span>R$ 15,90</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Desconto</span>
              <span>- R$ 0,00</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>R$ {(total + 15.90).toFixed(2)}</span>
            </div>
            
            <Button className="w-full bg-novura-primary hover:bg-novura-primary/90 h-12">
              Finalizar Compra
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PedidosHistorico() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Pedidos</CardTitle>
        <CardDescription>Seus pedidos realizados</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Nenhum pedido encontrado.</p>
      </CardContent>
    </Card>
  );
}

function Configuracoes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações</CardTitle>
        <CardDescription>Gerencie suas preferências</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Configurações em desenvolvimento...</p>
      </CardContent>
    </Card>
  );
}

const RecursosSeller = () => {
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
                <ShoppingBag className="w-6 h-6 text-novura-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Recursos Seller</h2>
              </div>
            </div>
          </header>

          {/* Navigation */}
          <Navigation items={navigationItems} basePath="/recursos-seller" />

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="" element={<Carrinho />} />
              <Route path="/pedidos" element={<PedidosHistorico />} />
              <Route path="/config" element={<Configuracoes />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default RecursosSeller;
