
import { useState } from "react";
import { Search, Filter, Settings, FileText, Printer, Bot, TrendingUp, Zap, QrCode, Check } from "lucide-react";
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
  { id: "todos", title: "Todos", count: 164, description: "Todos os pedidos" },
  { id: "vincular", title: "Vincular", count: 18, description: "Pedidos aguardando vinculação" },
  { id: "emissao", title: "Emissão de NF", count: 12, description: "Aguardando emissão de nota fiscal" },
  { id: "impressao", title: "Impressão", count: 25, description: "Prontos para impressão" },
  { id: "coleta", title: "Aguardando Coleta", count: 34, description: "Aguardando coleta" },
  { id: "enviado", title: "Enviado", count: 67, description: "Pedidos enviados" },
  { id: "cancelados", title: "Cancelados", count: 5, description: "Pedidos cancelados" },
  { id: "devolucoes", title: "Devoluções", count: 3, description: "Devoluções" },
];

// Expanded mock data with 35+ orders per status
const mockPedidos = {
  todos: [
    { id: "PED001", marketplace: "Mercado Livre", produto: "iPhone 15 Pro Max 256GB", sku: "IPH15PM-256", cliente: "João Silva Santos", valor: 8999.99, data: "15/01/2024", status: "Pendente", margem: 22.5, tipoEnvio: "ML Envios", image: "/placeholder.svg" },
    { id: "PED002", marketplace: "Amazon", produto: "MacBook Air M3 16GB 512GB", sku: "MBA-M3-512", cliente: "Maria Santos Costa", valor: 12999.99, data: "15/01/2024", status: "Pendente", margem: 18.3, tipoEnvio: "Amazon Prime", image: "/placeholder.svg" },
    { id: "PED003", marketplace: "Shopee", produto: "Samsung Galaxy S24 Ultra", sku: "SGS24U-256", cliente: "Carlos Oliveira", valor: 6999.99, data: "14/01/2024", status: "Enviado", margem: 25.1, tipoEnvio: "Shopee Xpress", image: "/placeholder.svg" },
    { id: "PED004", marketplace: "Magazine Luiza", produto: "Nintendo Switch OLED", sku: "NSW-OLED", cliente: "Ana Paula Lima", valor: 2299.99, data: "14/01/2024", status: "Coleta", margem: 15.7, tipoEnvio: "Magalu Entrega", image: "/placeholder.svg" },
    { id: "PED005", marketplace: "Americanas", produto: "iPad Air 5ª Geração", sku: "IPAD-AIR5", cliente: "Roberto Ferreira", valor: 4199.99, data: "13/01/2024", status: "Impressão", margem: 19.8, tipoEnvio: "B2W Entrega", image: "/placeholder.svg" },
    // ... adicionar mais 30 pedidos variados
  ],
  vincular: Array.from({ length: 35 }, (_, i) => ({
    id: `PED${String(i + 100).padStart(3, '0')}`,
    marketplace: ["Mercado Livre", "Amazon", "Shopee", "Magazine Luiza"][i % 4],
    produto: ["iPhone 15 Pro Max", "MacBook Air M3", "Samsung Galaxy S24", "Nintendo Switch"][i % 4],
    sku: [`SKU-${i + 100}`],
    cliente: [`Cliente ${i + 1}`, "Maria Silva", "João Santos", "Ana Costa"][i % 4],
    valor: 1000 + (i * 100),
    data: "15/01/2024",
    status: "Pendente",
    margem: 15 + (i % 20),
    tipoEnvio: ["ML Envios", "Amazon Prime", "Shopee Xpress", "Magalu Entrega"][i % 4],
    image: "/placeholder.svg"
  })),
  emissao: Array.from({ length: 35 }, (_, i) => ({
    id: `PED${String(i + 200).padStart(3, '0')}`,
    marketplace: ["Amazon", "Shopee", "Mercado Livre"][i % 3],
    produto: ["Dell XPS 13", "iPhone 14", "Samsung Monitor"][i % 3],
    sku: [`SKU-${i + 200}`],
    cliente: [`Cliente Emissão ${i + 1}`],
    valor: 2000 + (i * 150),
    data: "12/01/2024",
    status: "Vinculado",
    margem: 18 + (i % 15),
    tipoEnvio: ["Amazon Prime", "Shopee Xpress", "ML Envios"][i % 3],
    image: "/placeholder.svg"
  })),
  impressao: Array.from({ length: 35 }, (_, i) => ({
    id: `PED${String(i + 300).padStart(3, '0')}`,
    marketplace: ["Shopee", "Magazine Luiza", "Americanas"][i % 3],
    produto: ["Monitor 4K", "Mouse Gamer", "Teclado Mecânico"][i % 3],
    sku: [`SKU-${i + 300}`],
    cliente: [`Cliente Impressão ${i + 1}`],
    valor: 800 + (i * 80),
    data: "11/01/2024",
    status: "NF Emitida",
    margem: 20 + (i % 18),
    tipoEnvio: ["Shopee Xpress", "Magalu Entrega", "B2W Entrega"][i % 3],
    image: "/placeholder.svg"
  })),
  coleta: Array.from({ length: 35 }, (_, i) => ({
    id: `PED${String(i + 400).padStart(3, '0')}`,
    marketplace: ["Mercado Livre", "Amazon"][i % 2],
    produto: ["Smartphone", "Notebook"][i % 2],
    sku: [`SKU-${i + 400}`],
    cliente: [`Cliente Coleta ${i + 1}`],
    valor: 1500 + (i * 120),
    data: "10/01/2024",
    status: "Aguardando",
    margem: 16 + (i % 12),
    tipoEnvio: ["ML Envios", "Amazon Prime"][i % 2],
    image: "/placeholder.svg"
  })),
  enviado: Array.from({ length: 35 }, (_, i) => ({
    id: `PED${String(i + 500).padStart(3, '0')}`,
    marketplace: ["Shopee", "Magazine Luiza", "Americanas", "Amazon"][i % 4],
    produto: ["Fone Bluetooth", "Carregador", "Cabo USB", "Película"][i % 4],
    sku: [`SKU-${i + 500}`],
    cliente: [`Cliente Enviado ${i + 1}`],
    valor: 50 + (i * 30),
    data: "09/01/2024",
    status: "Enviado",
    margem: 25 + (i % 20),
    tipoEnvio: ["Shopee Xpress", "Magalu Entrega", "B2W Entrega", "Amazon Prime"][i % 4],
    image: "/placeholder.svg"
  })),
  cancelados: Array.from({ length: 35 }, (_, i) => ({
    id: `PED${String(i + 600).padStart(3, '0')}`,
    marketplace: ["Mercado Livre", "Shopee"][i % 2],
    produto: ["Produto Cancelado A", "Produto Cancelado B"][i % 2],
    sku: [`SKU-${i + 600}`],
    cliente: [`Cliente Cancelado ${i + 1}`],
    valor: 200 + (i * 50),
    data: "08/01/2024",
    status: "Cancelado",
    margem: 0,
    tipoEnvio: ["ML Envios", "Shopee Xpress"][i % 2],
    image: "/placeholder.svg"
  })),
  devolucoes: Array.from({ length: 35 }, (_, i) => ({
    id: `PED${String(i + 700).padStart(3, '0')}`,
    marketplace: ["Amazon", "Magazine Luiza"][i % 2],
    produto: ["Produto Devolvido A", "Produto Devolvido B"][i % 2],
    sku: [`SKU-${i + 700}`],
    cliente: [`Cliente Devolução ${i + 1}`],
    valor: 300 + (i * 75),
    data: "07/01/2024",
    status: "Devolução",
    margem: -5,
    tipoEnvio: ["Amazon Prime", "Magalu Entrega"][i % 2],
    image: "/placeholder.svg"
  }))
};

