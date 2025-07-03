import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ShoppingCart, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SuccessModal } from "@/components/recursos/SuccessModal";
import { ProductGrid } from "@/components/recursos/ProductGrid";
import { CategoryFilter } from "@/components/recursos/CategoryFilter";
import { CartDrawer } from "@/components/recursos/CartDrawer";
import { PurchasesTab } from "@/components/recursos/PurchasesTab";

const categorias = [
  { id: "fitas", nome: "Fitas", count: 24 },
  { id: "embalagens", nome: "Embalagens", count: 45 },
  { id: "impressoras", nome: "Impressoras", count: 12 },
  { id: "etiquetas", nome: "Etiquetas", count: 18 },
];

const produtos = {
  fitas: [
    { id: 1, nome: "Fita Adesiva Transparente 48mm", preco: 12.90, categoria: "fitas", image: "/placeholder.svg", descricao: "Fita transparente 48mm x 100m", estoque: 50 },
    { id: 2, nome: "Fita Dupla Face 12mm", preco: 8.50, categoria: "fitas", image: "/placeholder.svg", descricao: "Fita dupla face 12mm x 30m", estoque: 30 },
    { id: 3, nome: "Fita Kraft 48mm", preco: 15.90, categoria: "fitas", image: "/placeholder.svg", descricao: "Fita kraft marrom 48mm x 50m", estoque: 25 },
    { id: 4, nome: "Fita de Segurança VOID", preco: 25.90, categoria: "fitas", image: "/placeholder.svg", descricao: "Fita de segurança 48mm x 50m", estoque: 15 },
  ],
  embalagens: [
    { id: 5, nome: "Envelope Plástico 26x36cm", preco: 0.45, categoria: "embalagens", image: "/placeholder.svg", descricao: "Envelope plástico com aba adesiva", estoque: 1000 },
    { id: 6, nome: "Caixa de Papelão 16x11x6cm", preco: 1.20, categoria: "embalagens", image: "/placeholder.svg", descricao: "Caixa de papelão ondulado", estoque: 500 },
    { id: 7, nome: "Envelope Kraft 19x25cm", preco: 0.35, categoria: "embalagens", image: "/placeholder.svg", descricao: "Envelope kraft com bolha", estoque: 800 },
    { id: 8, nome: "Caixa de Papelão 27x18x9cm", preco: 2.10, categoria: "embalagens", image: "/placeholder.svg", descricao: "Caixa média para envios", estoque: 300 },
  ],
  impressoras: [
    { id: 9, nome: "Zebra GK420T", preco: 1299.99, categoria: "impressoras", image: "/placeholder.svg", descricao: "Impressora térmica de etiquetas", estoque: 5 },
    { id: 10, nome: "Zebra ZD230", preco: 899.99, categoria: "impressoras", image: "/placeholder.svg", descricao: "Impressora térmica direta", estoque: 8 },
    { id: 11, nome: "Zebra GC420T", preco: 1150.00, categoria: "impressoras", image: "/placeholder.svg", descricao: "Impressora térmica compacta", estoque: 3 },
    { id: 12, nome: "Zebra ZD421", preco: 1599.99, categoria: "impressoras", image: "/placeholder.svg", descricao: "Impressora térmica avançada", estoque: 4 },
  ],
  etiquetas: [
    { id: 13, nome: "Etiqueta Térmica 100x50mm", preco: 35.90, categoria: "etiquetas", image: "/placeholder.svg", descricao: "Rolo com 1000 etiquetas", estoque: 100 },
    { id: 14, nome: "Etiqueta Adesiva 60x40mm", preco: 22.50, categoria: "etiquetas", image: "/placeholder.svg", descricao: "Etiquetas brancas adesivas", estoque: 150 },
    { id: 15, nome: "Etiqueta Código de Barras", preco: 45.00, categoria: "etiquetas", image: "/placeholder.svg", descricao: "Etiquetas para código de barras", estoque: 80 },
    { id: 16, nome: "Etiqueta Térmica 80x60mm", preco: 28.90, categoria: "etiquetas", image: "/placeholder.svg", descricao: "Rolo com 500 etiquetas", estoque: 120 },
  ],
};

