
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from "./types";

interface StockFormProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
}

export function StockForm({ formData, onInputChange }: StockFormProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-6">Controle de Estoque</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="precoCusto">Preço de Custo</Label>
            <Input
              id="precoCusto"
              type="number"
              step="0.01"
              value={formData.precoCusto}
              onChange={(e) => onInputChange("precoCusto", e.target.value)}
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
          <div className="col-span-2">
            <Label htmlFor="armazem">Armazém</Label>
            <Select value={formData.armazem} onValueChange={(value) => onInputChange("armazem", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione o armazém" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="principal">Armazém Principal</SelectItem>
                <SelectItem value="secundario">Armazém Secundário</SelectItem>
                <SelectItem value="externo">Armazém Externo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
