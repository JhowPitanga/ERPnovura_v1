import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from "./types";
import { useCategories } from "@/hooks/useProducts";

interface ProductFormProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
  includeSku?: boolean;
}

export function ProductForm({ formData, onInputChange, includeSku = true }: ProductFormProps) {
  const { categories, loading: categoriesLoading } = useCategories();

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <Label htmlFor="nome">
          Nome do Produto <span className="text-red-500">*</span>
        </Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => onInputChange("nome", e.target.value)}
          placeholder="Nome do produto"
          className="mt-2"
          required
        />
      </div>
      {includeSku && (
        <div>
          <Label htmlFor="sku">
            SKU <span className="text-red-500">*</span>
          </Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => onInputChange("sku", e.target.value)}
            placeholder="Código único do produto"
            className="mt-2"
            required
          />
        </div>
      )}
      <div>
        <Label htmlFor="categoria">Categoria</Label>
        <Select value={formData.categoria} onValueChange={(value) => onInputChange("categoria", value)}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {categoriesLoading ? (
              <SelectItem value="" disabled>Carregando...</SelectItem>
            ) : (
              categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="marca">Marca</Label>
        <Input
          id="marca"
          value={formData.marca}
          onChange={(e) => onInputChange("marca", e.target.value)}
          placeholder="Marca do produto"
          className="mt-2"
        />
      </div>
      <div className="col-span-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => onInputChange("descricao", e.target.value)}
          placeholder="Descreva o produto detalhadamente"
          rows={4}
          className="mt-2"
        />
      </div>
    </div>
  );
}