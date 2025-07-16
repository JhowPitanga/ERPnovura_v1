import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export type Product = Tables<'products'>;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produtos';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.filter(product => product.id !== productId));
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

  useEffect(() => {
    fetchProducts();
  }, [user]);

  return {
    products,
    loading,
    refetch: fetchProducts,
    deleteProduct,
  };
}

export interface CreateProductData {
  name: string;
  sku: string;
  type: 'UNICO' | 'VARIACAO_PAI' | 'VARIACAO_ITEM' | 'ITEM'; // Tipos atualizados
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
  stock_current?: number; // Para produtos UNICO e VARIAÇÃO_ITEM
  storage_id?: string; // Para produtos UNICO e VARIAÇÃO_ITEM
  
  // Dados específicos para variações
  variations?: ProductVariationForm[]; // Array de variações com seus próprios dados
  // Dados específicos para kits
  kitItems?: KitItemForm[]; // Array de itens do kit
}

// Definições de tipos auxiliares para o frontend (ajuste conforme seus tipos reais)
interface ProductVariationForm {
  id: string; // ID temporário do frontend
  name: string;
  sku: string;
  costPrice: string; // Pode ser string vindo do form
  sellPrice: string; // Pode ser string vindo do form
  stock: string; // Pode ser string vindo do form
  warehouse: string; // Pode ser string (UUID) vindo do form
  images: string[];
  color?: string;
  size?: string;
  customType?: string;
  customValue?: string;
  ean?: string;
  height?: string;
  width?: string;
  length?: string;
  weight?: string;
  unitType?: string;
  ncm?: string;
  cest?: string;
  origin?: string;
}

interface KitItemForm {
  id: string;
  product_id: string;
  quantity: number;
}


export function useCreateProduct() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createProduct = async (productData: CreateProductData) => {
    try {
      setLoading(true);

      let resultId: string | null = null; // Para armazenar o ID do produto principal ou último item
      let currentError: any = null;

      if (productData.type === 'UNICO') {
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
        });
        resultId = data;
        currentError = error;

      } else if (productData.type === 'VARIACAO_PAI' && productData.variations) {
        // 1. Criar o produto pai (grupo de variações)
        const { data: parentId, error: parentError } = await supabase.rpc('create_product_variant_group', {
          p_name: productData.name,
          p_sku_base: productData.sku,
          p_description: productData.description || null,
          p_category_id: productData.category_id || null,
          p_brand_id: productData.brand_id || null,
          p_image_urls: productData.image_urls,
          p_custom_attributes: productData.custom_attributes || null,
        });

        if (parentError) {
          currentError = parentError;
        } else {
          resultId = parentId; // Armazena o ID do pai como resultado principal

          // 2. Iterar e criar cada item de variação
          for (const variant of productData.variations) {
            const { data: variantItemId, error: variantError } = await supabase.rpc('create_product_variant_item', {
              p_parent_product_id: parentId,
              p_name: variant.name,
              p_sku: variant.sku,
              p_description: productData.description || null, // Variação pode herdar descrição do pai
              p_cost_price: parseFloat(variant.costPrice),
              p_sell_price: variant.sellPrice ? parseFloat(variant.sellPrice) : null,
              p_barcode: variant.ean ? parseInt(variant.ean) : 0,
              p_ncm: productData.ncm, // Variação herda NCM do pai
              p_cest: productData.cest || null, // Variação herda CEST do pai
              p_tax_origin_code: productData.tax_origin_code, // Variação herda Origem do pai
              p_weight: variant.weight ? parseFloat(variant.weight) : productData.weight || null, // Variação pode ter peso próprio ou herdar
              p_weight_type: variant.unitType || productData.weight_type || null, // Variação pode ter tipo de unidade próprio ou herdar
              p_package_length: variant.length ? parseInt(variant.length) : productData.package_length, // Variação pode ter dimensão própria ou herdar
              p_package_width: variant.width ? parseInt(variant.width) : productData.package_width,
              p_package_height: variant.height ? parseInt(variant.height) : productData.package_height,
              p_image_urls: variant.images,
              p_color: variant.color || null,
              p_size: variant.size || null,
              p_custom_attributes: variant.customType && variant.customValue ? { [variant.customType]: variant.customValue } : null,
              p_initial_stock_quantity: variant.stock ? parseInt(variant.stock) : 0,
              p_storage_id: variant.warehouse || null, // Armazém da variação
            });
            if (variantError) {
              currentError = variantError; // Captura o primeiro erro de variação
              break; // Para de criar variações se uma falhar
            }
          }
        }
      } else if (productData.type === 'ITEM' && productData.kitItems) {
        // Lógica para Kits (futuro, aqui apenas um placeholder)
        // Você precisará de uma função no DB como create_product_kit_group
        // e outra para vincular os itens do kit
        throw new Error("Criação de Kits não implementada ainda.");
      } else {
        throw new Error("Tipo de produto desconhecido ou dados ausentes.");
      }

      if (currentError) throw currentError;

      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso",
      });

      return resultId;
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