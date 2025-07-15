import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Variacao } from "./types";

interface BulkVariationStockDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variacoes: Variacao[];
  onUpdate: (variacoes: Variacao[]) => void;
}

export function BulkVariationStockDrawer({
  open,
  onOpenChange,
  variacoes,
  onUpdate
}: BulkVariationStockDrawerProps) {
  const [updateStock, setUpdateStock] = useState(false);
  const [updateStorage, setUpdateStorage] = useState(false);
  const [stockValue, setStockValue] = useState("");
  const [storageValue, setStorageValue] = useState("");

  const handleSave = () => {
    const updatedVariacoes = variacoes.map(variacao => {
      const updated = { ...variacao };
      if (updateStock && stockValue) {
        updated.estoque = stockValue;
      }
      if (updateStorage && storageValue) {
        updated.armazem = storageValue;
      }
      return updated;
    });

    onUpdate(updatedVariacoes);
    onOpenChange(false);
    
    // Reset form
    setUpdateStock(false);
    setUpdateStorage(false);
    setStockValue("");
    setStorageValue("");
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader>
          <DrawerTitle>Atualização em Massa</DrawerTitle>
        </DrawerHeader>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="update-stock">Atualizar Estoque</Label>
              <Switch
                id="update-stock"
                checked={updateStock}
                onCheckedChange={setUpdateStock}
              />
            </div>
            
            {updateStock && (
              <div>
                <Label htmlFor="stock-value">Quantidade de Estoque</Label>
                <Input
                  id="stock-value"
                  type="number"
                  placeholder="Digite a quantidade"
                  value={stockValue}
                  onChange={(e) => setStockValue(e.target.value)}
                />
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="update-storage">Atualizar Armazém</Label>
              <Switch
                id="update-storage"
                checked={updateStorage}
                onCheckedChange={setUpdateStorage}
              />
            </div>
            
            {updateStorage && (
              <div>
                <Label htmlFor="storage-value">Armazém</Label>
                <Select value={storageValue} onValueChange={setStorageValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o armazém" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="galpaoPrincipal">Galpão Principal</SelectItem>
                    <SelectItem value="galpaoSecundario">Galpão Secundário</SelectItem>
                    <SelectItem value="deposito">Depósito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <DrawerFooter>
          <Button 
            onClick={handleSave}
            disabled={(!updateStock && !updateStorage) || (updateStock && !stockValue) || (updateStorage && !storageValue)}
          >
            Salvar
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}