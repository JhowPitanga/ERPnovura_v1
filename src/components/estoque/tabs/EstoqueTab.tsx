import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Package } from "lucide-react";
import { estoqueData } from "@/data/estoqueData";
import { getStatusBadge } from "@/utils/estoqueUtils";
import { EstoqueManagementDrawer } from "../EstoqueManagementDrawer";

interface EstoqueTabProps {
  activeFilter: string;
  searchTerm: string;
  selectedGalpao: string;
}

export function EstoqueTab({ activeFilter, searchTerm, selectedGalpao }: EstoqueTabProps) {
  const [stockData, setStockData] = useState(estoqueData);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Adicionar dados mockados de preço de custo para simular
  const enrichedStockData = stockData.map(item => ({
    ...item,
    precoCusto: item.valor * 0.6, // Simular preço de custo como 60% do valor
  }));

  // Filtrar dados baseado na busca, galpão e filtro ativo
  const filteredData = enrichedStockData.filter(item => {
    const matchesSearch = item.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGalpao = selectedGalpao === "todos" || item.galpao === selectedGalpao;
    
    // Filtrar por status baseado no filtro ativo
    if (activeFilter === "estoque" || activeFilter === "total") return matchesSearch && matchesGalpao;
    if (activeFilter === "inventario") return matchesSearch && matchesGalpao && (item.status === "Crítico" || item.status === "Baixo");
    
    return matchesSearch && matchesGalpao;
  });

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
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100">
                <TableHead>Imagem</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Status</TableHead>
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
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{item.produto}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-mono text-sm">{item.sku}</p>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.status)}
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManageStock(item)}
                      className="h-8 px-2"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Gerenciar
                    </Button>
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