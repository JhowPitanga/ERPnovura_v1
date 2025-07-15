
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfiguracoesFiscais } from "@/components/configuracoes/ConfiguracoesFiscais";
import { ConfiguracoesUsuarios } from "@/components/configuracoes/ConfiguracoesUsuarios";

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState("fiscais");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações do sistema</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8 h-12 bg-gray-100">
          <TabsTrigger 
            value="fiscais" 
            className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-novura-primary data-[state=active]:shadow-sm"
          >
            Configurações Fiscais
          </TabsTrigger>
          <TabsTrigger 
            value="usuarios"
            className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-novura-primary data-[state=active]:shadow-sm"
          >
            Usuários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fiscais">
          <ConfiguracoesFiscais />
        </TabsContent>

        <TabsContent value="usuarios">
          <ConfiguracoesUsuarios />
        </TabsContent>
      </Tabs>
    </div>
  );
}
