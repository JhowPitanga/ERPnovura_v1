import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export type Product = Tables<'products'>;
export type Category = Tables<'categories'>;
export type Storage = Tables<'storage'>;
export type ProductStock = Tables<'products_stock'>;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchProducts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          ),
          products_stock (
            current,
            in_transit,
            reserved,
            storage (
              id,
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log(data);
      setProducts(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produtos';
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
    fetchProducts();
  }, [user]);

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir produto';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    deleteProduct,
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar categorias';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({ name })
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso",
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar categoria';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    createCategory,
    refetch: fetchCategories,
  };
}

export function useStorage() {
  const [storageLocations, setStorageLocations] = useState<Storage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchStorage = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('storage')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setStorageLocations(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar locais de armazenamento';
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
    fetchStorage();
  }, [user]);

  return {
    storageLocations,
    loading,
    refetch: fetchStorage,
  };
}

export interface CreateProductData {
  name: string;
  sku: string;
  type: 'UNICO' | 'VARIANT' | 'ITEM';
  description?: string;
  cost_price: number;
  sell_price?: number;
  barcode: number;
  ncm: number;
  cest?: number;
  package_height: number;
  package_width: number;
  package_length: number;
  weight?: number;
  weight_type?: string;
  tax_origin_code: number;
  category_id?: string;
  brand_id?: string;
  color?: string;
  size?: string;
  image_urls: string[];
  custom_attributes?: Record<string, any>;
  stock_current?: number;
  storage_id?: string;
}


export function useCreateProduct() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createProduct = async (productData: CreateProductData) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('create_product_with_stock', {
        p_name: productData.name,
        p_sku: productData.sku,
        p_type: productData.type,
        p_description: productData.description || null,
        p_cost_price: productData.cost_price,
        p_sell_price: productData.sell_price || null,
        p_barcode: productData.barcode,
        p_ncm: productData.ncm,
        p_cest: productData.cest || null,
        p_package_height: productData.package_height,
        p_package_width: productData.package_width,
        p_package_length: productData.package_length,
        p_weight: productData.weight || null,
        p_weight_type: productData.weight_type || null,
        p_tax_origin_code: productData.tax_origin_code,
        p_category_id: productData.category_id || null,
        p_brand_id: productData.brand_id || null,
        p_color: productData.color || null,
        p_size: productData.size || null,
        p_image_urls: productData.image_urls,
        p_custom_attributes: productData.custom_attributes || null,
        p_stock_current: productData.stock_current || null,
        p_storage_id: productData.storage_id || null,
      }); // This closing parenthesis and brace should match the opening ones

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso",
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar produto';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    loading,
  };
}