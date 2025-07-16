import { useState } from "react";
import { Search, Filter, Settings, FileText, Printer, Bot, TrendingUp, Zap, QrCode, Check, Calendar, Download, X, ChevronDown, ChevronUp, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PedidoDetails } from "@/components/pedidos/PedidoDetails";
import { ScannerModal } from "@/components/pedidos/ScannerModal";
import { VincularPedidoModal } from "@/components/pedidos/VincularPedidoModal";
import { EmissaoNFDrawer } from "@/components/pedidos/EmissaoNFDrawer";
import { PrintConfigModal } from "@/components/pedidos/PrintConfigModal";
import { AIIndicator } from "@/components/equipe/AIIndicator";
import { PeriodFilter } from "@/components/pedidos/PeriodFilter";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";

const statusBlocks = [
  { id: "todos", title: "Todos", count: 164, description: "Todos os pedidos" },
  { id: "vincular", title: "Vincular", count: 18, description: "Pedidos aguardando vinculação" },
  { id: "emissao", title: "Emissão de NF-e", count: 12, description: "Aguardando emissão de nota fiscal" },
  { id: "impressao", title: "Impressão", count: 25, description: "Prontos para impressão" },
  { id: "coleta", title: "Aguardando Coleta", count: 34, description: "Aguardando coleta" },
  { id: "enviado", title: "Enviado", count: 67, description: "Pedidos enviados" },
  { id: "cancelados", title: "Cancelados", count: 8, description: "Pedidos cancelados e devoluções" },
];

