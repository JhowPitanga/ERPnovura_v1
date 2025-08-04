import { useState, useEffect } from "react";
import { Search, Filter, Settings, FileText, Printer, Bot, TrendingUp, Zap, QrCode, Check, Calendar, Download, X, ChevronDown, ChevronUp } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
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
import { NfeEmitirLista } from "@/components/pedidos/NfeEmitirLista";
import { ImpressaoLista } from "@/components/pedidos/ImpressaoLista";
import { AIIndicator } from "@/components/equipe/AIIndicator";
import { format } from "date-fns";
import { generateEtiqueta } from "@/utils/generateEtiqueta"; // Importar a função de simulação de impressão

const mockPedidosData = {
    todos: [
        { id: "PED001", marketplace: "Mercado Livre", produto: "iPhone 15 Pro Max 256GB", sku: "IPH15PM-256", cliente: "João Silva Santos", valor: 8999.99, data: "15/01/2024", status: "Pendente", tipoEnvio: "ML Envios", idPlataforma: "MLB123456789", quantidade: 1, itens: [{ produto: "iPhone 15 Pro Max 256GB", sku: "IPH15PM-256", quantidade: 1, valor: 8999.99 }], nfe_data: null, aiSuggestion: { type: "high_margin", suggestion: "Margem alta detectada", details: "" } },
        { id: "PED002", marketplace: "Amazon", produto: "MacBook Air M3 16GB 512GB", sku: "MBA-M3-512", cliente: "Maria Santos Costa", valor: 12999.99, data: "15/01/2024", status: "Pendente", tipoEnvio: "Amazon Prime", idPlataforma: "AMZ987654321", quantidade: 2, itens: [{ produto: "MacBook Air M3 16GB 512GB", sku: "MBA-M3-512", quantidade: 1, valor: 12999.99 }, { produto: "Mouse Magic Mouse", sku: "MM-001", quantidade: 1, valor: 599.99 }], nfe_data: null, aiSuggestion: { type: "low_stock", suggestion: "Estoque baixo detectado", details: "" } },
        { id: "PED003", marketplace: "Shopee", produto: "Samsung Galaxy S24 Ultra", sku: "SGS24U-256", cliente: "Carlos Oliveira", valor: 6999.99, data: "14/01/2024", status: "Emissao NF", tipoEnvio: "Shopee Xpress", idPlataforma: "SHP789123456", quantidade: 1, itens: [{ produto: "Samsung Galaxy S24 Ultra", sku: "SGS24U-256", quantidade: 1, valor: 6999.99 }], nfe_data: null },
        { id: "PED004", marketplace: "Magazine Luiza", produto: "Nintendo Switch OLED", sku: "NSW-OLED", cliente: "Ana Paula Lima", valor: 2299.99, data: "14/01/2024", status: "NF Emitida", tipoEnvio: "Magalu Entrega", idPlataforma: "MAG456789123", quantidade: 1, itens: [{ produto: "Nintendo Switch OLED", sku: "NSW-OLED", quantidade: 1, valor: 2299.99 }], nfe_data: { nfe_number: "000123", nfe_key: "1234..." } },
        { id: "PED005", marketplace: "Americanas", produto: "iPad Air 5ª Geração", sku: "IPAD-AIR5", cliente: "Roberto Ferreira", valor: 4199.99, data: "13/01/2024", status: "Aguardando Coleta", tipoEnvio: "B2W Entrega", idPlataforma: "AME321654987", quantidade: 1, itens: [{ produto: "iPad Air 5ª Geração", sku: "IPAD-AIR5", quantidade: 1, valor: 4199.99 }], nfe_data: { nfe_number: "000124", nfe_key: "1234..." } },
        { id: "PED006", marketplace: "Shopee", produto: "Fone Bluetooth", sku: "FB-001", cliente: "Mariana Costa", valor: 150.00, data: "12/01/2024", status: "Enviado", tipoEnvio: "Shopee Xpress", idPlataforma: "SHP999888777", quantidade: 1, itens: [{ produto: "Fone Bluetooth", sku: "FB-001", quantidade: 1, valor: 150.00 }], nfe_data: { nfe_number: "000125", nfe_key: "1234..." } },
    ],
    vincular: [
        { id: "PED001", marketplace: "Mercado Livre", produto: "iPhone 15 Pro Max 256GB", sku: "IPH15PM-256", cliente: "João Silva Santos", valor: 8999.99, data: "15/01/2024", status: "Pendente", tipoEnvio: "ML Envios", idPlataforma: "MLB123456789", quantidade: 1, itens: [{ produto: "iPhone 15 Pro Max 256GB", sku: "IPH15PM-256", quantidade: 1, valor: 8999.99 }], nfe_data: null, aiSuggestion: { type: "high_margin", suggestion: "Margem alta detectada", details: "" } },
        { id: "PED002", marketplace: "Amazon", produto: "MacBook Air M3 16GB 512GB", sku: "MBA-M3-512", cliente: "Maria Santos Costa", valor: 12999.99, data: "15/01/2024", status: "Pendente", tipoEnvio: "Amazon Prime", idPlataforma: "AMZ987654321", quantidade: 2, itens: [{ produto: "MacBook Air M3 16GB 512GB", sku: "MBA-M3-512", quantidade: 1, valor: 12999.99 }, { produto: "Mouse Magic Mouse", sku: "MM-001", quantidade: 1, valor: 599.99 }], nfe_data: null, aiSuggestion: { type: "low_stock", suggestion: "Estoque baixo detectado", details: "" } },
    ],
    emissao: [
        { id: "PED003", marketplace: "Shopee", produto: "Samsung Galaxy S24 Ultra", sku: "SGS24U-256", cliente: "Carlos Oliveira", valor: 6999.99, data: "14/01/2024", status: "Emissao NF", tipoEnvio: "Shopee Xpress", idPlataforma: "SHP789123456", quantidade: 1, itens: [{ produto: "Samsung Galaxy S24 Ultra", sku: "SGS24U-256", quantidade: 1, valor: 6999.99 }], nfe_data: null },
    ],
    impressao: [
        { id: "PED004", marketplace: "Magazine Luiza", produto: "Nintendo Switch OLED", sku: "NSW-OLED", cliente: "Ana Paula Lima", valor: 2299.99, data: "14/01/2024", status: "NF Emitida", tipoEnvio: "Magalu Entrega", idPlataforma: "MAG456789123", quantidade: 1, itens: [{ produto: "Nintendo Switch OLED", sku: "NSW-OLED", quantidade: 1, valor: 2299.99 }], nfe_data: { nfe_number: "000123", nfe_key: "123456789012345678901234567890123456789012", nfe_xml_url: "url_do_xml" } },
        { id: "PED005", marketplace: "Americanas", produto: "iPad Air 5ª Geração", sku: "IPAD-AIR5", cliente: "Roberto Ferreira", valor: 4199.99, data: "13/01/2024", status: "NF Emitida", tipoEnvio: "B2W Entrega", idPlataforma: "AME321654987", quantidade: 1, itens: [{ produto: "iPad Air 5ª Geração", sku: "IPAD-AIR5", quantidade: 1, valor: 4199.99 }], nfe_data: { nfe_number: "000124", nfe_key: "123456789012345678901234567890123456789012", nfe_xml_url: "url_do_xml" } },
    ],
    coleta: [
        { id: "PED005", marketplace: "Americanas", produto: "iPad Air 5ª Geração", sku: "IPAD-AIR5", cliente: "Roberto Ferreira", valor: 4199.99, data: "13/01/2024", status: "Aguardando Coleta", tipoEnvio: "B2W Entrega", idPlataforma: "AME321654987", quantidade: 1, itens: [{ produto: "iPad Air 5ª Geração", sku: "IPAD-AIR5", quantidade: 1, valor: 4199.99 }], nfe_data: { nfe_number: "000124", nfe_key: "123456789012345678901234567890123456789012", nfe_xml_url: "url_do_xml" } },
    ],
    enviado: [
        { id: "PED006", marketplace: "Shopee", produto: "Fone Bluetooth", sku: "FB-001", cliente: "Mariana Costa", valor: 150.00, data: "12/01/2024", status: "Enviado", tipoEnvio: "Shopee Xpress", idPlataforma: "SHP999888777", quantidade: 1, itens: [{ produto: "Fone Bluetooth", sku: "FB-001", quantidade: 1, valor: 150.00 }], nfe_data: { nfe_number: "000125", nfe_key: "123456789012345678901234567890123456789012", nfe_xml_url: "url_do_xml" } },
    ],
    cancelados: [
        { id: "PED007", marketplace: "Mercado Livre", produto: "Produto Cancelado", sku: "PC-001", cliente: "Cliente Cancelado", valor: 200.00, data: "08/01/2024", status: "Cancelado", tipoEnvio: "ML Envios", idPlataforma: "CAN123456789", quantidade: 1, itens: [{ produto: "Produto Cancelado", sku: "PC-001", quantidade: 1, valor: 200.00 }], nfe_data: null },
        { id: "PED008", marketplace: "Amazon", produto: "Produto Devolvido", sku: "PD-001", cliente: "Cliente Devolução", valor: 300.00, data: "07/01/2024", status: "Devolução", tipoEnvio: "Amazon Prime", idPlataforma: "DEV987654321", quantidade: 1, itens: [{ produto: "Produto Devolvido", sku: "PD-001", quantidade: 1, valor: 300.00 }], nfe_data: null },
    ]
};

