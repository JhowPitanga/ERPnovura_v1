
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, MapPin } from "lucide-react";
import { estoqueData } from "@/data/estoqueData";
import { getStatusBadge, getStatusIcon } from "@/utils/estoqueUtils";

export function EstoqueTab() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead>Produto</TableHead>
              <TableHead>Galpão</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Reservado</TableHead>
              <TableHead>Disponível</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Marketplace</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {estoqueData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50/50">
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{item.produto}</p>
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{item.galpao}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.endereco}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className="font-medium">{item.estoque}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-orange-600">{item.reservado}</span>
                </TableCell>
                <TableCell>
                  <span className="text-green-600 font-medium">{item.disponivel}</span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(item.status)}
                </TableCell>
                <TableCell>
                  <span className="text-sm">{item.marketplace}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
