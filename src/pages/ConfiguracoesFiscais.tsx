import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Company {
  id: string;
  razao_social: string;
  cnpj: string;
  tipo_empresa: string;
  tributacao: string;
  inscricao_estadual: string;
  email: string;
  created_at: string;
}

export default function ConfiguracoesFiscais() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar empresas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = () => {
    navigate('/configuracoes/notas-fiscais/nova-empresa');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-white">
            <SidebarTrigger className="-ml-1" />
          </header>

          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Configurações Fiscais</h1>
                  <p className="text-gray-600 mt-2">Gerencie as configurações de emissão de notas fiscais</p>
                </div>
                <Button 
                  onClick={handleAddCompany}
                  className="bg-novura-primary hover:bg-novura-primary/90"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Empresa
                </Button>
              </div>

              {/* Companies List */}
              {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : companies.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="max-w-md mx-auto">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Nenhuma empresa cadastrada
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Comece adicionando uma empresa para configurar a emissão de notas fiscais.
                      </p>
                      <Button 
                        onClick={handleAddCompany}
                        className="bg-novura-primary hover:bg-novura-primary/90"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Adicionar Primeira Empresa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {companies.map((company) => (
                    <Card key={company.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{company.razao_social}</CardTitle>
                        <p className="text-sm text-gray-600">CNPJ: {company.cnpj}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tipo:</span>
                            <span className="font-medium">{company.tipo_empresa}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tributação:</span>
                            <span className="font-medium">{company.tributacao}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">IE:</span>
                            <span className="font-medium">{company.inscricao_estadual || 'N/A'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}