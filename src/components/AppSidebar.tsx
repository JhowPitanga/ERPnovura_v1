
import { useState } from "react";
import { 
  Home, 
  TrendingUp, 
  Package, 
  Megaphone, 
  ShoppingCart, 
  Store, 
  FileText, 
  Puzzle, 
  ShoppingBag,
  Sparkles,
  Bell,
  Users
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Início", url: "/", icon: Home },
  { title: "Desempenho", url: "/desempenho", icon: TrendingUp },
  { title: "Produtos", url: "/produtos", icon: Package },
  { title: "Central de Anúncios", url: "/anuncios", icon: Megaphone },
  { title: "Pedidos", url: "/pedidos", icon: ShoppingCart },
  { title: "Estoque", url: "/estoque", icon: Store },
  { title: "Notas Fiscais", url: "/notas-fiscais", icon: FileText },
  { title: "Aplicativos", url: "/aplicativos", icon: Puzzle },
  { title: "Recursos Seller", url: "/recursos-seller", icon: ShoppingBag },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");

  return (
    <Sidebar className="border-r border-gray-100" collapsible="icon">
      <SidebarContent className="bg-white">
        {/* Header with Logo */}
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-novura-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">Novura</h1>
                <p className="text-xs text-gray-500 font-medium">ERP Inteligente</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="mt-6 px-3">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                        isActive(item.url)
                          ? "bg-gradient-to-r from-novura-primary to-purple-600 text-white shadow-lg shadow-purple-500/25"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 flex-shrink-0 ${
                        isActive(item.url) ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                      }`} />
                      {!isCollapsed && (
                        <span className="font-medium text-sm">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* AI Assistant */}
        {!isCollapsed && (
          <div className="p-4 mt-auto">
            <div className="bg-gradient-to-r from-novura-primary/10 to-purple-600/10 rounded-xl p-4 border border-novura-primary/20">
              <div className="flex items-center space-x-3 text-novura-primary">
                <div className="w-8 h-8 bg-gradient-to-br from-novura-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold">IA Assistente</span>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Sugestões inteligentes ativadas
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
