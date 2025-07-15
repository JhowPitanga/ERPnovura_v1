
import { useState } from "react";
import { Settings2, User, Bell } from "lucide-react";
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

interface UserProfileDrawerProps {
  children: React.ReactNode;
}

export function UserProfileDrawer({ children }: UserProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState("perfil");
  const [profileData, setProfileData] = useState({
    nome: "João Silva",
    email: "joao@empresa.com",
    telefone: "(11) 99999-9999"
  });
  
  const [notifications, setNotifications] = useState({
    vendas: true,
    atualizacoes: false,
    equipe: true
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
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
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
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
          </Tabs>
        </div>

        <DrawerFooter>
          <Button className="bg-novura-primary hover:bg-novura-primary/90">
            Salvar Alterações
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
