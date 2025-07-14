import { useState, useEffect } from "react";
import { X, Plus, User, Mail, Phone, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface ConfiguracoesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConfiguracoesModal({ open, onOpenChange }: ConfiguracoesModalProps) {
  const [activeTab, setActiveTab] = useState<'fiscais' | 'usuarios'>('fiscais');

  const tabs = [
    { id: 'fiscais' as const, label: 'Configurações Fiscais' },
    { id: 'usuarios' as const, label: 'Usuários' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Configurações
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Horizontal Navigation */}
          <div className="flex space-x-8 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-novura-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-novura-primary" />
                )}
              </button>
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {activeTab === 'fiscais' && (
            <div className="h-full overflow-auto">
              <ConfiguracoesFiscaisContent />
            </div>
          )}
          {activeTab === 'usuarios' && (
            <div className="h-full overflow-auto">
              <ConfiguracoesUsuariosContent />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Content components without sidebar layout
function ConfiguracoesFiscaisContent() {
  const [companies, setCompanies] = useState<any[]>([]);
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
    <div className="p-6">
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
    </div>
  );
}

function ConfiguracoesUsuariosContent() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    navigate('/configuracoes/usuarios/novo-usuario');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'inativo':
        return <Badge className="bg-red-100 text-red-800">Inativo</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const countPermissions = (permissions: any) => {
    if (!permissions || typeof permissions !== 'object') return 0;
    return Object.values(permissions).filter(Boolean).length;
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
            <p className="text-gray-600 mt-2">Gerencie usuários e suas permissões no sistema</p>
          </div>
          <Button 
            onClick={handleAddUser}
            className="bg-novura-primary hover:bg-novura-primary/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Usuário
          </Button>
        </div>

        {/* Current User Card */}
        {user && (
          <Card className="mb-6 border-novura-primary/20 bg-novura-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-novura-primary" />
                  Usuário Administrador (Você)
                </CardTitle>
                <Badge className="bg-novura-primary text-white">Admin</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Permissões:</span>
                  <span className="font-medium">Acesso total</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
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
        ) : users.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum usuário convidado
                </h3>
                <p className="text-gray-600 mb-6">
                  Comece adicionando usuários para dar acesso ao sistema.
                </p>
                <Button 
                  onClick={handleAddUser}
                  className="bg-novura-primary hover:bg-novura-primary/90"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Primeiro Usuário
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {users.map((userInvitation) => (
              <Card key={userInvitation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-novura-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-novura-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{userInvitation.nome}</CardTitle>
                        <p className="text-sm text-gray-600">{userInvitation.email}</p>
                      </div>
                    </div>
                    {getStatusBadge(userInvitation.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Telefone:</span>
                      <span className="font-medium">{userInvitation.telefone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Permissões:</span>
                      <span className="font-medium">{countPermissions(userInvitation.permissions)} módulos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Convidado em:</span>
                      <span className="font-medium">
                        {new Date(userInvitation.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}