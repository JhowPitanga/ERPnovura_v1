
import { useState } from "react";
import { Package, Search, Filter, Settings, AlertTriangle, CheckCircle, Truck, Printer, FileText, Link, X, ArrowRight, DollarSign, TrendingUp, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const statusBlocks = [
  { id: "vincular", title: "Vincular", count: 12, icon: Link, color: "bg-blue-500", description: "Pedidos aguardando vinculação" },
  { id: "emissao", title: "Emissão de NF", count: 8, icon: FileText, color: "bg-yellow-500", description: "Aguardando emissão de nota fiscal" },
  { id: "impressao", title: "Impressão", count: 15, icon: Printer, color: "bg-purple-500", description: "Prontos para impressão" },
  { id: "coleta", title: "Aguardando Coleta", count: 23, icon: Package, color: "bg-orange-500", description: "Aguardando coleta" },
  { id: "enviado", title: "Enviado", count: 45, icon: Truck, color: "bg-green-500", description: "Pedidos enviados" },
  { id: "cancelados", title: "Cancelados", count: 3, icon: X, color: "bg-red-500", description: "Pedidos cancelados" },
  { id: "devolucoes", title: "Devoluções", count: 2, icon: ArrowRight, color: "bg-gray-500", description: "Devoluções" },
];

const mockPedidos = {
  vincular: [
    { id: "PED001", marketplace: "Mercado Livre", produto: "iPhone 15 Pro", cliente: "João Silva", valor: 7999.99, data: "2024-01-15", status: "Pendente", margem: 15.5, problema: false },
    { id: "PED002", marketplace: "Amazon", produto: "MacBook Air", cliente: "Maria Santos", valor: 9999.99, data: "2024-01-15", status: "Pendente", margem: 12.3, problema: true },
  ],
  emissao: [
    { id: "PED003", marketplace: "Shopee", produto: "AirPods Pro", cliente: "Carlos Lima", valor: 2299.99, data: "2024-01-14", status: "Vinculado", margem: 22.1, problema: false },
  ],
  impressao: [
    { id: "PED004", marketplace: "Mercado Livre", produto: "iPad Air", cliente: "Ana Costa", valor: 4999.99, data: "2024-01-13", status: "NF Emitida", margem: 18.7, problema: false },
  ],
  // ... outros status
};

export default function Pedidos() {
  const [activeStatus, setActiveStatus] = useState("vincular");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);

  const currentPedidos = mockPedidos[activeStatus] || [];

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
                  <Package className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Pedidos</h2>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestão de Pedidos</h1>
                  <p className="text-gray-600">Controle inteligente de todos os seus pedidos</p>
                </div>
              </div>

              {/* Status Blocks */}
              <div className="grid grid-cols-7 gap-4 mb-6">
                {statusBlocks.map((block) => (
                  <Card
                    key={block.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      activeStatus === block.id ? "ring-2 ring-novura-primary" : ""
                    }`}
                    onClick={() => setActiveStatus(block.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 ${block.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                        <block.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{block.count}</div>
                      <div className="text-sm font-medium text-gray-700">{block.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{block.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Search */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar pedidos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                
                {activeStatus === "impressao" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-novura-primary hover:bg-novura-primary/90">
                        <Settings className="w-4 h-4 mr-2" />
                        Checkout de Impressão
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Checkout de Impressão</DialogTitle>
                        <DialogDescription>
                          Configure e processe a impressão dos pedidos
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Formato de Impressão</label>
                          <Select defaultValue="zebra">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="zebra">Zebra 10x15</SelectItem>
                              <SelectItem value="pdf">PDF</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <p className="text-gray-500">Área de bipagem de pedidos</p>
                          <p className="text-sm text-gray-400 mt-2">Escaneie os códigos dos pedidos aqui</p>
                        </div>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Processar Impressão
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                
                {activeStatus === "emissao" && (
                  <Button className="bg-green-600 hover:bg-green-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Emissão em Massa
                  </Button>
                )}
              </div>

              {/* Pedidos List */}
              <Card>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {currentPedidos.map((pedido) => (
                      <div key={pedido.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                        <div className="flex items-center space-x-4">
                          <div className="flex flex-col items-center">
                            {pedido.problema && (
                              <AlertTriangle className="w-4 h-4 text-red-500 mb-1" />
                            )}
                            {pedido.margem > 20 && (
                              <TrendingUp className="w-4 h-4 text-green-500 mb-1" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900">{pedido.id}</h3>
                              <Badge variant="outline">{pedido.marketplace}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{pedido.produto}</p>
                            <p className="text-xs text-gray-500">{pedido.cliente}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="font-medium text-gray-900">R$ {pedido.valor.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{pedido.data}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm font-medium text-novura-primary">{pedido.margem}%</p>
                            <p className="text-xs text-gray-500">margem</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Drawer>
                              <DrawerTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedPedido(pedido)}>
                                  Detalhes
                                </Button>
                              </DrawerTrigger>
                              <DrawerContent>
                                <DrawerHeader>
                                  <DrawerTitle>Detalhes do Pedido {pedido.id}</DrawerTitle>
                                  <DrawerDescription>
                                    Informações completas do pedido
                                  </DrawerDescription>
                                </DrawerHeader>
                                <div className="p-6 space-y-6">
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <h3 className="font-semibold text-gray-900">Informações do Pedido</h3>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">ID do Pedido:</span>
                                          <span className="font-medium">{pedido.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Marketplace:</span>
                                          <Badge variant="outline">{pedido.marketplace}</Badge>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Data:</span>
                                          <span>{pedido.data}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Status:</span>
                                          <Badge>{pedido.status}</Badge>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                      <h3 className="font-semibold text-gray-900">Detalhamento Financeiro</h3>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Valor do Produto:</span>
                                          <span className="font-medium">R$ {pedido.valor.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Taxa do Marketplace:</span>
                                          <span className="text-red-600">- R$ {(pedido.valor * 0.12).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Frete:</span>
                                          <span>R$ 15.90</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-semibold">
                                          <span>Margem Final:</span>
                                          <span className="text-green-600">{pedido.margem}%</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {activeStatus === "vincular" && (
                                    <div className="space-y-4">
                                      <h3 className="font-semibold text-gray-900">Vincular Produto</h3>
                                      <Select>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione o produto para vincular" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="prod1">iPhone 15 Pro - SKU: IPH15P-001</SelectItem>
                                          <SelectItem value="prod2">MacBook Air M2 - SKU: MBA-M2-002</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Button className="w-full bg-novura-primary hover:bg-novura-primary/90">
                                        Confirmar Vinculação
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </DrawerContent>
                            </Drawer>
                            
                            {activeStatus === "vincular" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" className="bg-novura-primary hover:bg-novura-primary/90">
                                    Vincular
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Vincular Produto</DialogTitle>
                                    <DialogDescription>
                                      Selecione o produto para vincular ao pedido {pedido.id}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione o produto" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="prod1">iPhone 15 Pro - SKU: IPH15P-001</SelectItem>
                                        <SelectItem value="prod2">MacBook Air M2 - SKU: MBA-M2-002</SelectItem>
                                        <SelectItem value="prod3">AirPods Pro - SKU: APP-003</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button className="w-full bg-novura-primary hover:bg-novura-primary/90">
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
