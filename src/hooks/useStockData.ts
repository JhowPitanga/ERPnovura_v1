import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Caminho para seu cliente Supabase
import { useToast } from '@/hooks/use-toast'; // Importa seu hook de toast
import { useProductSync } from '@/hooks/useProductSync'; // Importa seu hook useProductSync
import { useAuth } from '@/hooks/useAuth';

// Se você usa o Product Type do Supabase, importe de lá
// export type Product = Tables<'products'>;
// export type ProductStock = Tables<'products_stock'>;

// Para fins de tipo local, se não vier de Tables:
interface ProductFromDB {
  id: string;
  name: string;
  sku: string;
  cost_price: number;
  sell_price?: number;
  image_urls: string[];
  products_stock: Array<{
    id: number;
    storage_id: string;
    current: number;
    reserved?: number;
    in_transit?: number;
    storage: { name: string } | null;
  }> | { // Adiciona o tipo de objeto para quando a relação retorna um único item
    id: number;
    storage_id: string;
    current: number;
    reserved?: number;
    in_transit?: number;
    storage: { name: string } | null;
  } | null;
}

interface FormattedProductStockData extends ProductFromDB {
    total_current_stock: number;
    total_reserved_stock: number;
    total_available_stock: number;
    stock_by_location: Array<{
        stock_id: number;
        storage_name: string;
        storage_id: string;
        current: number;
        reserved: number;
        in_transit: number;
        available: number;
    }>;
}


export async function fetchProductsWithDetailedStock(userId?: string): Promise<FormattedProductStockData[]> {
  try {
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        sku,
        cost_price,
        sell_price,
        image_urls,
        products_stock (
          id,
          storage_id,
          current,
          reserved,
          in_transit,
          storage (
            name
          )
        )
      `)
      .in('type', ['UNICO', 'VARIACAO_ITEM']);

    // Filtra por usuário atual para evitar dados fora de contexto e cumprir RLS
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: productsData, error: productsError } = await query;

    if (productsError) {
      throw productsError;
    }

    const formattedData: FormattedProductStockData[] = productsData?.map((product: ProductFromDB) => {
      const rawStockData = product.products_stock;
      // Converte rawStockData para um array, mesmo se for um único objeto ou null
      const stockArray = rawStockData ? (Array.isArray(rawStockData) ? rawStockData : [rawStockData]) : [];

      const totalCurrent = stockArray.reduce((sum, stock) => sum + (stock.current || 0), 0);
      const totalReserved = stockArray.reduce((sum, stock) => sum + (stock.reserved || 0), 0);
      const totalAvailable = totalCurrent - totalReserved;

      return {
        ...product, // Copia todas as propriedades do produto original
        total_current_stock: totalCurrent,
        total_reserved_stock: totalReserved,
        total_available_stock: totalAvailable,
        stock_by_location: stockArray.map(stock => ({
          stock_id: stock.id,
          storage_name: stock.storage?.name || 'Armazém Desconhecido',
          storage_id: stock.storage_id,
          current: stock.current || 0,
          reserved: stock.reserved || 0,
          in_transit: stock.in_transit || 0,
          available: (stock.current || 0) - (stock.reserved || 0)
        }))
      };
    }) as FormattedProductStockData[] || [];

    return formattedData;

  } catch (err) {
    console.error('Erro em fetchProductsWithDetailedStock:', err); // Use console.error para erros
    return []; // Retorna um array vazio em caso de erro para evitar quebrar a UI
  }
}


export function useStockData() {
  const [stockData, setStockData] = useState<FormattedProductStockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { lastUpdate } = useProductSync(); // Use seu hook de ProductSync
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductsWithDetailedStock(user?.id);
      setStockData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados do estoque';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lastUpdate, user?.id]); // Re-fetch quando 'lastUpdate' ou usuário mudar

  return {
    stockData,
    loading,
    error,
    refetch: fetchData, // Fornece uma função para recarregar manualmente
  };
}