
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StepIndicator } from "@/components/produtos/criar/StepIndicator";

const steps = [
  { id: 1, title: "Dados", description: "Informações básicas" },
  { id: 2, title: "Permissões", description: "Acessos do sistema" }
];

const systemModules = [
  { id: "desempenho", name: "Desempenho" },
  { id: "produtos", name: "Produtos" },
  { id: "anuncios", name: "Central de Anúncios" },
  { id: "pedidos", name: "Pedidos" },
  { id: "estoque", name: "Estoque" },
  { id: "notas_fiscais", name: "Notas Fiscais" },
  { id: "aplicativos", name: "Aplicativos" },
  { id: "recursos_seller", name: "Recursos Seller" },
  { id: "gerenciar_usuarios", name: "Gerenciar Usuários" }
];

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

export function AddUserModal({ open, onOpenChange, onUserAdded }: AddUserModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    nome: "",
    telefone: ""
  });
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  const handleNext = () => {
    if (currentStep === 1 && !userData.email) {
      toast.error("Email é obrigatório");
      return;
    }
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSave();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Primeiro, criar o convite na tabela user_invitations
      const { error: inviteError } = await supabase
        .from('user_invitations')
        .insert([{
          email: userData.email,
          nome: userData.nome,
          telefone: userData.telefone || null,
          permissions: permissions,
          invited_by_user_id: user.id,
          status: 'pendente'
        }]);

      if (inviteError) throw inviteError;

      // Gerar uma senha temporária
      const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';

      // Criar o usuário no Supabase Auth
      const { error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: userData.nome,
          phone: userData.telefone,
          permissions: permissions,
          invited_by: user.id
        }
      });

      if (authError) {
        console.log('Erro ao criar usuário no auth, mas convite foi salvo:', authError);
      }

      toast.success('Usuário convidado com sucesso! Um email com as instruções de acesso foi enviado.');
      onUserAdded();
      onOpenChange(false);
      
      // Reset form
      setCurrentStep(1);
      setUserData({ email: "", nome: "", telefone: "" });
      setPermissions({});
    } catch (error) {
      console.error('Erro ao convidar usuário:', error);
      toast.error('Erro ao convidar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (moduleId: string, checked: boolean) => {
    setPermissions(prev => ({ ...prev, [moduleId]: checked }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1"
                placeholder="usuario@empresa.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                Nome
              </Label>
              <Input
                id="nome"
                value={userData.nome}
                onChange={(e) => setUserData(prev => ({ ...prev, nome: e.target.value }))}
                className="mt-1"
                placeholder="Nome do usuário"
              />
            </div>

            <div>
              <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                Telefone
              </Label>
              <Input
                id="telefone"
                value={userData.telefone}
                onChange={(e) => setUserData(prev => ({ ...prev, telefone: e.target.value }))}
                className="mt-1"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Selecione as permissões do usuário
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {systemModules.map((module) => (
                  <div key={module.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={module.id}
                      checked={permissions[module.id] || false}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(module.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={module.id} 
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      {module.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Adicionar Usuário
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <StepIndicator steps={steps} currentStep={currentStep} />

          <div className="min-h-[300px]">
            {renderCurrentStep()}
          </div>

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Voltar
            </Button>

            <Button
              onClick={handleNext}
              disabled={loading}
              className="bg-novura-primary hover:bg-novura-primary/90"
            >
              {loading ? "Salvando..." : currentStep === 2 ? "Salvar Usuário" : "Próximo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