// Updated mock data with multiple items per order and platform IDs
const mockPedidos = {
  todos: [
    { 
      id: "PED001", 
      marketplace: "Mercado Livre", 
      produto: "iPhone 15 Pro Max 256GB", 
      sku: "IPH15PM-256", 
      cliente: "João Silva Santos", 
      valor: 8999.99, 
      data: "15/01/2024", 
      status: "Pendente", 
      margem: 22.5, 
      tipoEnvio: "ML Envios", 
      image: "/placeholder.svg",
      idPlataforma: "MLB123456789",
      quantidade: 1,
      itens: [
        { produto: "iPhone 15 Pro Max 256GB", sku: "IPH15PM-256", quantidade: 1, valor: 8999.99, image: "/placeholder.svg" }
      ],
      aiSuggestion: {
        type: "high_margin",
        suggestion: "Margem alta detectada",
        details: "Este pedido tem uma margem de 22.5%, considerada alta. Considere priorizar o processamento e verificar se há oportunidade de otimização adicional."
      }
    },
    { 
      id: "PED002", 
      marketplace: "Amazon", 
      produto: "MacBook Air M3 16GB 512GB", 
      sku: "MBA-M3-512", 
      cliente: "Maria Santos Costa", 
      valor: 12999.99, 
      data: "15/01/2024", 
      status: "Pendente", 
      margem: 18.3, 
      tipoEnvio: "Amazon Prime", 
      image: "/placeholder.svg",
      idPlataforma: "AMZ987654321",
      quantidade: 2,
      itens: [
        { produto: "MacBook Air M3 16GB 512GB", sku: "MBA-M3-512", quantidade: 1, valor: 12999.99, image: "/placeholder.svg" },
        { produto: "Mouse Magic Mouse", sku: "MM-001", quantidade: 1, valor: 599.99, image: "/placeholder.svg" }
      ],
      aiSuggestion: {
        type: "low_stock",
        suggestion: "Estoque baixo detectado",
        details: "Apenas 3 unidades restantes em estoque. Considere reabastecer para evitar rupturas e manter a disponibilidade."
      }
    },
    { 
      id: "PED003", 
      marketplace: "Shopee", 
      produto: "Samsung Galaxy S24 Ultra", 
      sku: "SGS24U-256", 
      cliente: "Carlos Oliveira", 
      valor: 6999.99, 
      data: "14/01/2024", 
      status: "Enviado", 
      margem: 25.1, 
      tipoEnvio: "Shopee Xpress", 
      image: "/placeholder.svg",
      idPlataforma: "SHP789123456",
      quantidade: 1,
      itens: [
        { produto: "Samsung Galaxy S24 Ultra", sku: "SGS24U-256", quantidade: 1, valor: 6999.99, image: "/placeholder.svg" }
      ]
    },
    { 
      id: "PED004", 
      marketplace: "Magazine Luiza", 
      produto: "Nintendo Switch OLED", 
      sku: "NSW-OLED", 
      cliente: "Ana Paula Lima", 
      valor: 2299.99, 
      data: "14/01/2024", 
      status: "Coleta", 
      margem: 15.7, 
      tipoEnvio: "Magalu Entrega", 
      image: "/placeholder.svg",
      idPlataforma: "MAG456789123",
      quantidade: 1,
      itens: [
        { produto: "Nintendo Switch OLED", sku: "NSW-OLED", quantidade: 1, valor: 2299.99, image: "/placeholder.svg" }
      ]
    },
    { 
      id: "PED005", 
      marketplace: "Americanas", 
      produto: "iPad Air 5ª Geração", 
      sku: "IPAD-AIR5", 
      cliente: "Roberto Ferreira", 
      valor: 4199.99, 
      data: "13/01/2024", 
      status: "Impressão", 
      margem: 19.8, 
      tipoEnvio: "B2W Entrega", 
      image: "/placeholder.svg",
      idPlataforma: "AME321654987",
      quantidade: 1,
      itens: [
        { produto: "iPad Air 5ª Geração", sku: "IPAD-AIR5", quantidade: 1, valor: 4199.99, image: "/placeholder.svg" }
      ]
    }
  ],
  vincular: Array.from({ length: 35 }, (_, i) => ({
    id: `PED${String(i + 100).padStart(3, '0')}`,
    marketplace: ["Mercado Livre", "Amazon", "Shopee", "Magazine Luiza"][i % 4],
    produto: ["iPhone 15 Pro Max", "MacBook Air M3", "Samsung Galaxy S24", "Nintendo Switch"][i % 4],
    sku: [`SKU-${i + 100}`],
    cliente: [`Cliente ${i + 1}`, "Maria Silva", "João Santos", "Ana Costa"][i % 4],
    valor: 1000 + (i * 100),
    data: "15/01/2024",
    status: "Pendente",
    margem: 15 + (i % 20),
    tipoEnvio: ["ML Envios", "Amazon Prime", "Shopee Xpress", "Magalu Entrega"][i % 4],
    image: "/placeholder.svg",
    idPlataforma: `PLT${String(i + 100).padStart(6, '0')}`,
    quantidade: 1 + (i % 3),
    itens: [
      { produto: ["iPhone 15 Pro Max", "MacBook Air M3", "Samsung Galaxy S24", "Nintendo Switch"][i % 4], sku: `SKU-${i + 100}`, quantidade: 1 + (i % 3), valor: 1000 + (i * 100), image: "/placeholder.svg" }
    ],
    ...(i % 5 === 0 && {
      aiSuggestion: {
        type: "profit_opportunity",
        suggestion: "Oportunidade de lucro",
        details: "Produto com potencial de aumento de margem baseado em análise de mercado."
      }
    })
  })),
  emissao: Array.from({ length: 35 }, (_, i) => ({
    id: `PED${String(i + 200).padStart(3, '0')}`,
    marketplace: ["Amazon", "Shopee", "Mercado Livre"][i % 3],
    produto: ["Dell XPS 13", "iPhone 14", "Samsung Monitor"][i % 3],
    sku: [`SKU-${i + 200}`],
    cliente: [`Cliente Emissão ${i + 1}`],
    valor: 2000 + (i * 150),
    data: "12/01/2024",
    status: "Emitir",
    margem: 18 + (i % 15),
    tipoEnvio: ["Amazon Prime", "Shopee Xpress", "ML Envios"][i % 3],
    image: "/placeholder.svg",
    idPlataforma: `EMI${String(i + 200).padStart(6, '0')}`,
    quantidade: 1,
    itens: [
      { produto: ["Dell XPS 13", "iPhone 14", "Samsung Monitor"][i % 3], sku: `SKU-${i + 200}`, quantidade: 1, valor: 2000 + (i * 150), image: "/placeholder.svg" }
    ]
  })),
  impressao: Array.from({ length: 35 }, (_, i) => ({
    id: `PED${String(i + 300).padStart(3, '0')}`,
    marketplace: ["Shopee", "Magazine Luiza", "Americanas"][i % 3],
    produto: ["Monitor 4K", "Mouse Gamer", "Teclado Mecânico"][i % 3],
    sku: [`SKU-${i + 300}`],
    cliente: [`Cliente Impressão ${i + 1}`],
    valor: 800 + (i * 80),
    data: "11/01/2024",
    status: "Emitindo",
    margem: 20 + (i % 18),
    tipoEnvio: ["Shopee Xpress", "Magalu Entrega", "B2W Entrega"][i % 3],
    image: "/placeholder.svg",
    idPlataforma: `IMP${String(i + 300).padStart(6, '0')}`,
    quantidade: 1,
    itens: [
      { produto: ["Monitor 4K", "Mouse Gamer", "Teclado Mecânico"][i % 3], sku: `SKU-${i + 300}`, quantidade: 1, valor: 800 + (i * 80), image: "/placeholder.svg" }
    ],
    ...(i % 4 === 0 && {
      aiSuggestion: {
        type: "delayed_print",
        suggestion: "Impressão atrasada",
        details: "Este pedido está há mais de 24h aguardando impressão. Considere priorizar para manter o SLA."
      }
    })
  })),
  coleta: Array.from({ length: 35 }, (_, i) => ({
    id: `PED${String(i + 400).padStart(3, '0')}`,
    marketplace: ["Mercado Livre", "Amazon"][i % 2],
    produto: ["Smartphone", "Notebook"][i % 2],
    sku: [`SKU-${i + 400}`],
    cliente: [`Cliente Coleta ${i + 1}`],
    valor: 1500 + (i * 120),
    data: "10/01/2024",
    status: "Aguardando",
    margem: 16 + (i % 12),
    tipoEnvio: ["ML Envios", "Amazon Prime"][i % 2],
    image: "/placeholder.svg",
    idPlataforma: `COL${String(i + 400).padStart(6, '0')}`,
    quantidade: 1,
    itens: [
      { produto: ["Smartphone", "Notebook"][i % 2], sku: `SKU-${i + 400}`, quantidade: 1, valor: 1500 + (i * 120), image: "/placeholder.svg" }
    ]
  })),
  enviado: Array.from({ length: 35 }, (_, i) => ({
    id: `PED${String(i + 500).padStart(3, '0')}`,
    marketplace: ["Shopee", "Magazine Luiza", "Americanas", "Amazon"][i % 4],
    produto: ["Fone Bluetooth", "Carregador", "Cabo USB", "Película"][i % 4],
    sku: [`SKU-${i + 500}`],
    cliente: [`Cliente Enviado ${i + 1}`],
    valor: 50 + (i * 30),
    data: "09/01/2024",
    status: "Enviado",
    margem: 25 + (i % 20),
    tipoEnvio: ["Shopee Xpress", "Magalu Entrega", "B2W Entrega", "Amazon Prime"][i % 4],
    image: "/placeholder.svg",
    idPlataforma: `ENV${String(i + 500).padStart(6, '0')}`,
    quantidade: 1,
    itens: [
      { produto: ["Fone Bluetooth", "Carregador", "Cabo USB", "Película"][i % 4], sku: `SKU-${i + 500}`, quantidade: 1, valor: 50 + (i * 30), image: "/placeholder.svg" }
    ]
  })),
  cancelados: [
    // Pedidos cancelados
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `PED${String(i + 600).padStart(3, '0')}`,
      marketplace: ["Mercado Livre", "Shopee"][i % 2],
      produto: ["Produto Cancelado A", "Produto Cancelado B"][i % 2],
      sku: [`SKU-${i + 600}`],
      cliente: [`Cliente Cancelado ${i + 1}`],
      valor: 200 + (i * 50),
      data: "08/01/2024",
      status: "Cancelado",
      margem: 0,
      tipoEnvio: ["ML Envios", "Shopee Xpress"][i % 2],
      image: "/placeholder.svg",
      idPlataforma: `CAN${String(i + 600).padStart(6, '0')}`,
      quantidade: 1,
      itens: [
        { produto: ["Produto Cancelado A", "Produto Cancelado B"][i % 2], sku: `SKU-${i + 600}`, quantidade: 1, valor: 200 + (i * 50), image: "/placeholder.svg" }
      ]
    })),
    // Devoluções
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `PED${String(i + 700).padStart(3, '0')}`,
      marketplace: ["Amazon", "Magazine Luiza"][i % 2],
      produto: ["Produto Devolvido A", "Produto Devolvido B"][i % 2],
      sku: [`SKU-${i + 700}`],
      cliente: [`Cliente Devolução ${i + 1}`],
      valor: 300 + (i * 75),
      data: "07/01/2024",
      status: "Devolução",
      margem: -5,
      tipoEnvio: ["Amazon Prime", "Magalu Entrega"][i % 2],
      image: "/placeholder.svg",
      idPlataforma: `DEV${String(i + 700).padStart(6, '0')}`,
      quantidade: 1,
      itens: [
        { produto: ["Produto Devolvido A", "Produto Devolvido B"][i % 2], sku: `SKU-${i + 700}`, quantidade: 1, valor: 300 + (i * 75), image: "/placeholder.svg" }
      ]
    }))
  ]
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pendente":
      return <Badge className="bg-orange-500 text-white">Vincular</Badge>;
    case "Emitir":
      return <Badge className="bg-yellow-500 text-white">Emitir</Badge>;
    case "Emitindo":
      return <Badge className="bg-blue-500 text-white">Emitindo</Badge>;
    case "Falha na Emissão":
      return <Badge className="bg-red-600 text-white">Falha na Emissão</Badge>;
    case "Falha ao Enviar":
      return <Badge className="bg-red-600 text-white">Falha ao Enviar</Badge>;
    case "NF Emitida":
      return <Badge className="bg-purple-600 text-white">Impressão</Badge>;
    case "Aguardando":
      return <Badge className="bg-blue-500 text-white">Aguardando coleta</Badge>;
    case "Enviado":
      return <Badge className="bg-green-500 text-white">Enviado</Badge>;
    case "Cancelado":
      return <Badge className="bg-gray-500 text-white">Cancelado</Badge>;
    case "Devolução":
      return <Badge className="bg-red-500 text-white">Emitir devolução</Badge>;
    default:
      return <Badge variant="default">Normal</Badge>;
  }
};

