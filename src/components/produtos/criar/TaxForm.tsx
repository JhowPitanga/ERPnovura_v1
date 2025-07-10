
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductFormData } from "@/types/products";

interface TaxFormProps {
  formData: ProductFormData;
  onInputChange: (field: string, value: string) => void;
}

export function TaxForm({ formData, onInputChange }: TaxFormProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-6">Tax Information</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="barcode">Barcode (EAN)</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => onInputChange("barcode", e.target.value)}
                placeholder="Product barcode"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="ncm">
                NCM <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ncm"
                value={formData.ncm}
                onChange={(e) => onInputChange("ncm", e.target.value)}
                placeholder="00000000"
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="cest">CEST</Label>
              <Input
                id="cest"
                value={formData.cest}
                onChange={(e) => onInputChange("cest", e.target.value)}
                placeholder="0000000"
                className="mt-2"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="unitType">Unit of Measure</Label>
              <Select
                value={formData.unitType}
                onValueChange={(value) => onInputChange("unitType", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UN">Unit (UN)</SelectItem>
                  <SelectItem value="KG">Kilogram (KG)</SelectItem>
                  <SelectItem value="PAR">Pair (PAR)</SelectItem>
                  <SelectItem value="KIT">Kit (KIT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="origin">Origin</Label>
              <Select
                value={formData.origin}
                onValueChange={(value) => onInputChange("origin", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select origin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - National</SelectItem>
                  <SelectItem value="1">1 - Foreign - Direct import</SelectItem>
                  <SelectItem value="2">2 - Foreign - Acquired in domestic market</SelectItem>
                  <SelectItem value="3">3 - National - Import content over 40%</SelectItem>
                  <SelectItem value="4">4 - National - Production in compliance with basic productive processes</SelectItem>
                  <SelectItem value="5">5 - National - Import content 40% or less</SelectItem>
                  <SelectItem value="6">6 - Foreign - Direct import without national similar</SelectItem>
                  <SelectItem value="7">7 - Foreign - Acquired in domestic market without national similar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
