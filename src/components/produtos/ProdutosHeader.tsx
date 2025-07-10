
import { Plus, Bell, Users, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export function ProdutosHeader() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm">
      <SidebarTrigger className="mr-4" />
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Package className="w-6 h-6 text-novura-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Produtos</h2>
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
  );
}
