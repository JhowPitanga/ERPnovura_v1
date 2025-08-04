import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PrintingSettings {
  print_type: string;
  label_format: string;
}

export function usePrintingSettings() {
  const [settings, setSettings] = useState<PrintingSettings>({
    print_type: "Impressão comum PDF",
    label_format: "Imprimir etiqueta com DANFE SIMPLIFICADA"
  });
  const [loading, setLoading] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      // Mock data for now - will be replaced with actual DB call later
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Keep default settings for now
      setSettings({
        print_type: "Impressão comum PDF",
        label_format: "Imprimir etiqueta com DANFE SIMPLIFICADA"
      });
    } catch (error) {
      console.error("Erro ao buscar configurações de impressão:", error);
      // Keep default settings on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    refetch: fetchSettings
  };
}
