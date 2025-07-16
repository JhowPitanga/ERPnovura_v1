
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductWithStock {
  id: string;
  name: string;
  sku: string;
  cost_price: number;
  sell_price: number | null;
  image_urls: string[];
  total_current_stock: number;
}

export function useProductsWithStock() {
  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ["products-with-stock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          sku,
          cost_price,
          sell_price,
          image_urls,
          products_stock!inner(current)
        `)
        .eq("type", "unico");

      if (error) throw error;

      return data?.map(product => ({
        ...product,
        total_current_stock: product.products_stock?.reduce((total: number, stock: any) => total + (stock.current || 0), 0) || 0
      })) as ProductWithStock[];
    },
  });

  return { products, loading };
}
