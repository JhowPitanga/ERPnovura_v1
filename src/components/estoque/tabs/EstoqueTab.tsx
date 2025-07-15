import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, MapPin, Search, Settings } from "lucide-react";
import { estoqueData } from "@/data/estoqueData";
import { getStatusBadge, getStatusIcon } from "@/utils/estoqueUtils";
import { EstoqueManagementDrawer } from "../EstoqueManagementDrawer";

export function EstoqueTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockData, setStockData] = useState(estoqueData);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Adicionar dados mockados de preço de custo para simular
  const enrichedStockData = stockData.map(item => ({
    ...item,
    precoCusto: item.valor * 0.6, // Simular preço de custo como 60% do valor
  }));

  // Filtrar dados baseado na busca
  const filteredData = enrichedStockData.filter(item =>
    item.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleManageStock = (product: any) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleUpdateStock = (productId: number, newStock: number) => {
    setStockData(prevData =>
      prevData.map(item =>
        item.id === productId
          ? {
              ...item,
              estoque: newStock,
              disponivel: newStock - item.reservado, // Recalcular disponível
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Barra de Busca */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100">
                <TableHead>Produto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Preço de Custo</TableHead>
                <TableHead>Galpão</TableHead>
                <TableHead>Reservado</TableHead>
                <TableHead>Disponível</TableHead>
                <TableHead>Estoque Atual</TableHead>
                <TableHead className="w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <div>
                        <p className="font-medium text-gray-900">{item.produto}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-mono text-sm">{item.sku}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(item.precoCusto / 100)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.galpao}</p>
                      <Badge variant="outline" className="text-xs">{item.endereco}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-bold text-orange-600">{item.reservado}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-bold text-green-600">{item.disponivel}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-bold text-2xl text-primary">{item.estoque}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManageStock(item)}
                        className="h-8 px-2"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Gerenciar
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Movimentar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MapPin className="w-4 h-4 mr-2" />
                            Realocar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EstoqueManagementDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={selectedProduct}
        onUpdateStock={handleUpdateStock}
      />
    </div>
  );
}