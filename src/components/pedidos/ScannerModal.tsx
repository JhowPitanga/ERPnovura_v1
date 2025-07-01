
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Package, ShoppingCart } from "lucide-react";

interface ScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScannerModal({ open, onOpenChange }: ScannerModalProps) {
  const [scanMode, setScanMode] = useState<"pedido" | "produto" | null>(null);
  const [scannedCode, setScannedCode] = useState("");
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  const handleScan = (code: string) => {
    setScannedCode(code);
    if (scanMode === "produto") {
      // Simular busca do produto
      setCurrentProduct({
        sku: code,
        name: "iPhone 15 Pro Max",
        image: "/placeholder.svg",
        quantity: 2
      });
    }
  };

  const resetModal = () => {
    setScanMode(null);
    setScannedCode("");
    setCurrentProduct(null);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetModal();
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <QrCode className="w-5 h-5" />
            <span>Scanner de Impressão</span>
          </DialogTitle>
          <DialogDescription>
            Escolha o modo de bipagem para processar os pedidos
          </DialogDescription>
        </DialogHeader>

        {!scanMode ? (
          <div className="grid grid-cols-2 gap-4 p-6">
            <Card 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setScanMode("pedido")}
            >
              <CardHeader className="text-center pb-4">
                <ShoppingCart className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                <CardTitle className="text-lg">Bipagem por Pedido</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">
                  Escaneie o pedido e depois o produto para confirmação
                </p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setScanMode("produto")}
            >
              <CardHeader className="text-center pb-4">
                <Package className="w-12 h-12 mx-auto text-green-600 mb-2" />
                <CardTitle className="text-lg">Bipagem por Produto</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">
                  Escaneie produtos e gere etiquetas automaticamente
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Modo: {scanMode === "pedido" ? "Bipagem por Pedido" : "Bipagem por Produto"}
              </h3>
              <p className="text-gray-600">
                {scanMode === "pedido" 
                  ? "Escaneie o código do pedido ou digite manualmente"
                  : "Escaneie o código do produto ou digite o SKU"
                }
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
              <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <Input
                placeholder={scanMode === "pedido" ? "Código do pedido..." : "SKU do produto..."}
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && scannedCode) {
                    handleScan(scannedCode);
                  }
                }}
                className="text-center text-lg"
              />
              <Button 
                onClick={() => handleScan(scannedCode)}
                disabled={!scannedCode}
                className="mt-4"
              >
                Processar
              </Button>
            </div>

            {currentProduct && scanMode === "produto" && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={currentProduct.image} 
                      alt={currentProduct.name}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{currentProduct.name}</h4>
                      <p className="text-sm text-gray-600">SKU: {currentProduct.sku}</p>
                      <p className="text-sm font-medium">Quantidade: {currentProduct.quantity} itens</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex space-x-3">
              <Button variant="outline" onClick={resetModal} className="flex-1">
                Voltar
              </Button>
              <Button className="flex-1">
                Finalizar Impressão
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
