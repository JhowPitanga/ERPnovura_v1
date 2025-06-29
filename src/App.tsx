
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Desempenho from "./pages/Desempenho";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/desempenho/*" element={<Desempenho />} />
          {/* Placeholder routes for other modules */}
          <Route path="/produtos" element={<div className="p-6"><h1 className="text-2xl font-bold">Módulo Produtos - Em desenvolvimento</h1></div>} />
          <Route path="/anuncios" element={<div className="p-6"><h1 className="text-2xl font-bold">Central de Anúncios - Em desenvolvimento</h1></div>} />
          <Route path="/pedidos" element={<div className="p-6"><h1 className="text-2xl font-bold">Módulo Pedidos - Em desenvolvimento</h1></div>} />
          <Route path="/estoque" element={<div className="p-6"><h1 className="text-2xl font-bold">Módulo Estoque - Em desenvolvimento</h1></div>} />
          <Route path="/notas-fiscais" element={<div className="p-6"><h1 className="text-2xl font-bold">Notas Fiscais - Em desenvolvimento</h1></div>} />
          <Route path="/aplicativos" element={<div className="p-6"><h1 className="text-2xl font-bold">Aplicativos - Em desenvolvimento</h1></div>} />
          <Route path="/recursos-seller" element={<div className="p-6"><h1 className="text-2xl font-bold">Recursos Seller - Em desenvolvimento</h1></div>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
