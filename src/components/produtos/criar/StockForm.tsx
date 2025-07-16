
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductFormData } from "@/types/products";
import { useStorage } from "@/hooks/useStorage";

interface StockFormProps {
  formData: ProductFormData;
  onInputChange: (field: string, value: string) => void;
}

export function StockForm({ formData, onInputChange }: StockFormProps) {
  const { storageLocations, loading: storageLoading } = useStorage();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-6">Pricing and Stock</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="costPrice">
              Cost Price <span className="text-red-500">*</span>
            </Label>
            <Input
              id="costPrice"
              type="number"
              step="0.01"
              value={formData.costPrice}
              onChange={(e) => onInputChange("costPrice", e.target.value)}
              placeholder="0.00"
              className="mt-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="sellPrice">Sell Price</Label>
            <Input
              id="sellPrice"
              type="number"
              step="0.01"
              value={formData.sellPrice}
              onChange={(e) => onInputChange("sellPrice", e.target.value)}
              placeholder="0.00"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => onInputChange("stock", e.target.value)}
              placeholder="0"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="warehouse">Warehouse</Label>
            <Select value={formData.warehouse} onValueChange={(value) => onInputChange("warehouse", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select warehouse" />
              </SelectTrigger>
              <SelectContent>
                {storageLoading ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
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
