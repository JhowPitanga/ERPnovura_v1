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
      const { data, error } = await supabase.rpc('get_orders_for_printing', {
        p_limit: limit,
        p_offset: offset,
      });

      if (error) throw error;
      setPedidos(data || []);
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