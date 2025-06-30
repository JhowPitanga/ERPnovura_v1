
import { useState } from "react";
import { Search, Filter, Settings, FileText, Printer, Sparkles, Bot, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PedidoDetails } from "@/components/pedidos/PedidoDetails";

const statusBlocks = [
  { id: "vincular", title: "Vincular", count: 18, color: "from-blue-500 to-blue-600", description: "Pedidos aguardando vinculação" },
  { id: "emissao", title: "Emissão de NF", count: 12, color: "from-yellow-500 to-orange-500", description: "Aguardando emissão de nota fiscal" },
  { id: "impressao", title: "Impressão", count: 25, color: "from-purple-500 to-purple-600", description: "Prontos para impressão" },
  { id: "coleta", title: "Aguardando Coleta", count: 34, color: "from-orange-500 to-red-500", description: "Aguardando coleta" },
  { id: "enviado", title: "Enviado", count: 67, color: "from-green-500 to-emerald-500", description: "Pedidos enviados" },
  { id: "cancelados", title: "Cancelados", count: 5, color: "from-red-500 to-red-600", description: "Pedidos cancelados" },
  { id: "devolucoes", title: "Devoluções", count: 3, color: "from-gray-500 to-gray-600", description: "Devoluções" },
];

const mockPedidos = {
  vincular: [
    { id: "PED001", marketplace: "Mercado Livre", produto: "iPhone 15 Pro Max 256GB", cliente: "João Silva Santos", valor: 8999.99, data: "15/01/2024", status: "Pendente", margem: 22.5, problema: false, aiSuggestion: "Produto com alta demanda" },
    { id: "PED002", marketplace: "Amazon", produto: "MacBook Air M3 16GB 512GB", cliente: "Maria Santos Costa", valor: 12999.99, data: "15/01/2024", status: "Pendente", margem: 18.3, problema: true, aiSuggestion: "Verificar estoque urgente" },
    { id: "PED003", marketplace: "Shopee", produto: "Samsung Galaxy S24 Ultra", cliente: "Carlos Lima", valor: 6799.99, data: "15/01/2024", status: "Pendente", margem: 25.1, problema: false, aiSuggestion: "Margem excelente" },
    { id: "PED004", marketplace: "Magazine Luiza", produto: "iPad Pro 12.9 256GB", cliente: "Ana Costa", valor: 9499.99, data: "14/01/2024", status: "Pendente", margem: 19.8, problema: false, aiSuggestion: null },
    { id: "PED005", marketplace: "Casas Bahia", produto: "Apple Watch Series 9", cliente: "Roberto Alves", valor: 3899.99, data: "14/01/2024", status: "Pendente", margem: 28.7, problema: false, aiSuggestion: "Produto premium com boa margem" },
    { id: "PED006", marketplace: "Americanas", produto: "AirPods Pro 2ª Geração", cliente: "Fernanda Lima", valor: 2199.99, data: "14/01/2024", status: "Pendente", margem: 21.4, problema: false, aiSuggestion: null },
    { id: "PED007", marketplace: "Mercado Livre", produto: "Sony WH-1000XM5", cliente: "Pedro Santos", valor: 1899.99, data: "13/01/2024", status: "Pendente", margem: 23.8, problema: false, aiSuggestion: "Produto em alta" },
    { id: "PED008", marketplace: "Shopee", produto: "Nintendo Switch OLED", cliente: "Juliana Costa", valor: 2799.99, data: "13/01/2024", status: "Pendente", margem: 17.2, problema: true, aiSuggestion: "Margem baixa - revisar precificação" },
  ],
  emissao: [
    { id: "PED009", marketplace: "Amazon", produto: "Dell XPS 13 Plus", cliente: "Marcos Silva", valor: 8999.99, data: "12/01/2024", status: "Vinculado", margem: 20.5, problema: false, aiSuggestion: null },
    { id: "PED010", marketplace: "Mercado Livre", produto: "iPhone 14 Pro 128GB", cliente: "Carla Santos", valor: 6999.99, data: "12/01/2024", status: "Vinculado", margem: 22.1, problema: false, aiSuggestion: "Emitir NF prioritário" },
  ],
  impressao: [
    { id: "PED011", marketplace: "Shopee", produto: "Samsung Monitor 27 4K", cliente: "Lucas Oliveira", valor: 2299.99, data: "11/01/2024", status: "NF Emitida", margem: 24.7, problema: false, aiSuggestion: null },
    { id: "PED012", marketplace: "Magazine Luiza", produto: "Logitech MX Master 3S", cliente: "Beatriz Costa", valor: 699.99, data: "11/01/2024", status: "NF Emitida", margem: 26.3, problema: false, aiSuggestion: "Produto com boa rotatividade" },
  ],
};

