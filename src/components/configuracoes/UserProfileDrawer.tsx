
import { useState, useEffect } from "react";
import { Settings2, User, Bell, Key } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface UserProfileDrawerProps {
  children: React.ReactNode;
}

export function UserProfileDrawer({ children }: UserProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState("perfil");
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    nome: "",
    email: "",
    telefone: ""
  });
  
  const [notifications, setNotifications] = useState({
    vendas: true,
    atualizacoes: false,
    equipe: true
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
    otpCode: "",
    showOtpInput: false
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        nome: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        email: user.email || '',
        telefone: user.user_metadata?.phone || ''
      });
    }
  }, [user]);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
  };

  const handleSendOtpCode = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      // Simular envio de OTP (em produção, você enviaria via edge function)
      toast.success('Código de verificação enviado para seu email');
      setPasswordData(prev => ({ ...prev, showOtpInput: true }));
    } catch (error) {
      toast.error('Erro ao enviar código de verificação');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!passwordData.otpCode || passwordData.otpCode.length !== 6) {
      toast.error('Código de verificação inválido');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast.success('Senha alterada com sucesso');
      setPasswordData({
        newPassword: "",
        confirmPassword: "",
        otpCode: "",
        showOtpInput: false
      });
      setActiveTab("perfil");
    } catch (error) {
      toast.error('Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.nome,
          phone: profileData.telefone
        }
      });

      if (error) throw error;

      toast.success('Perfil atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl font-bold text-gray-900">
            Configurações do Perfil
          </DrawerTitle>
          <DrawerDescription className="text-gray-600">
            Gerencie suas informações pessoais e notificações
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100">
              <TabsTrigger 
                value="perfil" 
                className="data-[state=active]:bg-white data-[state=active]:text-novura-primary"
              >
                Perfil
              </TabsTrigger>
              <TabsTrigger 
                value="notificacoes"
                className="data-[state=active]:bg-white data-[state=active]:text-novura-primary"
              >
                Notificações
              </TabsTrigger>
              <TabsTrigger 
                value="senha"
                className="data-[state=active]:bg-white data-[state=active]:text-novura-primary"
              >
                Senha
              </TabsTrigger>
            </TabsList>

            <TabsContent value="perfil" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                    Nome do usuário
                  </Label>
                  <Input
                    id="nome"
                    value={profileData.nome}
                    onChange={(e) => handleProfileChange('nome', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    value={profileData.telefone}
                    onChange={(e) => handleProfileChange('telefone', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notificacoes" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Vendas
                    </Label>
                    <p className="text-xs text-gray-500">
                      Receber notificações sobre vendas e pedidos
                    </p>
                  </div>
                  <Switch
                    checked={notifications.vendas}
                    onCheckedChange={(value) => handleNotificationChange('vendas', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Atualizações do sistema
                    </Label>
                    <p className="text-xs text-gray-500">
                      Receber notificações sobre atualizações e melhorias
                    </p>
                  </div>
                  <Switch
                    checked={notifications.atualizacoes}
                    onCheckedChange={(value) => handleNotificationChange('atualizacoes', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Equipe (mensagens enviadas)
                    </Label>
                    <p className="text-xs text-gray-500">
                      Receber notificações de mensagens da equipe
                    </p>
                  </div>
                  <Switch
                    checked={notifications.equipe}
                    onCheckedChange={(value) => handleNotificationChange('equipe', value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="senha" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Key className="w-5 h-5 text-novura-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Alterar Senha
                  </h3>
                </div>

                {!passwordData.showOtpInput ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      Para sua segurança, enviaremos um código de verificação para seu email.
                    </p>
                    <Button 
                      onClick={handleSendOtpCode}
                      disabled={loading}
                      className="bg-novura-primary hover:bg-novura-primary/90"
                    >
                      {loading ? "Enviando..." : "Enviar Código de Verificação"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Código de Verificação
                      </Label>
                      <p className="text-xs text-gray-500 mb-2">
                        Digite o código de 6 dígitos enviado para seu email
                      </p>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={passwordData.otpCode}
                          onChange={(value) => setPasswordData(prev => ({ ...prev, otpCode: value }))}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                        Nova Senha
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="mt-1"
                        placeholder="Digite sua nova senha"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirmar Nova Senha
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="mt-1"
                        placeholder="Confirme sua nova senha"
                      />
                    </div>

                    <Button 
                      onClick={handleChangePassword}
                      disabled={loading || !passwordData.otpCode || passwordData.otpCode.length !== 6}
                      className="w-full bg-novura-primary hover:bg-novura-primary/90"
                    >
                      {loading ? "Alterando..." : "Alterar Senha"}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DrawerFooter>
          {activeTab === "perfil" && (
            <Button 
              onClick={handleSaveProfile}
              disabled={loading}
              className="bg-novura-primary hover:bg-novura-primary/90"
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          )}
          {activeTab === "notificacoes" && (
            <Button className="bg-novura-primary hover:bg-novura-primary/90">
              Salvar Notificações
            </Button>
          )}
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
