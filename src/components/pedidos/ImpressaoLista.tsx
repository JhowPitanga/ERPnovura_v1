import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Paginacao } from "./Paginacao";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "react-router-dom";
import { Printer, Settings } from "lucide-react";
import { ConfiguracoesImpressaoModal } from './ConfiguracoesImpressaoModal';
import { usePrintingSettings } from "@/hooks/usePrintingSettings";

interface OrderItem {
  product_name: string;
  quantity: number;
  sku: string;
}

interface NfeData {
  nfe_number: string;
  nfe_key: string;
  nfe_xml_url: string;
}

interface OrderData {
  id: string;
  marketplace_order_id: string;
  customer_name: string;
  order_total: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
  marketplace: string;
  nfe_data: NfeData;
}

interface ImpressaoListaProps {
  onOpenDetalhesPedido: (pedidoId: string) => void;
}

export function ImpressaoLista({ onOpenDetalhesPedido }: ImpressaoListaProps) {
  const [pedidos, setPedidos] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { settings, loading: settingsLoading, refetch: refetchSettings } = usePrintingSettings();

  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10;
  const offset = (page - 1) * limit;

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    try {
      // Mock data for orders ready for printing
      const mockData: OrderData[] = [
        {
          id: "1",
          marketplace_order_id: "ML-123456",
          customer_name: "João Silva",
          order_total: 150.00,
          status: "ready_for_printing",
          created_at: new Date().toISOString(),
          order_items: [
            { product_name: "Produto A", quantity: 2, sku: "SKU001" },
            { product_name: "Produto B", quantity: 1, sku: "SKU002" }
          ],
          marketplace: "Mercado Livre",
          nfe_data: {
            nfe_number: "000001",
            nfe_key: "12345678901234567890123456789012345678901234",
            nfe_xml_url: "https://example.com/nfe.xml"
          }
        },
        {
          id: "2",
          marketplace_order_id: "SH-789012",
          customer_name: "Maria Santos",
          order_total: 89.90,
          status: "ready_for_printing",
          created_at: new Date().toISOString(),
          order_items: [
            { product_name: "Produto C", quantity: 1, sku: "SKU003" }
          ],
          marketplace: "Shopee",
          nfe_data: {
            nfe_number: "000002",
            nfe_key: "98765432109876543210987654321098765432109876",
            nfe_xml_url: "https://example.com/nfe2.xml"
          }
        }
      ];
      
      setPedidos(mockData);
    } catch (error: any) {
      console.error("Erro ao buscar pedidos para impressão:", error);
      toast({
        title: "Erro",
        description: `Falha ao carregar a lista de pedidos: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive",
      });
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  }, [limit, offset, toast]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const handleImprimir = async (pedido: OrderData) => {
    console.log('>>> Botão "Imprimir" clicado para o pedido:', pedido.id);
    console.log('>>> Estado das configurações:', settings);
    console.log('>>> Estado de carregamento das configurações:', settingsLoading);
    
    if (settingsLoading) {
      toast({ title: "Aguarde", description: "Carregando configurações de impressão...", variant: "default" });
      return;
    }

    toast({
      title: "Simulação de Impressão",
      description: `Preparando impressão para o pedido ${pedido.marketplace_order_id}...`,
    });

    if (!settings) {
        toast({ title: "Erro", description: "Configurações de impressão não carregadas.", variant: "destructive" });
        return;
    }
    
    const mockPdfContent = `
      <html>
        <head>
          <title>Etiqueta de Envio</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .label-a4 { width: 210mm; height: 297mm; border: 1px dashed black; }
            .label-10x15 { width: 100mm; height: 150mm; border: 1px solid black; }
          </style>
        </head>
        <body style="${settings.print_type === 'Impressão Zebra' ? 'width: 100mm; height: 150mm;' : 'width: 210mm; height: 297mm;'}">
          <div class="${settings.print_type === 'Impressão Zebra' ? 'label-10x15' : 'label-a4'}">
            <h1>Etiqueta de Envio</h1>
            <p><strong>Pedido:</strong> ${pedido.marketplace_order_id}</p>
            <p><strong>NF-e:</strong> ${pedido.nfe_data.nfe_number}</p>
            <p><strong>Chave:</strong> ${pedido.nfe_data.nfe_key}</p>
            <p><strong>Formato:</strong> ${settings.print_type}</p>
            <p><strong>Opção:</strong> ${settings.label_format}</p>
          </div>
        </body>
      </html>
    `;

    const newWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.document.write(mockPdfContent);
      newWindow.document.close();
    }

    try {
      // Mock marking order as printed
      console.log(`Pedido ${pedido.id} marcado como impresso`);
      toast({
        title: "Sucesso",
        description: "Etiqueta impressa e pedido atualizado.",
      });
      fetchPedidos();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: `Falha ao marcar pedido como impresso: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  };

  const totalPedidos = 8;

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
         <Button
            variant="outline"
            size="sm"
            onClick={() => setIsConfigModalOpen(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
      </div>

      {loading || settingsLoading ? (
        <div className="space-y-4">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="bg-background rounded-lg p-4 shadow-sm flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : pedidos.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          Nenhum pedido encontrado para impressão.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID Pedido</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead>Marketplace</TableHead>
              <TableHead>NF-e</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell className="font-medium">
                  <span className="block text-sm font-bold text-foreground">{pedido.marketplace_order_id}</span>
                  <span className="block text-xs text-muted-foreground">{new Date(pedido.created_at).toLocaleDateString()}</span>
                </TableCell>
                <TableCell>
                  {pedido.order_items?.map((item, index) => (
                    <div key={index} className="text-sm">
                      {item.quantity}x {item.product_name} ({item.sku})
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{pedido.marketplace}</Badge>
                </TableCell>
                <TableCell>
                    {pedido.nfe_data ? (
                        <div className="text-sm">
                            <span className="block font-bold">NF-e: #{pedido.nfe_data.nfe_number}</span>
                            <span className="block text-xs text-muted-foreground">Chave: {pedido.nfe_data.nfe_key}</span>
                        </div>
                    ) : (
                        <span className="text-sm text-destructive">NF não encontrada</span>
                    )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenDetalhesPedido(pedido.id)}
                    >
                      Detalhes
                    </Button>
                    <Button size="sm" onClick={() => handleImprimir(pedido)}>
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Paginacao
        totalItems={totalPedidos}
        limit={limit}
        currentPage={page}
      />

      <ConfiguracoesImpressaoModal
        open={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSettingsSaved={refetchSettings}
      />
    </div>
  );
}