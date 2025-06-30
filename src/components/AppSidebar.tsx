
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
  Users,
  Settings,
  User
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

const menuItems = [
  { title: "Início", url: "/", icon: Home },
  { title: "Desempenho", url: "/desempenho", icon: TrendingUp },
  { title: "Produtos", url: "/produtos", icon: Package },
  { title: "Central de Anúncios", url: "/anuncios", icon: Megaphone },
  { title: "Pedidos", url: "/pedidos", icon: ShoppingCart },
  { title: "Equipe", url: "/equipe", icon: Users },
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
    <Sidebar className="border-r-0 bg-gradient-to-b from-white to-gray-50/30 backdrop-blur-xl" collapsible="icon">
      <SidebarContent className="bg-transparent">
        {/* Header with Logo */}
        <div className="p-6 border-b border-gray-100/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-novura-primary via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-purple-500/10">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-gradient-to-br from-novura-primary to-purple-600 rounded-full"></div>
              </div>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Novura</h1>
                <p className="text-xs text-gray-500 font-medium">ERP Inteligente</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="mt-6 px-3">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                        isActive(item.url)
                          ? "bg-gradient-to-r from-novura-primary to-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105"
                          : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50 hover:text-gray-900 hover:scale-102"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 flex-shrink-0 ${
                        isActive(item.url) ? "text-white" : "text-gray-500 group-hover:text-purple-600"
                      }`} />
                      {!isCollapsed && (
                        <span className="font-medium text-sm">{item.title}</span>
                      )}
                      {isActive(item.url) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl"></div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="p-4 mt-auto">
            <div className="bg-gradient-to-r from-gray-50 to-purple-50/50 rounded-2xl p-4 border border-gray-100/60 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-novura-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">João Silva</span>
                    <p className="text-xs text-gray-600">Admin</p>
                  </div>
                </div>
                <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100/60 hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
