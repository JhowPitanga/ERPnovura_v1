
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from "./types";

interface TaxFormProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
}

export function TaxForm({ formData, onInputChange }: TaxFormProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-6">Informações Fiscais</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="codigoBarras">Código de Barras *</Label>
            <Input
              id="codigoBarras"
              value={formData.codigoBarras}
              onChange={(e) => onInputChange("codigoBarras", e.target.value)}
              placeholder="Ex: 7891234567890"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="ncm">NCM *</Label>
            <Input
              id="ncm"
              value={formData.ncm}
              onChange={(e) => onInputChange("ncm", e.target.value)}
              placeholder="00000000"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="cest">CEST (Opcional)</Label>
            <Input
              id="cest"
              value={formData.cest}
              onChange={(e) => onInputChange("cest", e.target.value)}
              placeholder="0000000"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="unidade">Unidade</Label>
            <Select value={formData.unidade} onValueChange={(value) => onInputChange("unidade", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione a unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="un">Unidade</SelectItem>
                <SelectItem value="kg">Quilograma</SelectItem>
                <SelectItem value="g">Grama</SelectItem>
                <SelectItem value="l">Litro</SelectItem>
                <SelectItem value="ml">Mililitro</SelectItem>
                <SelectItem value="m">Metro</SelectItem>
                <SelectItem value="cm">Centímetro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label htmlFor="origem">Origem</Label>
            <Select value={formData.origem} onValueChange={(value) => onInputChange("origem", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione a origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - Nacional</SelectItem>
                <SelectItem value="1">1 - Estrangeira - Importação direta</SelectItem>
                <SelectItem value="2">2 - Estrangeira - Adquirida no mercado interno</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
