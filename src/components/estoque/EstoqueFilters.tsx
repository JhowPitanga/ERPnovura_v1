
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, MapPin } from "lucide-react";
import { armazens, marketplaces } from "@/data/estoqueData";

interface EstoqueFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedGalpao: string;
  setSelectedGalpao: (value: string) => void;
  selectedMarketplace: string;
  setSelectedMarketplace: (value: string) => void;
}

export function EstoqueFilters({
  searchTerm,
  setSearchTerm,
  selectedGalpao,
  setSelectedGalpao,
  selectedMarketplace,
  setSelectedMarketplace
}: EstoqueFiltersProps) {
  return (
    <div className="flex items-center space-x-4 mt-6 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar produtos, SKU, pedidos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedGalpao} onValueChange={setSelectedGalpao}>
        <SelectTrigger className="w-48">
          <MapPin className="w-4 h-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {armazens.map((galpao) => (
            <SelectItem key={galpao.id} value={galpao.id}>
              {galpao.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedMarketplace} onValueChange={setSelectedMarketplace}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {marketplaces.map((marketplace) => (
            <SelectItem key={marketplace.id} value={marketplace.id}>
              {marketplace.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm">
        <Filter className="w-4 h-4 mr-2" />
        Filtros Avançados
      </Button>
    </div>
  );
}
