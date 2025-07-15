
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Package } from "lucide-react";
import { getStatusBadge } from "@/utils/estoqueUtils";
import { EstoqueManagementDrawer } from "../EstoqueManagementDrawer";
import { useStockData } from "@/hooks/useStockData";

interface EstoqueTabProps {
  activeFilter: string;
  searchTerm: string;
  selectedGalpao: string;
}

export function EstoqueTab({ activeFilter, searchTerm, selectedGalpao }: EstoqueTabProps) {
  const { stockData, loading, error, refetch } = useStockData();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Função para calcular o status baseado na quantidade
  const getStatusFromStock = (estoque: number, reservado: number) => {
    const disponivel = estoque - reservado;
    if (disponivel <= 0) return "Crítico";
    if (disponivel <= 10) return "Baixo";
    return "Normal";
  };

  // Transformar dados do Supabase para o formato esperado pelo componente
  const transformedData = stockData.map(product => ({
    id: product.id,
    produto: product.name,
    sku: product.sku,
    precoCusto: product.cost_price,
    estoque: product.total_current_stock,
    reservado: product.total_reserved_stock,
    disponivel: product.total_available_stock,
    status: getStatusFromStock(product.total_current_stock, product.total_reserved_stock),
    image_urls: product.image_urls,
    stock_by_location: product.stock_by_location
  }));

  // Filtrar dados baseado na busca, galpão e filtro ativo
  const filteredData = transformedData.filter(item => {
    const matchesSearch = item.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por galpão
    const matchesGalpao = selectedGalpao === "todos" || 
      item.stock_by_location?.some(stock => stock.storage_name === selectedGalpao);
    
    // Filtrar por status baseado no filtro ativo
    if (activeFilter === "estoque" || activeFilter === "total") return matchesSearch && matchesGalpao;
    if (activeFilter === "inventario") {
      const itemStatus = getStatusFromStock(item.estoque, item.reservado);
      return matchesSearch && matchesGalpao && (itemStatus === "Crítico" || itemStatus === "Baixo");
    }
    
    return matchesSearch && matchesGalpao;
  });

  const handleManageStock = (product: any) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    // Aqui você pode implementar a lógica para atualizar o estoque no Supabase
    // Por enquanto, vamos apenas recarregar os dados
    await refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando produtos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">Erro ao carregar produtos: {error}</div>
      </div>
    );
  }

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
                <TableHead>Reservado</TableHead>
                <TableHead>Disponível</TableHead>
                <TableHead>Estoque Atual</TableHead>
                <TableHead className="w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => {
                const currentStatus = getStatusFromStock(item.estoque, item.reservado);
                return (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.image_urls && item.image_urls.length > 0 ? (
                          <img 
                            src={item.image_urls[0]} 
                            alt={item.produto}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
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
                      {getStatusBadge(currentStatus)}
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
                );
              })}
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