const comprasRealizadas = [
  {
    id: 1,
    produto: "Fita Adesiva Transparente 48mm",
    quantidade: 50,
    status: "Entregue",
    loja: "Embalagens Express",
    dataCompra: "2024-01-15",
    valor: 645.00,
    image: "/placeholder.svg"
  },
  {
    id: 2,
    produto: "Envelope Plástico 26x36cm",
    quantidade: 500,
    status: "Em Trânsito",
    loja: "Plásticos & Cia",
    dataCompra: "2024-01-18",
    valor: 225.00,
    image: "/placeholder.svg"
  },
  {
    id: 3,
    produto: "Zebra GK420T",
    quantidade: 2,
    status: "Processando",
    loja: "Tech Printers",
    dataCompra: "2024-01-20",
    valor: 2599.98,
    image: "/placeholder.svg"
  },
];

const enderecos = [
  {
    id: "endereco1",
    tipo: "Escritório Principal",
    endereco: "Rua das Flores, 123 - Centro",
    cidade: "São Paulo, SP - 01234-567"
  },
  {
    id: "endereco2",
    tipo: "Depósito",
    endereco: "Av. Industrial, 500 - Distrito Industrial",
    cidade: "São Paulo, SP - 08500-000"
  }
];

const meiosPagamento = [
  { id: "pix", nome: "PIX", ativo: true },
  { id: "cartao", nome: "Cartão Corporativo", ativo: true },
  { id: "boleto", nome: "Boleto Bancário", ativo: true },
];

const RecursosSeller = () => {
  const [categoriaAtiva, setCategoriaAtiva] = useState("fitas");
  const [searchTerm, setSearchTerm] = useState("");
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [carrinhoOpen, setCarrinhoOpen] = useState(false);
  const [stepAtual, setStepAtual] = useState(0);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState("endereco1");
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState("pix");
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const produtosCategoria = produtos[categoriaAtiva] || [];
  
  const filteredProducts = produtosCategoria.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adicionarAoCarrinho = (produto: any) => {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    if (itemExistente) {
      setCarrinho(carrinho.map(item => 
        item.id === produto.id 
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  };

  const updateQuantidade = (id: number, delta: number) => {
    setCarrinho(carrinho.map(item => 
      item.id === id 
        ? { ...item, quantidade: Math.max(1, item.quantidade + delta) }
        : item
    ).filter(item => item.quantidade > 0));
  };

  const finalizarCompra = () => {
    setSuccessModalOpen(true);
    setCarrinhoOpen(false);
    setCarrinho([]);
    setStepAtual(0);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ShoppingBag className="w-6 h-6 text-novura-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Recursos Seller</h2>
              </div>
              <Button 
                onClick={() => setCarrinhoOpen(true)}
                className="relative bg-novura-primary hover:bg-novura-primary/90"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrinho
                {carrinho.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 text-xs">
                    {carrinho.reduce((sum, item) => sum + item.quantidade, 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <Tabs defaultValue="produtos" className="w-full h-full">
              <div className="bg-white px-6 py-4 border-b">
                <TabsList className="grid w-fit grid-cols-2">
                  <TabsTrigger value="produtos" className="px-6">Produtos</TabsTrigger>
                  <TabsTrigger value="compras" className="px-6">Minhas Compras</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="produtos" className="p-6 space-y-6">
                {/* Search Bar */}
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Categories */}
                <CategoryFilter
                  categories={categorias}
                  activeCategory={categoriaAtiva}
                  onCategoryChange={setCategoriaAtiva}
                />

                {/* Products Grid */}
                <ProductGrid
                  products={filteredProducts}
                  onAddToCart={adicionarAoCarrinho}
                />
              </TabsContent>

              <TabsContent value="compras" className="p-6">
                <PurchasesTab purchases={comprasRealizadas} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        open={carrinhoOpen}
        onOpenChange={setCarrinhoOpen}
        cartItems={carrinho}
        currentStep={stepAtual}
        addresses={enderecos}
        paymentMethods={meiosPagamento}
        selectedAddress={enderecoSelecionado}
        selectedPayment={pagamentoSelecionado}
        onStepChange={setStepAtual}
        onUpdateQuantity={updateQuantidade}
        onAddressChange={setEnderecoSelecionado}
        onPaymentChange={setPagamentoSelecionado}
        onFinalizePurchase={finalizarCompra}
      />

      <SuccessModal open={successModalOpen} onOpenChange={setSuccessModalOpen} />
    </SidebarProvider>
  );
};

export default RecursosSeller;
