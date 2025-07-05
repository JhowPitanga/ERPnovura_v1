
import { useState } from "react";
import { Warehouse, Plus, Bell, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, PackageCheck, PackageOpen, Truck, Building2, BarChart3 } from "lucide-react";

// Import refactored components
import { EstoqueStats } from "@/components/estoque/EstoqueStats";
import { EstoqueFilters } from "@/components/estoque/EstoqueFilters";
import { EstoqueTab } from "@/components/estoque/tabs/EstoqueTab";
import { RecebimentoTab } from "@/components/estoque/tabs/RecebimentoTab";
import { PickingTab } from "@/components/estoque/tabs/PickingTab";
import { ExpedicaoTab } from "@/components/estoque/tabs/ExpedicaoTab";
import { FulfillmentTab } from "@/components/estoque/tabs/FulfillmentTab";
import { InventarioTab } from "@/components/estoque/tabs/InventarioTab";

export default function Estoque() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGalpao, setSelectedGalpao] = useState("todos");
  const [selectedMarketplace, setSelectedMarketplace] = useState("todos");
  const [activeTab, setActiveTab] = useState("estoque");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Warehouse className="w-6 h-6 text-novura-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Sistema WMS - Gestão Completa</h2>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      Equipe
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Chat da Equipe</DrawerTitle>
                      <DrawerDescription>
                        Converse com sua equipe em tempo real
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 h-96">
                      <div className="bg-gray-50 rounded-lg p-4 h-full flex items-center justify-center">
                        <p className="text-gray-500">Chat da equipe em desenvolvimento</p>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema WMS Completo</h1>
                <p className="text-gray-600">Gestão completa de armazém com controle de fulfillment</p>
              </div>
              <Button className="bg-novura-primary hover:bg-novura-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Nova Operação
              </Button>
            </div>

            {/* Stats Cards */}
            <EstoqueStats />

            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm">
                <TabsTrigger value="estoque" className="data-[state=active]:bg-novura-primary data-[state=active]:text-white">
                  <Archive className="w-4 h-4 mr-2" />
                  Estoque
                </TabsTrigger>
                <TabsTrigger value="recebimento" className="data-[state=active]:bg-novura-primary data-[state=active]:text-white">
                  <PackageCheck className="w-4 h-4 mr-2" />
                  Recebimento
                </TabsTrigger>
                <TabsTrigger value="picking" className="data-[state=active]:bg-novura-primary data-[state=active]:text-white">
                  <PackageOpen className="w-4 h-4 mr-2" />
                  Picking
                </TabsTrigger>
                <TabsTrigger value="expedicao" className="data-[state=active]:bg-novura-primary data-[state=active]:text-white">
                  <Truck className="w-4 h-4 mr-2" />
                  Expedição
                </TabsTrigger>
                <TabsTrigger value="fulfillment" className="data-[state=active]:bg-novura-primary data-[state=active]:text-white">
                  <Building2 className="w-4 h-4 mr-2" />
                  Fulfillment
                </TabsTrigger>
                <TabsTrigger value="inventario" className="data-[state=active]:bg-novura-primary data-[state=active]:text-white">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Inventário
                </TabsTrigger>
              </TabsList>

              {/* Filters */}
              <EstoqueFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedGalpao={selectedGalpao}
                setSelectedGalpao={setSelectedGalpao}
                selectedMarketplace={selectedMarketplace}
                setSelectedMarketplace={setSelectedMarketplace}
              />

              {/* Content */}
              <TabsContent value="estoque">
                <EstoqueTab />
              </TabsContent>

              <TabsContent value="recebimento">
                <RecebimentoTab />
              </TabsContent>

              <TabsContent value="picking">
                <PickingTab />
              </TabsContent>

              <TabsContent value="expedicao">
                <ExpedicaoTab />
              </TabsContent>

              <TabsContent value="fulfillment">
                <FulfillmentTab />
              </TabsContent>

              <TabsContent value="inventario">
                <InventarioTab />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
