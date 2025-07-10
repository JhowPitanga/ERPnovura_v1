import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from "./types";
import { useStorage } from "@/hooks/useProducts";

interface StockFormProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
}

export function StockForm({ formData, onInputChange }: StockFormProps) {
  const { storageLocations, loading: storageLoading } = useStorage();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-6">Preços e Estoque</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="precoCusto">
              Preço de Custo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="precoCusto"
              type="number"
              step="0.01"
              value={formData.precoCusto}
              onChange={(e) => onInputChange("precoCusto", e.target.value)}
              placeholder="0,00"
              className="mt-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="precoVenda">Preço de Venda</Label>
            <Input
              id="precoVenda"
              type="number"
              step="0.01"
              value={formData.precoVenda}
              onChange={(e) => onInputChange("precoVenda", e.target.value)}
              placeholder="0,00"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="estoque">Quantidade em Estoque</Label>
            <Input
              id="estoque"
              type="number"
              value={formData.estoque}
              onChange={(e) => onInputChange("estoque", e.target.value)}
              placeholder="0"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="armazem">Armazém</Label>
            <Select value={formData.armazem} onValueChange={(value) => onInputChange("armazem", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione o armazém" />
              </SelectTrigger>
              <SelectContent>
                {storageLoading ? (
                  <SelectItem value="" disabled>Carregando...</SelectItem>
                ) : (
                  storageLocations.map((storage) => (
                    <SelectItem key={storage.id} value={storage.id}>
                      {storage.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}