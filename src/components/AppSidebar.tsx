
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
  ChevronDown,
  Sparkles
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

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
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} border-r border-purple-200 bg-gradient-to-b from-novura-primary to-novura-dark`} collapsible>
      <SidebarContent className="bg-transparent">
        {/* Logo */}
        <div className="p-4 border-b border-purple-400/30">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-novura-primary" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-white">Novura</h1>
                <p className="text-xs text-purple-200">ERP Inteligente</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="mt-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                        isActive(item.url)
                          ? "bg-white/20 text-white shadow-md"
                          : "text-purple-100 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="font-medium text-sm">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* AI Assistant Button */}
        {!collapsed && (
          <div className="p-4 mt-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center space-x-2 text-white">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">IA Assistente</span>
              </div>
              <p className="text-xs text-purple-200 mt-1">
                Sugestões inteligentes ativadas
              </p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
