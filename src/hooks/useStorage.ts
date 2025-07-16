import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

export type Storage = Tables<'storage'>;

export function useStorage() {
  const [storageLocations, setStorageLocations] = useState<Storage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStorage = async () => {
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
  }, []);

  return {
    storageLocations,
    loading,
    refetch: fetchStorage,
  };
}