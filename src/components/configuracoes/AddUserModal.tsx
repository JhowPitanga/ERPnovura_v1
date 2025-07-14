import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

interface UserData {
  email: string;
  nome: string;
  telefone: string;
  permissions: Record<string, boolean>;
}

const modules = [
  { id: 'desempenho', name: 'Desempenho' },
  { id: 'produtos', name: 'Produtos' },
  { id: 'anuncios', name: 'Central de Anúncios' },
  { id: 'pedidos', name: 'Pedidos' },
  { id: 'estoque', name: 'Estoque' },
  { id: 'notas_fiscais', name: 'Notas Fiscais' },
  { id: 'aplicativos', name: 'Aplicativos' },
  { id: 'recursos_seller', name: 'Recursos Seller' },
];

export function AddUserModal({ open, onOpenChange, onUserAdded }: AddUserModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    email: '',
    nome: '',
    telefone: '',
    permissions: {}
  });
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!userData.email.trim()) {
        toast.error("Email é obrigatório");
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        toast.error("Usuário não autenticado");
        return;
      }

      const { error } = await supabase
        .from('user_invitations')
        .insert({
          email: userData.email,
          nome: userData.nome,
          telefone: userData.telefone || null,
          permissions: userData.permissions,
          invited_by_user_id: authData.user.id,
          status: 'pendente'
        });

      if (error) throw error;

      toast.success("Usuário convidado com sucesso!");
      onUserAdded();
      onOpenChange(false);
      setCurrentStep(1);
      setUserData({
        email: '',
        nome: '',
        telefone: '',
        permissions: {}
      });
    } catch (error) {
      console.error('Erro ao convidar usuário:', error);
      toast.error("Erro ao convidar usuário");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (moduleId: string, checked: boolean) => {
    setUserData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleId]: checked
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Usuário - Passo {currentStep} de 2</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-novura-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 rounded ${currentStep >= 2 ? 'bg-novura-primary' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-novura-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>

          {/* Step 1: User Info */}
          {currentStep === 1 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Informações do Usuário</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="usuario@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={userData.nome}
                    onChange={(e) => setUserData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Nome do usuário"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={userData.telefone}
                    onChange={(e) => setUserData(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Permissions */}
          {currentStep === 2 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Permissões</h3>
              <div className="space-y-3">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={module.id}
                      checked={userData.permissions[module.id] || false}
                      onCheckedChange={(checked) => handlePermissionChange(module.id, checked as boolean)}
                    />
                    <Label htmlFor={module.id} className="text-sm font-medium">
                      {module.name}
                    </Label>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            {currentStep < 2 ? (
              <Button onClick={handleNext}>
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSave}
                disabled={loading}
                className="bg-novura-primary hover:bg-novura-primary/90"
              >
                {loading ? "Salvando..." : "Salvar Usuário"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}