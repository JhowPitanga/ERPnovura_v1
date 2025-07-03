
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Package, ShoppingCart, Printer, ChevronRight } from "lucide-react";

interface ScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data para simulação
const mockScannedOrders = [
  { id: "PED001", produto: "iPhone 15 Pro Max", sku: "IPH15PM-256", image: "/placeholder.svg", bipado: "12:30" },
  { id: "PED005", produto: "Samsung Galaxy S24", sku: "SGS24U-256", image: "/placeholder.svg", bipado: "12:25" },
  { id: "PED012", produto: "MacBook Air M3", sku: "MBA-M3-512", image: "/placeholder.svg", bipado: "12:20" },
];

const mockScannedProducts = [
  { sku: "IPH15PM-256", produto: "iPhone 15 Pro Max", image: "/placeholder.svg", quantidade: 3, ultimaBipagem: "12:30" },
  { sku: "SGS24U-256", produto: "Samsung Galaxy S24", image: "/placeholder.svg", quantidade: 2, ultimaBipagem: "12:25" },
  { sku: "MBA-M3-512", produto: "MacBook Air M3", image: "/placeholder.svg", quantidade: 1, ultimaBipagem: "12:20" },
];

export function ScannerModal({ open, onOpenChange }: ScannerModalProps) {
  const [scanMode, setScanMode] = useState<"pedido" | "produto" | null>(null);
  const [scannedCode, setScannedCode] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [scannedOrders, setScannedOrders] = useState(mockScannedOrders);
  const [scannedProducts, setScannedProducts] = useState(mockScannedProducts);

  const handleScan = (code: string) => {
    if (!code) return;
    
    const now = new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    if (scanMode === "pedido") {
      // Simular adição de novo pedido bipado
      const newOrder = {
        id: code,
        produto: "Produto Escaneado",
        sku: `SKU-${code}`,
        image: "/placeholder.svg",
        bipado: now
      };
      setScannedOrders([newOrder, ...scannedOrders]);
    } else if (scanMode === "produto") {
      // Simular adição de novo produto bipado
      const existingProduct = scannedProducts.find(p => p.sku === code);
      if (existingProduct) {
        setScannedProducts(scannedProducts.map(p => 
          p.sku === code 
            ? { ...p, quantidade: p.quantidade + 1, ultimaBipagem: now }
            : p
        ));
      } else {
        const newProduct = {
          sku: code,
          produto: "Produto Escaneado",
          image: "/placeholder.svg",
          quantidade: 1,
          ultimaBipagem: now
        };
        setScannedProducts([newProduct, ...scannedProducts]);
      }
    }
    
    setScannedCode("");
  };

  const resetModal = () => {
    setScanMode(null);
    setScannedCode("");
    setSelectedPrinter("");
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetModal();
    }}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <QrCode className="w-5 h-5" />
              <DialogTitle>Scanner de Impressão</DialogTitle>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Impressora:</span>
              <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Selecionar impressora" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zebra-1">Zebra ZT230 - Principal</SelectItem>
                  <SelectItem value="zebra-2">Zebra ZT410 - Secundária</SelectItem>
                  <SelectItem value="brother-1">Brother QL-720NW</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogDescription>
            Escolha o modo de bipagem para processar os pedidos
          </DialogDescription>
        </DialogHeader>

        {!scanMode ? (
          <div className="p-6">
            <div className="flex space-x-4 mb-6">
              <Button
                variant={scanMode === "pedido" ? "default" : "outline"}
                onClick={() => setScanMode("pedido")}
                className="flex-1 h-16 text-lg"
              >
                <ShoppingCart className="w-6 h-6 mr-2" />
                Bipagem por Pedido
              </Button>
              <Button
                variant={scanMode === "produto" ? "default" : "outline"}
                onClick={() => setScanMode("produto")}
                className="flex-1 h-16 text-lg"
              >
                <Package className="w-6 h-6 mr-2" />
                Bipagem por Produto
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Navigation */}
            <div className="flex space-x-4 mb-6">
              <Button
                variant={scanMode === "pedido" ? "default" : "outline"}
                onClick={() => setScanMode("pedido")}
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Bipagem por Pedido
              </Button>
              <Button
                variant={scanMode === "produto" ? "default" : "outline"}
                onClick={() => setScanMode("produto")}
                size="sm"
              >
                <Package className="w-4 h-4 mr-2" />
                Bipagem por Produto
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Scanner Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {scanMode === "pedido" ? "Escanear Pedido" : "Escanear Produto"}
                </h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                  <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <Input
                    placeholder={scanMode === "pedido" ? "Código do pedido..." : "SKU do produto..."}
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && scannedCode) {
                        handleScan(scannedCode);
                      }
                    }}
                    className="text-center text-lg mb-4"
                  />
                  <Button 
                    onClick={() => handleScan(scannedCode)}
                    disabled={!scannedCode}
                    className="w-full"
                  >
                    Processar
                  </Button>
                </div>
              </div>

              {/* Scanned Items List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {scanMode === "pedido" ? "Pedidos Bipados" : "Produtos Bipados"}
                </h3>
                
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {scanMode === "pedido" ? (
                    scannedOrders.map((order) => (
                      <Card key={order.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={order.image} 
                              alt={order.produto}
                              className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                            />
                            <div>
                              <p className="font-semibold">{order.id}</p>
                              <p className="text-sm text-gray-600">{order.produto}</p>
                              <p className="text-xs text-gray-500">SKU: {order.sku}</p>
                              <p className="text-xs text-blue-600">Bipado: {order.bipado}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Printer className="w-4 h-4 mr-1" />
                            Reimprimir
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    scannedProducts.map((product) => (
                      <Card key={product.sku} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={product.image} 
                              alt={product.produto}
                              className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                            />
                            <div>
                              <p className="font-semibold">{product.produto}</p>
                              <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                              <p className="text-sm font-medium">Quantidade: {product.quantidade}</p>
                              <p className="text-xs text-blue-600">Última bipagem: {product.ultimaBipagem}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Printer className="w-4 h-4 mr-1" />
                            Reimprimir
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={resetModal}>
                Voltar
              </Button>
              <Button className="bg-novura-primary">
                Finalizar Impressão
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