export default function Pedidos() {
  const [activeStatus, setActiveStatus] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [selectedPedidosImpressao, setSelectedPedidosImpressao] = useState<string[]>([]);
  const [scannerOpen, setScannerOpen] = useState(false);

  const currentPedidos = mockPedidos[activeStatus] || [];

  const handleSelectPedidoImpressao = (pedidoId: string, checked: boolean | string) => {
    const isChecked = checked === true;
    if (isChecked) {
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
                      Gestão de Pedidos
                    </h1>
                  </div>
                </div>

                {/* Status Blocks */}
                <div className="grid grid-cols-8 gap-4 mb-8">
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
                        <QrCode className="w-4 h-4 mr-2" />
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
                        <div key={pedido.id} className="flex items-center justify-between p-3 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-0 group">
                          <div className="flex items-center space-x-4 flex-1">
                            {activeStatus === "impressao" && (
                              <Checkbox
                                checked={selectedPedidosImpressao.includes(pedido.id)}
                                onCheckedChange={(checked) => handleSelectPedidoImpressao(pedido.id, checked)}
                              />
                            )}
                            
                            {/* Foto */}
                            <img
                              src={pedido.image}
                              alt={pedido.produto}
                              className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                            />
                            
                            {/* Produto */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-lg font-bold text-gray-900">{pedido.id}</h3>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {pedido.tipoEnvio}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-900 font-medium truncate">{pedido.produto}</p>
                              <p className="text-xs text-gray-500">SKU: {pedido.sku}</p>
                            </div>
                            
                            {/* Cliente */}
                            <div className="w-48 text-sm text-gray-600">
                              {pedido.cliente}
                            </div>
                            
                            {/* Valor */}
                            <div className="w-32 text-right">
                              <p className="text-lg font-bold text-gray-900">R$ {pedido.valor.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">{pedido.data}</p>
                            </div>
                            
                            {/* Margem */}
                            <div className="w-20 text-right">
                              <p className={`text-lg font-bold ${pedido.margem > 20 ? 'text-green-600' : 'text-novura-primary'}`}>
                                {pedido.margem}%
                              </p>
                              <p className="text-xs text-gray-500">margem</p>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center space-x-2">
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