export default function Pedidos() {
  const [activeStatus, setActiveStatus] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [selectedPedidosImpressao, setSelectedPedidosImpressao] = useState<string[]>([]);
  const [selectedPedidosEmissao, setSelectedPedidosEmissao] = useState<string[]>([]);
  const [selectedPedidosCancelados, setSelectedPedidosCancelados] = useState<string[]>([]);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [shippingTypeFilter, setShippingTypeFilter] = useState("all");
  const [situacaoFilter, setSituacaoFilter] = useState("all");
  const [canceladosFilter, setCanceladosFilter] = useState("all");
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllEmissao, setSelectAllEmissao] = useState(false);
  const [selectAllCancelados, setSelectAllCancelados] = useState(false);
  const [dateStartFilter, setDateStartFilter] = useState<Date | null>(null);
  const [dateEndFilter, setDateEndFilter] = useState<Date | null>(null);
  const [orderNumberFilter, setOrderNumberFilter] = useState("");
  const [vincularModalOpen, setVincularModalOpen] = useState(false);
  const [selectedPedidoVincular, setSelectedPedidoVincular] = useState(null);
  const [emissaoDrawerOpen, setEmissaoDrawerOpen] = useState(false);
  const [printConfigOpen, setPrintConfigOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const currentPedidos = mockPedidos[activeStatus] || [];
  
  let filteredPedidos = currentPedidos;
  
  // Apply date range filter
  if (dateStartFilter && dateEndFilter) {
    filteredPedidos = filteredPedidos.filter(pedido => {
      // Convert string date to Date object for comparison
      const pedidoDate = new Date(pedido.data.split('/').reverse().join('-'));
      return isWithinInterval(pedidoDate, {
        start: startOfDay(dateStartFilter),
        end: endOfDay(dateEndFilter)
      });
    });
  }
  
  // Apply other filters
  if (activeStatus === "impressao" && shippingTypeFilter !== "all") {
    filteredPedidos = filteredPedidos.filter(pedido => pedido.tipoEnvio === shippingTypeFilter);
  }
  
  if (situacaoFilter !== "all") {
    filteredPedidos = filteredPedidos.filter(pedido => pedido.status === situacaoFilter);
  }

  if (activeStatus === "cancelados" && canceladosFilter !== "all") {
    filteredPedidos = filteredPedidos.filter(pedido => {
      if (canceladosFilter === "Cancelado") {
        return pedido.status === "Cancelado";
      } else if (canceladosFilter === "Devolução") {
        return pedido.status === "Devolução";
      }
      return true;
    });
  }
  
  if (orderNumberFilter) {
    filteredPedidos = filteredPedidos.filter(pedido => 
      pedido.id.toLowerCase().includes(orderNumberFilter.toLowerCase())
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPedidos = filteredPedidos.slice(startIndex, endIndex);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getItemsDisplay = (pedido: any) => {
    if (!pedido.itens || pedido.itens.length <= 1) {
      return { count: pedido.quantidade || 1, label: "item" };
    }
    
    const totalItems = pedido.itens.reduce((total: number, item: any) => total + (item.quantidade || 1), 0);
    const uniqueProducts = pedido.itens.length;
    
    if (uniqueProducts > 1) {
      return { 
        count: totalItems, 
        label: "itens",
        detail: `(${uniqueProducts} produtos)`
      };
    }
    
    return { count: totalItems, label: totalItems > 1 ? "itens" : "item" };
  };

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    setDateStartFilter(startDate);
    setDateEndFilter(endDate);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectPedidoImpressao = (pedidoId: string, checked: boolean | string) => {
    const isChecked = checked === true;
    if (isChecked) {
      setSelectedPedidosImpressao([...selectedPedidosImpressao, pedidoId]);
    } else {
      setSelectedPedidosImpressao(selectedPedidosImpressao.filter(id => id !== pedidoId));
    }
  };

  const handleSelectPedidoEmissao = (pedidoId: string, checked: boolean | string) => {
    const isChecked = checked === true;
    if (isChecked) {
      setSelectedPedidosEmissao([...selectedPedidosEmissao, pedidoId]);
    } else {
      setSelectedPedidosEmissao(selectedPedidosEmissao.filter(id => id !== pedidoId));
    }
  };

  const handleSelectPedidoCancelado = (pedidoId: string, checked: boolean | string) => {
    const isChecked = checked === true;
    if (isChecked) {
      setSelectedPedidosCancelados([...selectedPedidosCancelados, pedidoId]);
    } else {
      setSelectedPedidosCancelados(selectedPedidosCancelados.filter(id => id !== pedidoId));
    }
  };

  const handleSelectAll = (checked: boolean | string) => {
    const isChecked = checked === true;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedPedidosImpressao(paginatedPedidos.map(pedido => pedido.id));
    } else {
      setSelectedPedidosImpressao([]);
    }
  };

  const handleSelectAllEmissao = (checked: boolean | string) => {
    const isChecked = checked === true;
    setSelectAllEmissao(isChecked);
    if (isChecked) {
      setSelectedPedidosEmissao(paginatedPedidos.map(pedido => pedido.id));
    } else {
      setSelectedPedidosEmissao([]);
    }
  };

  const handleSelectAllCancelados = (checked: boolean | string) => {
    const isChecked = checked === true;
    setSelectAllCancelados(isChecked);
    if (isChecked) {
      const devolucaoPedidos = paginatedPedidos.filter(pedido => pedido.status === "Devolução").map(pedido => pedido.id);
      setSelectedPedidosCancelados(devolucaoPedidos);
    } else {
      setSelectedPedidosCancelados([]);
    }
  };

  const handleVincularPedido = (pedido: any) => {
    setSelectedPedidoVincular(pedido);
    setVincularModalOpen(true);
  };

  const handleEmitirNF = (type: 'single' | 'selected' | 'mass') => {
    setEmissaoDrawerOpen(true);
  };

  const shippingTypes = [
    { value: "all", label: "Todos os tipos" },
    { value: "Shopee Xpress", label: "Shopee Xpress" },
    { value: "Magalu Entrega", label: "Magalu Entrega" },
    { value: "B2W Entrega", label: "B2W Entrega" },
    { value: "ML Envios", label: "ML Envios" },
    { value: "Amazon Prime", label: "Amazon Prime" }
  ];

  const situacaoOptions = {
    todos: [
      { value: "all", label: "Todas as situações" },
      { value: "Pendente", label: "Pendente" },
      { value: "Enviado", label: "Enviado" },
      { value: "Cancelado", label: "Cancelado" }
    ],
    emissao: [
      { value: "all", label: "Todas as situações" },
      { value: "Falha na emissão", label: "Falha na emissão" },
      { value: "Emitindo", label: "Emitindo" },
      { value: "Falha ao enviar", label: "Falha ao enviar" }
    ]
  };

  const canceladosOptions = [
    { value: "all", label: "Todas as situações" },
    { value: "Cancelado", label: "Cancelado" },
    { value: "Devolução", label: "Emitir devolução" }
  ];

  const itemsPerPageOptions = [
    { value: "10", label: "10 por página" },
    { value: "20", label: "20 por página" },
    { value: "50", label: "50 por página" },
    { value: "100", label: "100 por página" },
    { value: "300", label: "300 por página" }
  ];

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm">
              <SidebarTrigger className="mr-4" />
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Pedidos</h2>
                </div>
              </div>
            </header>
            
            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Gestão de Pedidos
                    </h1>
                  </div>
                </div>

                {/* Status Blocks */}
                <div className="grid grid-cols-7 gap-4 mb-8">
                  {statusBlocks.map((block) => (
                    <Card
                      key={block.id}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-0 bg-white text-gray-900 overflow-hidden relative ${
                        activeStatus === block.id ? "ring-2 ring-primary shadow-lg scale-105 bg-primary text-white" : ""
                      }`}
                      onClick={() => setActiveStatus(block.id)}
                    >
                      <CardContent className="p-6 text-center relative z-10">
                        <div className="text-3xl font-bold mb-2">{block.count}</div>
                        <div className="text-sm font-medium">{block.title}</div>
                        <div className="text-xs opacity-80 mt-1">{block.description}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Search and Actions */}
                <div className="flex items-center space-x-4 mb-6">
                  {/* Order Number Filter */}
                  <div className="relative max-w-xs">
                    <Input
                      placeholder="Número do pedido..."
                      value={orderNumberFilter}
                      onChange={(e) => setOrderNumberFilter(e.target.value)}
                      className="h-12 rounded-2xl border-0 bg-white shadow-lg ring-1 ring-gray-200/60"
                    />
                  </div>

                  {/* Enhanced Period Filter */}
                  {activeStatus === "todos" && (
                    <PeriodFilter onDateRangeChange={handleDateRangeChange} />
                  )}

                  {/* Situation Filter - for Todos and Emissao tabs */}
                  {(activeStatus === "todos" || activeStatus === "emissao") && (
                    <Select value={situacaoFilter} onValueChange={setSituacaoFilter}>
                      <SelectTrigger className="w-48 h-12 rounded-2xl border-0 bg-white shadow-lg ring-1 ring-gray-200/60">
                        <SelectValue placeholder="Situação" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg">
                        {(situacaoOptions[activeStatus] || situacaoOptions.todos).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Cancelados Filter */}
                  {activeStatus === "cancelados" && (
                    <Select value={canceladosFilter} onValueChange={setCanceladosFilter}>
                      <SelectTrigger className="w-48 h-12 rounded-2xl border-0 bg-white shadow-lg ring-1 ring-gray-200/60">
                        <SelectValue placeholder="Situação" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg">
                        {canceladosOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Export Button - for Todos tab */}
                  {activeStatus === "todos" && (
                    <Button className="h-12 px-6 rounded-2xl bg-primary shadow-lg">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Pedidos
                    </Button>
                  )}

                  {/* Shipping Type Filter - for Impressao tab */}
                  {activeStatus === "impressao" && (
                    <>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-600 mb-1">Tipo de envio</span>
                        <Select value={shippingTypeFilter} onValueChange={setShippingTypeFilter}>
                          <SelectTrigger className="w-48 h-12 rounded-2xl border-0 bg-white shadow-lg ring-1 ring-gray-200/60">
                            <SelectValue placeholder="Tipo de Envio" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-lg">
                            {shippingTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        onClick={() => setPrintConfigOpen(true)}
                        variant="outline"
                        className="h-12 px-6 rounded-2xl border-0 bg-white shadow-lg ring-1 ring-gray-200/60"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configurações
                      </Button>

                      <Button 
                        onClick={() => setScannerOpen(true)}
                        className="h-12 px-6 rounded-2xl bg-primary shadow-lg"
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        Checkout de Impressão
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className={`h-12 px-6 rounded-2xl bg-white shadow-lg transition-opacity ${
                          selectedPedidosImpressao.length === 0 ? 'opacity-50' : 'opacity-100'
                        }`}
                        disabled={selectedPedidosImpressao.length === 0}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Lista de Separação ({selectedPedidosImpressao.length})
                      </Button>
                    </>
                  )}
                  
                  {/* Emissao NF Actions */}
                  {activeStatus === "emissao" && (
                    <>
                      <Button 
                        className={`h-12 px-6 rounded-2xl bg-primary shadow-lg transition-opacity ${
                          selectedPedidosEmissao.length === 0 ? 'opacity-50' : 'opacity-100'
                        }`}
                        disabled={selectedPedidosEmissao.length === 0}
                        onClick={() => handleEmitirNF('selected')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Emitir Selecionados ({selectedPedidosEmissao.length})
                      </Button>
                      
                      <Button 
                        className="h-12 px-6 rounded-2xl bg-primary shadow-lg"
                        onClick={() => handleEmitirNF('mass')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Emissão em Massa
                      </Button>
                    </>
                  )}

                  {/* Cancelados Actions */}
                  {activeStatus === "cancelados" && (
                    <Button 
                      className={`h-12 px-6 rounded-2xl bg-primary shadow-lg transition-opacity ${
                        selectedPedidosCancelados.length === 0 ? 'opacity-50' : 'opacity-100'
                      }`}
                      disabled={selectedPedidosCancelados.length === 0}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Emitir Devoluções ({selectedPedidosCancelados.length})
                    </Button>
                  )}
                </div>

                {/* Pedidos List */}
                <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                  <CardContent className="p-0">
                    {/* Table Headers - Fixed alignment */}
                    <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {(activeStatus === "impressao" || activeStatus === "emissao" || 
                          (activeStatus === "cancelados" && canceladosFilter === "Devolução")) && (
                          <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                            
                          </div>
                        )}
                        <div className={`${(activeStatus === "impressao" || activeStatus === "emissao" || 
                          (activeStatus === "cancelados" && canceladosFilter === "Devolução")) ? 'col-span-2' : 'col-span-2'} text-xs font-semibold text-gray-600 uppercase tracking-wide`}>
                          ID Pedido
                        </div>
                        <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Produto
                        </div>
                        <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                          Itens
                        </div>
                        <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wide text-right">
                          Valor Pedido
                        </div>
                        <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                          Tipo Envio
                        </div>
                        <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                          Marketplace
                        </div>
                        <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                          ID Plataforma
                        </div>
                        <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                          Ações
                        </div>
                      </div>
                    </div>

                    {/* Select All Row */}
                    {(activeStatus === "impressao" || activeStatus === "emissao" || 
                      (activeStatus === "cancelados" && canceladosFilter === "Devolução")) && (
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center space-x-4">
                          <Checkbox
                            checked={activeStatus === "impressao" ? selectAll : activeStatus === "emissao" ? selectAllEmissao : selectAllCancelados}
                            onCheckedChange={activeStatus === "impressao" ? handleSelectAll : activeStatus === "emissao" ? handleSelectAllEmissao : handleSelectAllCancelados}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Selecionar todos{activeStatus === "cancelados" ? " para devolução" : ""}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-0">
                      {paginatedPedidos.map((pedido) => {
                        const itemsDisplay = getItemsDisplay(pedido);
                        return (
                          <div key={pedido.id}>
                            <div className="px-6 py-4 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-0">
                              <div className="grid grid-cols-12 gap-4 items-center">
                                {(activeStatus === "impressao" || activeStatus === "emissao" || 
                                  (activeStatus === "cancelados" && pedido.status === "Devolução")) && (
                                  <div className="col-span-1 flex justify-center">
                                    <Checkbox
                                      checked={activeStatus === "impressao" 
                                        ? selectedPedidosImpressao.includes(pedido.id)
                                        : activeStatus === "emissao"
                                        ? selectedPedidosEmissao.includes(pedido.id)
                                        : selectedPedidosCancelados.includes(pedido.id)
                                      }
                                      onCheckedChange={(checked) => 
                                        activeStatus === "impressao" 
                                          ? handleSelectPedidoImpressao(pedido.id, checked)
                                          : activeStatus === "emissao"
                                          ? handleSelectPedidoEmissao(pedido.id, checked)
                                          : handleSelectPedidoCancelado(pedido.id, checked)
                                      }
                                    />
                                  </div>
                                )}
                                
                                {/* ID do Pedido com Badge de Status */}
                                <div className={`${(activeStatus === "impressao" || activeStatus === "emissao" || 
                                  (activeStatus === "cancelados" && pedido.status === "Devolução")) ? 'col-span-2' : 'col-span-2'}`}>
                                  <div className="flex flex-col space-y-2">
                                    {getStatusBadge(pedido.status)}
                                    <div className="flex items-center space-x-2">
                                      <h3 className="text-sm font-bold text-gray-900">{pedido.id}</h3>
                                      {pedido.aiSuggestion && (
                                        <div className="flex-shrink-0">
                                          <AIIndicator
                                            type={pedido.aiSuggestion.type}
                                            suggestion={pedido.aiSuggestion.suggestion}
                                            details={pedido.aiSuggestion.details}
                                          />
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500">{pedido.data}</p>
                                  </div>
                                </div>

                                {/* Products Section - Enhanced for multiple items */}
                                <div className="col-span-3">
                                  {pedido.itens && pedido.itens.length > 0 ? (
                                    <div className="space-y-3">
                                      {pedido.itens.slice(0, 2).map((item: any, index: number) => (
                                        <div key={index} className="flex items-center space-x-3">
                                          <img
                                            src={item.image || "/placeholder.svg"}
                                            alt={item.produto}
                                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                                          />
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 font-medium truncate">{item.produto}</p>
                                            <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                                            {item.variacao && (
                                              <p className="text-xs text-purple-600 font-medium">{item.variacao}</p>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                      {pedido.itens.length > 2 && (
                                        <p className="text-xs text-gray-500 ml-13">+{pedido.itens.length - 2} mais itens</p>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={pedido.image}
                                        alt={pedido.produto}
                                        className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 font-medium truncate">{pedido.produto}</p>
                                        <p className="text-xs text-gray-500">SKU: {pedido.sku}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Quantidade with Purple Indicator */}
                                <div className="col-span-1 text-center">
                                  <div className="flex items-center justify-center space-x-1">
                                    <p className={`text-sm font-medium ${itemsDisplay.count > 1 ? 'text-purple-600' : 'text-gray-900'}`}>
                                      {itemsDisplay.count}
                                    </p>
                                    {itemsDisplay.count > 1 && (
                                      <div className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center">
                                        <span className="text-xs text-white font-bold">x</span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500">{itemsDisplay.label}</p>
                                  {itemsDisplay.detail && (
                                    <p className="text-xs text-purple-600">{itemsDisplay.detail}</p>
                                  )}
                                </div>
                                
                                {/* Valor Total */}
                                <div className="col-span-1 text-right">
                                  <p className="text-lg font-bold text-gray-900">{formatCurrency(pedido.valor)}</p>
                                </div>
                                
                                {/* Tipo Envio */}
                                <div className="col-span-1 text-center">
                                  <Badge className="bg-primary text-primary-foreground border-0">
                                    {pedido.tipoEnvio}
                                  </Badge>
                                </div>
                                
                                {/* Marketplace */}
                                <div className="col-span-1 text-center">
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    {pedido.marketplace}
                                  </Badge>
                                </div>
                                
                                {/* ID Plataforma */}
                                <div className="col-span-1 text-center">
                                  <p className="text-xs font-mono text-gray-600">{pedido.idPlataforma}</p>
                                </div>
                                
                                {/* Actions */}
                                <div className="col-span-1 flex items-center justify-center space-x-2">
                                  <Drawer>
                                    <DrawerTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-2xl border-0 bg-white shadow-md ring-1 ring-gray-200/60 hover:shadow-lg transition-all"
                                        onClick={() => setSelectedPedido(pedido)}
                                      >
                                        Detalhes
                                      </Button>
                                    </DrawerTrigger>
                                    <DrawerContent className="bg-white w-[45%]">
                                      <DrawerHeader>
                                        <DrawerTitle className="text-2xl">Detalhes do Pedido {pedido.id}</DrawerTitle>
                                        <DrawerDescription>
                                          Informações completas e detalhamento financeiro
                                        </DrawerDescription>
                                      </DrawerHeader>
                                      <div className="p-6 overflow-y-auto max-h-[80vh]">
                                        <PedidoDetails pedido={pedido} />
                                      </div>
                                    </DrawerContent>
                                  </Drawer>
                                  
                                  {activeStatus === "impressao" && (
                                    <Button size="sm" variant="outline" className="rounded-2xl">
                                      <Printer className="w-4 h-4 mr-1" />
                                      Etiqueta
                                    </Button>
                                  )}
                                  
                                  {activeStatus === "vincular" && (
                                    <Button 
                                      size="sm" 
                                      className="rounded-2xl bg-primary shadow-lg"
                                      onClick={() => handleVincularPedido(pedido)}
                                    >
                                      Vincular
                                    </Button>
                                  )}

                                  {activeStatus === "emissao" && (
                                    <Button 
                                      size="sm" 
                                      className="rounded-2xl bg-primary shadow-lg"
                                      onClick={() => handleEmitirNF('single')}
                                    >
                                      Emitir NF
                                    </Button>
                                  )}

                                  {activeStatus === "cancelados" && pedido.status === "Devolução" && (
                                    <Button 
                                      size="sm" 
                                      className="rounded-2xl bg-primary shadow-lg"
                                    >
                                      Emitir NF-e Devolução
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-6 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Itens por página:</span>
                        <Select 
                          value={itemsPerPage.toString()} 
                          onValueChange={(value) => {
                            setItemsPerPage(parseInt(value));
                            setCurrentPage(1);
                          }}
                        >
                          <SelectTrigger className="w-40 h-10 rounded-xl border bg-white shadow-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-lg">
                            {itemsPerPageOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-gray-600">
                          Página {currentPage} de {totalPages}
                        </span>
                      </div>

                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) setCurrentPage(currentPage - 1);
                              }}
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNumber = i + 1;
                            return (
                              <PaginationItem key={pageNumber}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(pageNumber);
                                  }}
                                  isActive={currentPage === pageNumber}
                                >
                                  {pageNumber}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}
                          
                          {totalPages > 5 && <PaginationEllipsis />}
                          
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                              }}
                              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </div>

        <ScannerModal open={scannerOpen} onOpenChange={setScannerOpen} />
        <VincularPedidoModal 
          open={vincularModalOpen} 
          onOpenChange={setVincularModalOpen}
          pedido={selectedPedidoVincular}
        />
        <EmissaoNFDrawer 
          open={emissaoDrawerOpen} 
          onOpenChange={setEmissaoDrawerOpen}
        />
        <PrintConfigModal 
          open={printConfigOpen} 
          onOpenChange={setPrintConfigOpen}
        />
      </SidebarProvider>
    </TooltipProvider>
  );
}
