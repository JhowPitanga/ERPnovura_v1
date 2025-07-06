
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, AlertTriangle, Bot } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EmissaoNFDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockEmissaoStatus = [
  { id: "PED001", status: "processing", message: "Iniciando emissão..." },
  { id: "PED002", status: "success", message: "NF emitida com sucesso" },
  { id: "PED003", status: "error", message: "Erro: CEP inválido" },
  { id: "PED004", status: "processing", message: "Validando dados..." },
  { id: "PED005", status: "success", message: "NF emitida com sucesso" },
];

export function EmissaoNFDrawer({ open, onOpenChange }: EmissaoNFDrawerProps) {
  const [currentStatus, setCurrentStatus] = useState<any[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [problemPedidos, setProblemPedidos] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      // Reset state
      setCurrentStatus([]);
      setIsComplete(false);
      setProblemPedidos([]);

      // Simulate emission process
      const interval = setInterval(() => {
        setCurrentStatus(prev => {
          const newStatus = [...prev];
          if (newStatus.length < mockEmissaoStatus.length) {
            const next = mockEmissaoStatus[newStatus.length];
            newStatus.push({
              ...next,
              timestamp: new Date().toLocaleTimeString()
            });
          }
          
          if (newStatus.length === mockEmissaoStatus.length) {
            setIsComplete(true);
            setProblemPedidos(newStatus.filter(item => item.status === 'error'));
            clearInterval(interval);
          }
          
          return newStatus;
        });
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [open]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500 text-white">Sucesso</Badge>;
      case 'error':
        return <Badge className="bg-red-500 text-white">Erro</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500 text-white">Processando</Badge>;
      default:
        return <Badge variant="outline">Aguardando</Badge>;
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="bg-white w-[500px]">
        <DrawerHeader className="border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-novura-primary rounded-xl flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-novura-primary rounded-full"></div>
              </div>
            </div>
            <DrawerTitle className="text-xl">Emissão de Notas Fiscais</DrawerTitle>
          </div>
          <p className="text-gray-600 mt-2">
            {isComplete ? 'Processo concluído' : 'Processando emissões...'}
          </p>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Loading Animation */}
          {!isComplete && (
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-novura-primary rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-4 h-4 bg-novura-primary rounded-full"></div>
                </div>
              </div>
              <p className="text-gray-600">Processando emissões...</p>
            </div>
          )}

          {/* Status History */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Histórico de Emissões</h3>
            
            {currentStatus.map((item, index) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                {getStatusIcon(item.status)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{item.id}</span>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.message}</p>
                  <p className="text-xs text-gray-400">{item.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Problem Orders */}
          {isComplete && problemPedidos.length > 0 && (
            <div className="mt-8 p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h4 className="font-semibold text-red-700">Pedidos com Problemas</h4>
              </div>
              
              <div className="space-y-2">
                {problemPedidos.map((pedido) => (
                  <div key={pedido.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">{pedido.id}</span>
                      <p className="text-sm text-red-600">{pedido.message}</p>
                    </div>
                    {pedido.message.includes('CEP') && (
                      <div className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        <Bot className="w-3 h-3" />
                        <span>Novura AI</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-700">Novura AI em Ação</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  Identificamos erros de CEP/endereço. Nossa IA está corrigindo automaticamente os dados para reprocessamento.
                </p>
              </div>
            </div>
          )}

          {/* Success Summary */}
          {isComplete && (
            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold text-green-700">Resumo do Processo</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total processado:</span>
                  <span className="font-semibold ml-2">{currentStatus.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Sucessos:</span>
                  <span className="font-semibold ml-2 text-green-600">
                    {currentStatus.filter(s => s.status === 'success').length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Erros:</span>
                  <span className="font-semibold ml-2 text-red-600">
                    {currentStatus.filter(s => s.status === 'error').length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Taxa de sucesso:</span>
                  <span className="font-semibold ml-2">
                    {Math.round((currentStatus.filter(s => s.status === 'success').length / currentStatus.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {isComplete && (
          <div className="p-6 border-t border-gray-100">
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full h-12 rounded-2xl bg-novura-primary"
            >
              Concluir
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
