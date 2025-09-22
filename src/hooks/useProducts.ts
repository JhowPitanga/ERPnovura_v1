// src/hooks/useProducts.ts

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Hook para buscar todos os produtos de um usuário
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id)
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  return { products, loading, error };
}

// Hook para criar um novo produto
export const useCreateProduct = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createProduct = async (productData: any) => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .single();
        if (error) throw error;
        return data;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    };

    return { createProduct, loading, error };
};


// Hook para buscar produtos que podem ser vinculados
// Este resolve o erro 'useBindableProducts'
export function useBindableProducts() {
    const [bindableProducts, setBindableProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchBindableProducts = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                // Supondo que você tem uma coluna 'is_bindable' ou 'status' para filtrar
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('status', 'vinculavel'); // Exemplo de filtro

                if (error) {
                    throw error;
                }
                setBindableProducts(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBindableProducts();
    }, [user]);

    return { bindableProducts, loading, error };
}