// ...

const [selectedPedido, setSelectedPedido] = useState<any>(null);
const [selectedPedidosImpressao, setSelectedPedidosImpressao] = useState<string[]>([]);
const [selectedPedidosEmissao, setSelectedPedidosEmissao] = useState<string[]>([]);
const [selectedPedidosCancelados, setSelectedPedidosCancelados] = useState<string[]>([]);
const [scannerOpen, setScannerOpen] = useState(false);
const [shippingTypeFilter, setShippingTypeFilter] = useState("all");
const [dateRange, setDateRange] = useState<Date | undefined>(undefined);
const [orderNumberFilter, setOrderNumberFilter] = useState("");
const [vincularModalOpen, setVincularModalOpen] = useState(false);
const [selectedPedidoVincular, setSelectedPedidoVincular] = useState(null);
const [emissaoDrawerOpen, setEmissaoDrawerOpen] = useState(false);
const [emissaoPedidoId, setEmissaoPedidoId] = useState<string | null>(null); // NOVO estado para o ID do pedido na emissão
const [printConfigOpen, setPrintConfigOpen] = useState(false);
const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
const [itemsPerPage, setItemsPerPage] = useState(10);
const [currentPage, setCurrentPage] = useState(1);

// ...

const handleEmitirNF = (type: 'single' | 'selected' | 'mass', pedidoId?: string) => {
    if (type === 'single' && pedidoId) {
        setPedidoIdParaEmissao(pedidoId);
        setEmissaoDrawerOpen(true);
    } else {
        // Lógica para emissão em massa / selecionados (futuro)
        // Por enquanto, apenas abre o drawer
        setPedidoIdParaEmissao(pedidoId); // Mantenha o ID do último clicado para testar
        setEmissaoDrawerOpen(true);
    }
};

