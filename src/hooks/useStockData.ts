
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export async function fetchProductsWithDetailedStock() {
  const { data: productsData, error: productsError } = await supabase
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
    `);

  if (productsError) throw productsError;

  const formattedData = productsData.map(product => {
    const totalCurrent = product.products_stock.reduce((sum, stock) => sum + stock.current, 0);
    const totalReserved = product.products_stock.reduce((sum, stock) => sum + (stock.reserved || 0), 0);
    const totalAvailable = totalCurrent - totalReserved;

    return {
      ...product,
      total_current_stock: totalCurrent,
      total_reserved_stock: totalReserved,
      total_available_stock: totalAvailable,
      stock_by_location: product.products_stock.map(stock => ({
        stock_id: stock.id,
        storage_name: stock.storage?.name || 'Galpão Desconhecido',
        storage_id: stock.storage_id,
        current: stock.current,
        reserved: stock.reserved || 0,
        in_transit: stock.in_transit || 0,
        available: stock.current - (stock.reserved || 0)
      }))
    };
  });

  return formattedData;
}

export function useStockData() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductsWithDetailedStock();
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
  }, []);

  return {
    stockData,
    loading,
    error,
    refetch: fetchData,
  };
}
