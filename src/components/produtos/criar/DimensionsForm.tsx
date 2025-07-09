
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "./types";

interface DimensionsFormProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
}

export function DimensionsForm({ formData, onInputChange }: DimensionsFormProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-6">Dimensões e Peso da Embalagem</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="altura">Altura (cm) *</Label>
            <Input
              id="altura"
              type="number"
              step="0.1"
              value={formData.altura}
              onChange={(e) => onInputChange("altura", e.target.value)}
              placeholder="0.0"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="largura">Largura (cm) *</Label>
            <Input
              id="largura"
              type="number"
              step="0.1"
              value={formData.largura}
              onChange={(e) => onInputChange("largura", e.target.value)}
              placeholder="0.0"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="comprimento">Comprimento (cm) *</Label>
            <Input
              id="comprimento"
              type="number"
              step="0.1"
              value={formData.comprimento}
              onChange={(e) => onInputChange("comprimento", e.target.value)}
              placeholder="0.0"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="peso">Peso do Pacote (gramas) *</Label>
            <Input
              id="peso"
              type="number"
              step="1"
              value={formData.peso}
              onChange={(e) => onInputChange("peso", e.target.value)}
              placeholder="0"
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
