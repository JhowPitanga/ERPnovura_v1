
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PedidoDetailsProps {
  pedido: any;
}

export function PedidoDetails({ pedido }: PedidoDetailsProps) {
  if (!pedido) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pendente":
        return <Badge className="bg-orange-500 text-white">Vincular</Badge>;
      case "Vinculado":
        return <Badge className="bg-yellow-500 text-white">Emissão de NF-e</Badge>;
      case "NF Emitida":
        return <Badge className="bg-purple-600 text-white">Impressão</Badge>;
      case "Aguardando":
        return <Badge className="bg-blue-500 text-white">Aguardando coleta</Badge>;
      case "Enviado":
        return <Badge className="bg-green-500 text-white">Enviado</Badge>;
      case "Cancelado":
        return <Badge className="bg-gray-500 text-white">Cancelado</Badge>;
      case "Devolução":
        return <Badge className="bg-red-500 text-white">Emitir devolução</Badge>;
      default:
        return <Badge variant="default">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com informações principais */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pedido {pedido.id}</h2>
          <p className="text-gray-600 mt-1">{pedido.data}</p>
        </div>
        <div className="text-right">
          {getStatusBadge(pedido.status)}
          <p className="text-2xl font-bold text-primary mt-2">{formatCurrency(pedido.valor)}</p>
        </div>
      </div>

      {/* Informações do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Nome</p>
              <p className="text-gray-900">{pedido.cliente}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Marketplace</p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {pedido.marketplace}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">ID Plataforma</p>
              <p className="text-gray-900 font-mono text-sm">{pedido.idPlataforma}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tipo de Envio</p>
              <Badge className="bg-primary text-primary-foreground">
                {pedido.tipoEnvio}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itens do Pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pedido.itens && pedido.itens.length > 0 ? (
              pedido.itens.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.produto}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.produto}</h4>
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    {item.variacao && (
                      <p className="text-sm text-purple-600 font-medium">{item.variacao}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600">Qtd: {item.quantidade}</span>
                      <span className="font-bold text-gray-900">
                        {formatCurrency(item.valor)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={pedido.image}
                  alt={pedido.produto}
                  className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{pedido.produto}</h4>
                  <p className="text-sm text-gray-500">SKU: {pedido.sku}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-600">Qtd: {pedido.quantidade}</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(pedido.valor)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações Financeiras */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Valor Total</span>
              <span className="font-bold text-gray-900">{formatCurrency(pedido.valor)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Margem</span>
              <span className="font-bold text-green-600">{pedido.margem}%</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg">
              <span className="font-medium">Total</span>
              <span className="font-bold text-primary">{formatCurrency(pedido.valor)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
