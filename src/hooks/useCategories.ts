import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Caminho para seu cliente Supabase
import { Tables } from '@/integrations/supabase/types'; // Importa tipos de tabela do Supabase
import { useToast } from '@/hooks/use-toast'; // Importa seu hook de toast

// Define o tipo para Category, baseado na sua tabela 'categories'
export type Category = Tables<'categories'>;

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
  }, []); // Não há [user] aqui, pois não depende de autenticação para buscar (se necessário, adicione useAuth)

  return {
    categories,
    loading,
    createCategory,
    refetch: fetchCategories,
  };
}