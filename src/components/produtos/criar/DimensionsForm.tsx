
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductFormData } from "@/types/products";

interface DimensionsFormProps {
  formData: ProductFormData;
  onInputChange: (field: string, value: string) => void;
}

export function DimensionsForm({ formData, onInputChange }: DimensionsFormProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-6">Package Dimensions and Weight</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="height">Height (cm) *</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              value={formData.height}
              onChange={(e) => onInputChange("height", e.target.value)}
              placeholder="0.0"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="width">Width (cm) *</Label>
            <Input
              id="width"
              type="number"
              step="0.1"
              value={formData.width}
              onChange={(e) => onInputChange("width", e.target.value)}
              placeholder="0.0"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="length">Length (cm) *</Label>
            <Input
              id="length"
              type="number"
              step="0.1"
              value={formData.length}
              onChange={(e) => onInputChange("length", e.target.value)}
              placeholder="0.0"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="weight">Package Weight (grams) *</Label>
            <Input
              id="weight"
              type="number"
              step="1"
              value={formData.weight}
              onChange={(e) => onInputChange("weight", e.target.value)}
              placeholder="0"
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
