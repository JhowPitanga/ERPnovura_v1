
import { useState } from "react";
import { Minus, Package, Plus, Settings, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface EstoqueProduct {
  id: string;
  produto: string;
  sku: string;
  galpao?: string;
  estoque: number;
  reservado: number;
  disponivel: number;
  status: string;
  valor?: number;
}

interface EstoqueManagementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: EstoqueProduct | null;
  onUpdateStock: (productId: string, newStock: number) => void;
}

export function EstoqueManagementDrawer({
  isOpen,
  onClose,
  product,
  onUpdateStock,
}: EstoqueManagementDrawerProps) {
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);
  const [operationType, setOperationType] = useState<"entrada" | "saida">("entrada");
  const { toast } = useToast();

  if (!product) return null;

  const handleQuickAdjustment = (amount: number) => {
    setAdjustmentQuantity(Math.abs(amount));
    setOperationType(amount > 0 ? "entrada" : "saida");
  };

  const handleSaveAdjustment = () => {
    if (adjustmentQuantity === 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma quantidade válida para ajuste.",
        variant: "destructive",
      });
      return;
    }

    const finalAdjustment = operationType === "entrada" ? adjustmentQuantity : -adjustmentQuantity;
    const newStockValue = product.estoque + finalAdjustment;

    // Verificar se o estoque não pode ficar abaixo do reservado
    if (operationType === "saida" && newStockValue < product.reservado) {
      toast({
        title: "Erro",
        description: `Não é possível retirar esta quantidade. Estoque disponível: ${product.disponivel} unidades (${product.reservado} reservadas).`,
        variant: "destructive",
      });
      return;
    }

    // Verificar se o estoque não pode ficar negativo
    if (newStockValue < 0) {
      toast({
        title: "Erro",
        description: "O estoque não pode ficar negativo.",
        variant: "destructive",
      });
      return;
    }

    // Por enquanto, simular a atualização
    onUpdateStock(product.id, newStockValue);
    
    toast({
      title: "Ajuste simulado com sucesso!",
      description: `${operationType === "entrada" ? "Entrada" : "Saída"} de ${adjustmentQuantity} unidades para ${product.produto}`,
    });

    // Reset form
    setAdjustmentQuantity(0);
    setOperationType("entrada");
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Crítico":
        return "destructive";
      case "Baixo":
        return "secondary";
      default:
        return "default";
    }
  };

  const getUpdatedStatus = (currentStock: number, reserved: number) => {
    const available = currentStock - reserved;
    if (available <= 0) return "Crítico";
    if (available <= 10) return "Baixo";
    return "Normal";
  };

  // Calculate the status for the current stock state
  const currentStatus = getUpdatedStatus(product.estoque, product.reservado);

  // Calculate the status for the preview (if there's an adjustment)
  const previewStock = adjustmentQuantity > 0 ? 
    product.estoque + (operationType === "entrada" ? adjustmentQuantity : -adjustmentQuantity) : 
    product.estoque;
  const previewStatus = getUpdatedStatus(previewStock, product.reservado);

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="fixed inset-y-0 right-0 flex h-full w-[400px] flex-col">
        <DrawerHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <DrawerTitle className="text-lg">Ajustar Estoque</DrawerTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DrawerDescription>
            {product.produto} ({product.sku})
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 p-6 space-y-6">
          {/* Informações do Produto */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Informações do Produto</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Nome</Label>
                <p className="font-medium">{product.produto}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">SKU</Label>
                <p className="font-medium">{product.sku}</p>
              </div>
              {product.galpao && (
                <div>
                  <Label className="text-xs text-muted-foreground">Galpão</Label>
                  <p className="font-medium">{product.galpao}</p>
                </div>
              )}
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Badge variant={getStatusColor(currentStatus)}>
                  {currentStatus}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações de Estoque Atual */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Estoque Atual</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">{product.estoque}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-orange-500">{product.reservado}</p>
                <p className="text-xs text-muted-foreground">Reservado</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-green-500">{product.disponivel}</p>
                <p className="text-xs text-muted-foreground">Disponível</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Ajuste de Estoque */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Ajuste de Estoque</h3>

            {/* Botões de Ajuste Rápido */}
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground">Ajustes Rápidos</Label>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdjustment(1)}
                  className="h-8"
                >
                  +1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdjustment(10)}
                  className="h-8"
                >
                  +10
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdjustment(-1)}
                  className="h-8"
                >
                  -1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdjustment(-10)}
                  className="h-8"
                >
                  -10
                </Button>
              </div>
            </div>

            {/* Tipo de Operação */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Tipo de Operação</Label>
              <div className="flex gap-2">
                <Button
                  variant={operationType === "entrada" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOperationType("entrada")}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Entrada
                </Button>
                <Button
                  variant={operationType === "saida" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOperationType("saida")}
                  className="flex-1"
                >
                  <Minus className="w-4 h-4 mr-1" />
                  Saída
                </Button>
              </div>
            </div>

            {/* Quantidade de Ajuste */}
            <div className="space-y-2">
              <Label htmlFor="adjustment-quantity" className="text-xs text-muted-foreground">
                Quantidade de Ajuste
              </Label>
              <Input
                id="adjustment-quantity"
                type="number"
                min="0"
                value={adjustmentQuantity || ""}
                onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
                placeholder="Digite a quantidade"
              />
            </div>

            {/* Preview do Resultado */}
            {adjustmentQuantity > 0 && (
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Novo estoque após ajuste:</p>
                  <Badge variant={getStatusColor(previewStatus)}>
                    {previewStatus}
                  </Badge>
                </div>
                <p className="text-lg font-bold text-primary">
                  {previewStock} unidades
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border p-6">
          <Button onClick={handleSaveAdjustment} className="w-full">
            <Settings className="w-4 h-4 mr-2" />
            Salvar Ajuste
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
