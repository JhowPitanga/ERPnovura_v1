
import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, User, Package, CreditCard, Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PedidoDetailsProps {
  pedido: any;
}

export function PedidoDetails({ pedido }: PedidoDetailsProps) {
  const [itensExpanded, setItensExpanded] = useState(false);
  const [historicoExpanded, setHistoricoExpanded] = useState(false);

  const historicoSteps = [
    { status: "Pedido Recebido", date: "15/01/2024 14:30", completed: true },
    { status: "Pagamento Confirmado", date: "15/01/2024 14:32", completed: true },
    { status: "Em Processamento", date: "15/01/2024 15:00", completed: true },
    { status: "Aguardando Estoque", date: "16/01/2024 09:00", completed: false },
  ];

  const itens = [
    { id: 1, nome: "iPhone 15 Pro", qtd: 1, valorUnit: 7999.99, subtotal: 7999.99 },
    { id: 2, nome: "Capinha iPhone 15 Pro", qtd: 2, valorUnit: 49.99, subtotal: 99.98 },
  ];

  return (
    <div className="space-y-6">
      {/* Seção 1: Informações do Marketplace */}
      <div className="bg-gradient-to-r from-white to-gray-50/50 rounded-2xl p-6 border border-gray-100/60">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2 text-novura-primary" />
          Informações Gerais
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Marketplace:</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {pedido.marketplace}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">ID do Pedido:</span>
              <span className="font-mono font-semibold text-gray-900">{pedido.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Data:</span>
              <span className="text-gray-900">{pedido.data}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Cliente:</span>
              <span className="text-gray-900 font-medium">{pedido.cliente}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Tipo de Entrega:</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <MapPin className="w-3 h-3 mr-1" />
                Entrega Normal
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Status:</span>
              <Badge className="bg-gradient-to-r from-novura-primary to-purple-600">
                {pedido.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Seção 2: Itens do Pedido */}
      <div className="bg-gradient-to-r from-white to-gray-50/50 rounded-2xl border border-gray-100/60 overflow-hidden">
        <Collapsible open={itensExpanded} onOpenChange={setItensExpanded}>
          <CollapsibleTrigger asChild>
            <div className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-novura-primary" />
                  Itens do Pedido ({itens.length})
                </h3>
                {itensExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-6 pb-6">
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-500 pb-2 border-b border-gray-100">
                  <span>Item</span>
                  <span className="text-center">Qtd</span>
                  <span className="text-right">Valor Unit.</span>
                  <span className="text-right">Subtotal</span>
                  <span></span>
                </div>
                {itens.map((item) => (
                  <div key={item.id} className="grid grid-cols-5 gap-4 items-center py-3 hover:bg-gray-50/50 rounded-xl px-3 transition-colors">
                    <div>
                      <span className="text-gray-900 font-medium">{item.nome}</span>
                    </div>
                    <div className={`text-center font-medium ${item.qtd > 1 ? 'text-purple-600 bg-purple-50 rounded-lg py-1 px-2' : 'text-gray-900'}`}>
                      {item.qtd}
                    </div>
                    <div className="text-right text-gray-900">
                      R$ {item.valorUnit.toFixed(2)}
                    </div>
                    <div className="text-right font-semibold text-gray-900">
                      R$ {item.subtotal.toFixed(2)}
                    </div>
                    <div></div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Seção 3: Histórico do Pedido */}
      <div className="bg-gradient-to-r from-white to-gray-50/50 rounded-2xl border border-gray-100/60 overflow-hidden">
        <Collapsible open={historicoExpanded} onOpenChange={setHistoricoExpanded}>
          <CollapsibleTrigger asChild>
            <div className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-novura-primary" />
                  Histórico do Pedido
                </h3>
                {historicoExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {historicoSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                      step.completed 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gray-300'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${
                          step.completed ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.status}
                        </span>
                        <span className="text-sm text-gray-500">{step.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Seção 4: Detalhamento Financeiro */}
      <div className="bg-gradient-to-r from-white to-gray-50/50 rounded-2xl p-6 border border-gray-100/60">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-novura-primary" />
          Detalhamento Financeiro
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Valor Pago pelo Cliente:</span>
                <span className="font-semibold text-gray-900">R$ {pedido.valor.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxa do Marketplace:</span>
                <span className="text-red-600">- R$ {(pedido.valor * 0.12).toFixed(2)} (12%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impostos:</span>
                <span className="text-red-600">- R$ {(pedido.valor * 0.08).toFixed(2)} (8%)</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Taxa de Frete:</span>
                <span className="text-red-600">- R$ 15.90</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cupom Utilizado:</span>
                <span className="text-green-600">- R$ 50.00</span>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200/60">
              <div className="flex items-center justify-between">
                <span className="text-green-700 font-medium">Líquido a Receber:</span>
                <span className="text-green-800 font-bold text-lg">
                  R$ {(pedido.valor * 0.8 - 15.90 - 50).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200/60">
              <div className="flex items-center justify-between">
                <span className="text-purple-700 font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Margem Final:
                </span>
                <span className="text-purple-800 font-bold text-lg">{pedido.margem}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
