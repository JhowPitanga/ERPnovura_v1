
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Archive, PackageOpen, Truck, PackageCheck, Building2 } from "lucide-react";

export function EstoqueStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">R$ 515.991,83</div>
          <p className="text-xs text-muted-foreground">+8% vs mês anterior</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estoque Total</CardTitle>
          <Archive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">115</div>
          <p className="text-xs text-muted-foreground">5 produtos</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Picking Pendente</CardTitle>
          <PackageOpen className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-orange-600">8</div>
          <p className="text-xs text-muted-foreground">Pedidos aguardando</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expedições Hoje</CardTitle>
          <Truck className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-blue-600">23</div>
          <p className="text-xs text-muted-foreground">+12% vs ontem</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recebimentos</CardTitle>
          <PackageCheck className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-green-600">3</div>
          <p className="text-xs text-muted-foreground">Pendentes conferência</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fulfillment</CardTitle>
          <Building2 className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-purple-600">45</div>
          <p className="text-xs text-muted-foreground">Produtos ativos</p>
        </CardContent>
      </Card>
    </div>
  );
}
