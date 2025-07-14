
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
  User,
  ChevronDown,
  ChevronRight
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

const configMenuItems = [
  { title: "Configurações Fiscais", url: "/configuracoes/notas-fiscais", icon: FileText },
  { title: "Usuários", url: "/configuracoes/usuarios", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const [configExpanded, setConfigExpanded] = useState(currentPath.startsWith("/configuracoes"));

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");

  return (
    <Sidebar className="border-r-0 bg-white w-60" collapsible="icon">
      <SidebarContent className="bg-white">
        {/* Header with Logo */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-novura-primary rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-novura-primary rounded-full"></div>
              </div>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Novura</h1>
                <p className="text-sm text-gray-500 font-medium">ERP Inteligente</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="mt-8 px-6">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center space-x-4 px-5 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                        isActive(item.url)
                          ? "bg-novura-primary text-white shadow-lg"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className={`w-6 h-6 flex-shrink-0 ${
                        isActive(item.url) ? "text-white" : "text-gray-500 group-hover:text-novura-primary"
                      }`} />
                      {!isCollapsed && (
                        <span className="font-medium text-base">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuration Section */}
        <SidebarGroup className="mt-6 px-6">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {/* Configuration Header */}
              <SidebarMenuItem>
                <button
                  onClick={() => setConfigExpanded(!configExpanded)}
                  className={`w-full flex items-center space-x-4 px-5 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    currentPath.startsWith("/configuracoes")
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Settings className={`w-6 h-6 flex-shrink-0 ${
                    currentPath.startsWith("/configuracoes") ? "text-novura-primary" : "text-gray-500 group-hover:text-novura-primary"
                  }`} />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium text-base flex-1 text-left">Configurações</span>
                      {configExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </>
                  )}
                </button>
              </SidebarMenuItem>

              {/* Configuration Menu Items */}
              {(configExpanded || isCollapsed) && !isCollapsed && configMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center space-x-4 px-5 py-3 ml-4 rounded-lg transition-all duration-300 group relative ${
                        isActive(item.url)
                          ? "text-novura-primary bg-novura-primary/10 border-l-4 border-novura-primary"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        isActive(item.url) ? "bg-novura-primary" : "bg-gray-300"
                      }`} />
                      <span className="font-medium text-sm">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="p-6 mt-auto">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-novura-primary rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-base font-semibold text-gray-900">João Silva</span>
                    <p className="text-sm text-gray-600">Admin</p>
                  </div>
                </div>
                <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