const handlePrintEtiqueta = (pedidoId: string) => {
    setPedidoIdParaImpressao(pedidoId); // Adicione um novo estado para o ID na impressão
    // O restante da lógica de impressão virá aqui
};

// ...

return (
    <TooltipProvider>
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
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
                    <main className="flex-1 overflow-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Gestão de Pedidos
                                    </h1>
                                </div>
                            </div>
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
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="relative max-w-xs">
                                    <Input
                                        placeholder="Número do pedido..."
                                        value={orderNumberFilter}
                                        onChange={(e) => setOrderNumberFilter(e.target.value)}
                                        className="h-12 rounded-2xl border-0 bg-white shadow-lg ring-1 ring-gray-200/60"
                                    />
                                </div>
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
                                {activeStatus === "todos" && (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="h-12 px-6 rounded-2xl border-0 bg-white shadow-lg ring-1 ring-gray-200/60"
                                            >
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {dateRange ? format(dateRange, "dd/MM/yyyy") : "Período"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-white border shadow-lg" align="start">
                                            <CalendarComponent
                                                mode="single"
                                                selected={dateRange}
                                                onSelect={setDateRange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                                {activeStatus === "todos" && (
                                    <Button className="h-12 px-6 rounded-2xl bg-primary shadow-lg">
                                        <Download className="w-4 h-4 mr-2" />
                                        Exportar Pedidos
                                    </Button>
                                )}
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