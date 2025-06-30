import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Desempenho from "./pages/Desempenho";
import Produtos from "./pages/Produtos";
import Anuncios from "./pages/Anuncios";
import RecursosSeller from "./pages/RecursosSeller";
import Aplicativos from "./pages/Aplicativos";
import Estoque from "./pages/Estoque";
import NotasFiscais from "./pages/NotasFiscais";
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
          <Route path="/produtos/*" element={<Produtos />} />
          <Route path="/anuncios" element={<Anuncios />} />
          <Route path="/recursos-seller/*" element={<RecursosSeller />} />
          <Route path="/aplicativos" element={<Aplicativos />} />
          {/* Updated routes for the modules */}
          <Route path="/pedidos" element={<div className="p-6"><h1 className="text-2xl font-bold">Módulo Pedidos - Em desenvolvimento</h1></div>} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/notas-fiscais" element={<NotasFiscais />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
