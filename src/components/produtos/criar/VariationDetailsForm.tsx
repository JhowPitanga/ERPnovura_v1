
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Variacao } from "./types";

interface VariationDetailsFormProps {
  variacao: Variacao;
  onUpdate: (variacaoId: string, field: string, value: string) => void;
}

export function VariationDetailsForm({ variacao, onUpdate }: VariationDetailsFormProps) {
  return (
    <div className="space-y-6">
      {/* Campos de SKU e EAN */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`sku-${variacao.id}`}>SKU</Label>
          <Input
            id={`sku-${variacao.id}`}
            value={variacao.sku}
            onChange={(e) => onUpdate(variacao.id, "sku", e.target.value)}
            placeholder="SKU da variação"
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor={`ean-${variacao.id}`}>Código de Barras (EAN)</Label>
          <Input
            id={`ean-${variacao.id}`}
            value={variacao.ean}
            onChange={(e) => onUpdate(variacao.id, "ean", e.target.value)}
            placeholder="Código de barras"
            className="mt-2"
          />
        </div>
      </div>

      {/* Campo de Preço de Custo */}
      <div>
        <Label htmlFor={`preco-${variacao.id}`}>Preço de Custo</Label>
        <Input
          id={`preco-${variacao.id}`}
          type="number"
          step="0.01"
          value={variacao.precoCusto}
          onChange={(e) => onUpdate(variacao.id, "precoCusto", e.target.value)}
          placeholder="0,00"
          className="mt-2"
        />
      </div>
    </div>
  );
}