export default function Pedidos() {
  const [activeStatus, setActiveStatus] = useState("vincular");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);

  const currentPedidos = mockPedidos[activeStatus] || [];

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
                <div className="w-8 h-8 bg-gradient-to-br from-novura-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-gradient-to-br from-novura-primary to-purple-600 rounded-full"></div>
                  </div>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Pedidos</h2>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Gestão Inteligente de Pedidos
                  </h1>
                  <p className="text-gray-600 mt-1">Controle total com poder da IA para otimizar suas operações</p>
                </div>
              </div>

              {/* Status Blocks */}
              <div className="grid grid-cols-7 gap-4 mb-8">
                {statusBlocks.map((block) => (
                  <Card
                    key={block.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 bg-gradient-to-br ${block.color} text-white overflow-hidden relative ${
                      activeStatus === block.id ? "ring-4 ring-white shadow-2xl scale-105" : ""
                    }`}
                    onClick={() => setActiveStatus(block.id)}
                  >
                    <CardContent className="p-6 text-center relative z-10">
                      <div className="text-3xl font-bold mb-2">{block.count}</div>
                      <div className="text-sm font-medium opacity-95">{block.title}</div>
                      <div className="text-xs opacity-80 mt-1">{block.description}</div>
                    </CardContent>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                  </Card>
                ))}
              </div>

              {/* Search and Actions */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Buscar pedidos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 rounded-2xl border-0 bg-white shadow-lg ring-1 ring-gray-200/60"
                  />
                </div>
                <Button variant="outline" size="sm" className="h-12 px-6 rounded-2xl border-0 bg-white shadow-lg ring-1 ring-gray-200/60">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                
                {activeStatus === "impressao" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="h-12 px-6 rounded-2xl bg-gradient-to-r from-novura-primary to-purple-600 shadow-lg">
                        <Settings className="w-4 h-4 mr-2" />
                        Checkout de Impressão
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl rounded-3xl">
                      <DialogHeader>
                        <DialogTitle className="text-xl">Checkout de Impressão</DialogTitle>
                        <DialogDescription>
                          Configure e processe a impressão dos pedidos
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div>
                          <label className="text-sm font-medium">Formato de Impressão</label>
                          <Select defaultValue="zebra">
                            <SelectTrigger className="mt-2 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="zebra">Zebra 10x15</SelectItem>
                              <SelectItem value="pdf">PDF</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gradient-to-br from-gray-50 to-white">
                          <Printer className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">Área de bipagem de pedidos</p>
                          <p className="text-sm text-gray-400 mt-2">Escaneie os códigos dos pedidos aqui</p>
                        </div>
                        <Button className="w-full h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600">
                          Processar Impressão
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                
                {activeStatus === "emissao" && (
                  <Button className="h-12 px-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                    <FileText className="w-4 h-4 mr-2" />
                    Emissão em Massa
                  </Button>
                )}
              </div>

              {/* Pedidos List */}
              <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl">
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {currentPedidos.map((pedido) => (
                      <div key={pedido.id} className="flex items-center justify-between p-6 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-purple-50/30 transition-all duration-200 border-b border-gray-100/60 last:border-0 group">
                        <div className="flex items-center space-x-6">
                          <div className="flex flex-col items-center space-y-2">
                            {pedido.margem > 20 && (
                              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-3 h-3 text-white" />
                              </div>
                            )}
                            {pedido.aiSuggestion && (
                              <div className="w-6 h-6 bg-gradient-to-r from-novura-primary to-purple-600 rounded-full flex items-center justify-center">
                                <Bot className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{pedido.id}</h3>
                              <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200/60 px-3 py-1">
                                {pedido.marketplace}
                              </Badge>
                              {pedido.margem > 20 && (
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Alta Margem
                                </Badge>
                              )}
                              {pedido.aiSuggestion && (
                                <Badge className="bg-gradient-to-r from-novura-primary to-purple-600 text-white px-3 py-1">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  IA
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-900 font-medium mb-1">{pedido.produto}</p>
                            <p className="text-sm text-gray-600">{pedido.cliente}</p>
                            {pedido.aiSuggestion && (
                              <p className="text-xs text-purple-600 bg-purple-50 rounded-lg px-2 py-1 mt-2 inline-block">
                                💡 {pedido.aiSuggestion}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-8">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">R$ {pedido.valor.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{pedido.data}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className={`text-lg font-bold ${pedido.margem > 20 ? 'text-green-600' : 'text-purple-600'}`}>
                              {pedido.margem}%
                            </p>
                            <p className="text-xs text-gray-500">margem</p>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Drawer>
                              <DrawerTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="rounded-2xl border-0 bg-white shadow-md ring-1 ring-gray-200/60 hover:shadow-lg transition-all"
                                  onClick={() => setSelectedPedido(pedido)}
                                >
                                  Detalhes
                                </Button>
                              </DrawerTrigger>
                              <DrawerContent className="bg-gradient-to-b from-white to-gray-50/50">
                                <DrawerHeader>
                                  <DrawerTitle className="text-2xl">Detalhes do Pedido {pedido.id}</DrawerTitle>
                                  <DrawerDescription>
                                    Informações completas e detalhamento financeiro
                                  </DrawerDescription>
                                </DrawerHeader>
                                <div className="p-6 overflow-y-auto max-h-[80vh]">
                                  <PedidoDetails pedido={pedido} />
                                </div>
                              </DrawerContent>
                            </Drawer>
                            
                            {activeStatus === "vincular" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" className="rounded-2xl bg-gradient-to-r from-novura-primary to-purple-600 shadow-lg">
                                    Vincular
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="rounded-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Vincular Produto</DialogTitle>
                                    <DialogDescription>
                                      Selecione o produto para vincular ao pedido {pedido.id}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Select>
                                      <SelectTrigger className="rounded-2xl">
                                        <SelectValue placeholder="Selecione o produto" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="prod1">iPhone 15 Pro Max - SKU: IPH15PM-001</SelectItem>
                                        <SelectItem value="prod2">MacBook Air M3 - SKU: MBA-M3-002</SelectItem>
                                        <SelectItem value="prod3">Samsung Galaxy S24 Ultra - SKU: SGS24U-003</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button className="w-full h-12 rounded-2xl bg-gradient-to-r from-novura-primary to-purple-600">
                                      Confirmar Vinculação
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
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
