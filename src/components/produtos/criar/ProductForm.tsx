
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductFormData } from "@/types/products";
import { useCategories } from "@/hooks/useCategories";

interface ProductFormProps {
  formData: ProductFormData;
  onInputChange: (field: string, value: string) => void;
  includeSku?: boolean;
}

export function ProductForm({ formData, onInputChange, includeSku = true }: ProductFormProps) {
  const { categories, loading: categoriesLoading } = useCategories();

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <Label htmlFor="name">
          Product Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange("name", e.target.value)}
          placeholder="Product name"
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
            placeholder="Unique product code"
            className="mt-2"
            required
          />
        </div>
      )}
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => onInputChange("category", value)}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categoriesLoading ? (
              <SelectItem value="loading" disabled>Loading...</SelectItem>
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
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          value={formData.brand}
          onChange={(e) => onInputChange("brand", e.target.value)}
          placeholder="Product brand"
          className="mt-2"
        />
      </div>
      <div className="col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="Describe the product in detail"
          rows={4}
          className="mt-2"
        />
      </div>
    </div>
  );
}
