
import { useState } from "react";
import { Search, Filter, Settings, FileText, Printer, Bot, TrendingUp, Zap, Scanner } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PedidoDetails } from "@/components/pedidos/PedidoDetails";
import { ScannerModal } from "@/components/pedidos/ScannerModal";

const statusBlocks = [
  { id: "vincular", title: "Vincular", count: 18, description: "Pedidos aguardando vinculação" },
  { id: "emissao", title: "Emissão de NF", count: 12, description: "Aguardando emissão de nota fiscal" },
  { id: "impressao", title: "Impressão", count: 25, description: "Prontos para impressão" },
  { id: "coleta", title: "Aguardando Coleta", count: 34, description: "Aguardando coleta" },
  { id: "enviado", title: "Enviado", count: 67, description: "Pedidos enviados" },
  { id: "cancelados", title: "Cancelados", count: 5, description: "Pedidos cancelados" },
  { id: "devolucoes", title: "Devoluções", count: 3, description: "Devoluções" },
];

const mockPedidos = {
  vincular: [
    { id: "PED001", marketplace: "Mercado Livre", produto: "iPhone 15 Pro Max 256GB", sku: "IPH15PM-256", cliente: "João Silva Santos", valor: 8999.99, data: "15/01/2024", status: "Pendente", margem: 22.5, problema: false, aiSuggestion: "Produto com alta demanda", image: "/placeholder.svg" },
    { id: "PED002", marketplace: "Amazon", produto: "MacBook Air M3 16GB 512GB", sku: "MBA-M3-512", cliente: "Maria Santos Costa", valor: 12999.99, data: "15/01/2024", status: "Pendente", margem: 18.3, problema: true, aiSuggestion: "Verificar estoque urgente", image: "/placeholder.svg" },
  ],
  emissao: [
    { id: "PED009", marketplace: "Amazon", produto: "Dell XPS 13 Plus", sku: "DXP-13P", cliente: "Marcos Silva", valor: 8999.99, data: "12/01/2024", status: "Vinculado", margem: 20.5, problema: false, aiSuggestion: null, image: "/placeholder.svg" },
  ],
  impressao: [
    { id: "PED011", marketplace: "Shopee", produto: "Samsung Monitor 27 4K", sku: "SM27-4K", cliente: "Lucas Oliveira", valor: 2299.99, data: "11/01/2024", status: "NF Emitida", margem: 24.7, problema: false, aiSuggestion: null, image: "/placeholder.svg" },
    { id: "PED012", marketplace: "Magazine Luiza", produto: "Logitech MX Master 3S", sku: "LMX-3S", cliente: "Beatriz Costa", valor: 699.99, data: "11/01/2024", status: "NF Emitida", margem: 26.3, problema: false, aiSuggestion: "Produto com boa rotatividade", image: "/placeholder.svg" },
  ],
};

