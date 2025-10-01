
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
  MessageSquare,
  BarChart2
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

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

const startModule = [
  { title: "Início", url: "/", icon: Home },
];

const managementModules = [
  { title: "Desempenho", url: "/desempenho", icon: TrendingUp },
  { title: "Pesquisa de Mercado", url: "/pesquisa-mercado", icon: BarChart2 },
  { title: "Produtos", url: "/produtos", icon: Package },
  { title: "Central de Anúncios", url: "/anuncios", icon: Megaphone },
  { title: "SAC", url: "/sac", icon: MessageSquare },
  { title: "Pedidos", url: "/pedidos", icon: ShoppingCart },
  { title: "Equipe", url: "/equipe", icon: Users },
  { title: "Estoque", url: "/estoque", icon: Store },
  { title: "Notas Fiscais", url: "/notas-fiscais", icon: FileText },
];

const toolsModules = [
  { title: "Recursos Seller", url: "/recursos-seller", icon: ShoppingBag },
  { title: "Aplicativos", url: "/aplicativos", icon: Puzzle },
  { title: "Comunidade", url: "/comunidade", icon: MessageSquare },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");

  const handleConfigClick = () => {
    navigate('/configuracoes');
  };

  return (
    <>
      {/* Toggle button positioned on the sidebar edge */}
      {/* Removed fixed top-left trigger */}
      <Sidebar className="border-r-0 bg-white" collapsible="icon">
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-50 hidden md:block">
          <SidebarTrigger />
        </div>
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

          {/* Início */}
          <SidebarGroup className="mt-4 px-6">
            {!isCollapsed && <SidebarGroupLabel className="text-gray-500">Início</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-3">
                {startModule.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center ${isCollapsed ? "justify-center space-x-0 px-0" : "space-x-4 px-5"} py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                          isActive(item.url)
                            ? "bg-novura-primary text-white shadow-lg"
                            : "text-gray-700 hover:bg-gray-200 hover:text-gray-800"
                        }`}
                      >
                        <item.icon className={`w-6 h-6 flex-shrink-0 ${isCollapsed ? "mx-auto" : ""} ${
                          isActive(item.url) ? "text-white" : "text-gray-500 group-hover:text-gray-800"
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

          {/* Gerenciamento */}
          <SidebarGroup className="mt-6 px-6">
            {!isCollapsed && <SidebarGroupLabel className="text-gray-500">Gerenciamento</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-3">
                {managementModules.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center ${isCollapsed ? "justify-center space-x-0 px-0" : "space-x-4 px-5"} py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                          isActive(item.url)
                            ? "bg-novura-primary text-white shadow-lg"
                            : "text-gray-700 hover:bg-gray-200 hover:text-gray-800"
                        }`}
                      >
                        <item.icon className={`w-6 h-6 flex-shrink-0 ${isCollapsed ? "mx-auto" : ""} ${
                          isActive(item.url) ? "text-white" : "text-gray-500 group-hover:text-gray-800"
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

          {/* Ferramentas */}
          <SidebarGroup className="mt-6 px-6">
            {!isCollapsed && <SidebarGroupLabel className="text-gray-500">Ferramentas</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-3">
                {toolsModules.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center ${isCollapsed ? "justify-center space-x-0 px-0" : "space-x-4 px-5"} py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                          isActive(item.url)
                            ? "bg-novura-primary text-white shadow-lg"
                            : "text-gray-700 hover:bg-gray-200 hover:text-gray-800"
                        }`}
                      >
                        <item.icon className={`w-6 h-6 flex-shrink-0 ${isCollapsed ? "mx-auto" : ""} ${
                          isActive(item.url) ? "text-white" : "text-gray-500 group-hover:text-gray-800"
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
                  <button 
                    onClick={handleConfigClick}
                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </SidebarContent>
      </Sidebar>
    </>
  );
}
