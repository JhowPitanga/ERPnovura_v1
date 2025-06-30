
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
import Pedidos from "./pages/Pedidos";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          
          {/* Dashboard routes */}
          <Route path="/" element={<Index />} />
          <Route path="/desempenho/*" element={<Desempenho />} />
          <Route path="/produtos/*" element={<Produtos />} />
          <Route path="/anuncios/*" element={<Anuncios />} />
          <Route path="/recursos-seller/*" element={<RecursosSeller />} />
          <Route path="/aplicativos" element={<Aplicativos />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/notas-fiscais" element={<NotasFiscais />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