export default function Pedidos() {
  const [activeStatus, setActiveStatus] = useState("vincular");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [selectedPedidosImpressao, setSelectedPedidosImpressao] = useState<string[]>([]);
  const [scannerOpen, setScannerOpen] = useState(false);

  const currentPedidos = mockPedidos[activeStatus] || [];

  const handleSelectPedidoImpressao = (pedidoId: string, checked: boolean) => {
    if (checked) {
      setSelectedPedidosImpressao([...selectedPedidosImpressao, pedidoId]);
    } else {
      setSelectedPedidosImpressao(selectedPedidosImpressao.filter(id => id !== pedidoId));
    }
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm">
              <SidebarTrigger className="mr-4" />
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-novura-primary rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-novura-primary rounded-full"></div>
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
                    <h1 className="text-3xl font-bold text-gray-900">
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
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-0 bg-white text-gray-900 overflow-hidden relative ${
                        activeStatus === block.id ? "ring-2 ring-novura-primary shadow-lg scale-105 bg-novura-primary text-white" : ""
                      }`}
                      onClick={() => setActiveStatus(block.id)}
                    >
                      <CardContent className="p-6 text-center relative z-10">
                        <div className="text-3xl font-bold mb-2">{block.count}</div>
                        <div className="text-sm font-medium">{block.title}</div>
                        <div className="text-xs opacity-80 mt-1">{block.description}</div>
                      </CardContent>
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
                    <>
                      <Button 
                        onClick={() => setScannerOpen(true)}
                        className="h-12 px-6 rounded-2xl bg-novura-primary shadow-lg"
                      >
                        <Scanner className="w-4 h-4 mr-2" />
                        Checkout de Impressão
                      </Button>
                      
                      {selectedPedidosImpressao.length > 0 && (
                        <Button variant="outline" className="h-12 px-6 rounded-2xl bg-white shadow-lg">
                          <FileText className="w-4 h-4 mr-2" />
                          Lista de Separação ({selectedPedidosImpressao.length})
                        </Button>
                      )}
                    </>
                  )}
                  
                  {activeStatus === "emissao" && (
                    <Button className="h-12 px-6 rounded-2xl bg-green-600 shadow-lg">
                      <FileText className="w-4 h-4 mr-2" />
                      Emissão em Massa
                    </Button>
                  )}
                </div>

                {/* Pedidos List */}
                <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {currentPedidos.map((pedido) => (
                        <div key={pedido.id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-0 group">
                          <div className="flex items-center space-x-6">
                            {activeStatus === "impressao" && (
                              <Checkbox
                                checked={selectedPedidosImpressao.includes(pedido.id)}
                                onCheckedChange={(checked) => handleSelectPedidoImpressao(pedido.id, checked)}
                              />
                            )}
                            
                            <img
                              src={pedido.image}
                              alt={pedido.produto}
                              className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                            />
                            
                            <div className="flex flex-col items-center space-y-2">
                              {pedido.margem > 20 && (
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <TrendingUp className="w-3 h-3 text-white" />
                                </div>
                              )}
                              {pedido.aiSuggestion && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="w-6 h-6 bg-novura-primary rounded-full flex items-center justify-center animate-pulse">
                                      <Zap className="w-3 h-3 text-white" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p className="text-sm">
                                      💡 Pedido com alta margem ({pedido.margem}%). 
                                      Sugerimos criar anúncios para escalar este produto.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                            
                            <div>
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{pedido.id}</h3>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                                  {pedido.marketplace}
                                </Badge>
                                {pedido.margem > 20 && (
                                  <Badge className="bg-green-500 text-white px-3 py-1">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    Alta Margem
                                  </Badge>
                                )}
                                {pedido.aiSuggestion && (
                                  <Badge className="bg-novura-primary text-white px-3 py-1">
                                    <Zap className="w-3 h-3 mr-1" />
                                    IA
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-900 font-medium mb-1">{pedido.produto}</p>
                              <p className="text-xs text-gray-500 mb-1">SKU: {pedido.sku}</p>
                              <p className="text-sm text-gray-600">{pedido.cliente}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-8">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">R$ {pedido.valor.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">{pedido.data}</p>
                            </div>
                            
                            <div className="text-right">
                              <p className={`text-lg font-bold ${pedido.margem > 20 ? 'text-green-600' : 'text-novura-primary'}`}>
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
                                <DrawerContent className="bg-white">
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
                              
                              {activeStatus === "impressao" && (
                                <Button size="sm" variant="outline" className="rounded-2xl">
                                  <Printer className="w-4 h-4 mr-1" />
                                  Etiqueta
                                </Button>
                              )}
                              
                              {activeStatus === "vincular" && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" className="rounded-2xl bg-novura-primary shadow-lg">
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
                                      <Button className="w-full h-12 rounded-2xl bg-novura-primary">
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

        <ScannerModal open={scannerOpen} onOpenChange={setScannerOpen} />
      </SidebarProvider>
    </TooltipProvider>
  );
}
