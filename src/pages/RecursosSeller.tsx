import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, CreditCard, MapPin, Plus, Minus, ShoppingCart, ArrowLeft, ArrowRight, Search, MessageSquare, Truck, Package, Printer } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { SuccessModal } from "@/components/recursos/SuccessModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState("");

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

  const totalCarrinho = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

  const finalizarCompra = () => {
    setSuccessModalOpen(true);
    setCarrinhoOpen(false);
    setCarrinho([]);
    setStepAtual(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Entregue": return "bg-green-100 text-green-800";
      case "Em Trânsito": return "bg-blue-100 text-blue-800";
      case "Processando": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const steps = ["Produtos", "Endereço", "Pagamento"];

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
                <div className="flex space-x-1">
                  {categorias.map((categoria) => (
                    <button
                      key={categoria.id}
                      onClick={() => setCategoriaAtiva(categoria.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        categoriaAtiva === categoria.id
                          ? "bg-novura-primary text-white" 
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {categoria.nome} ({categoria.count})
                    </button>
                  ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((produto) => (
                    <Card key={produto.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={produto.image} 
                          alt={produto.nome}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{produto.nome}</CardTitle>
                        <CardDescription>{produto.descricao}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold text-novura-primary">
                            R$ {produto.preco.toFixed(2)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {produto.estoque} un.
                          </Badge>
                        </div>
                        <Button 
                          onClick={() => adicionarAoCarrinho(produto)}
                          size="sm"
                          className="w-full bg-novura-primary hover:bg-novura-primary/90"
                          disabled={produto.estoque === 0}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {produto.estoque > 0 ? "Adicionar" : "Sem Estoque"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="compras" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Minhas Compras</h3>
                  
                  <div className="space-y-4">
                    {comprasRealizadas.map((compra) => (
                      <Card key={compra.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={compra.image} 
                              alt={compra.produto}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            
                            <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                              <div>
                                <h4 className="font-semibold">{compra.produto}</h4>
                                <p className="text-sm text-gray-600">Pedido #{compra.id}</p>
                              </div>
                              
                              <div className="text-center">
                                <p className="font-medium">{compra.quantidade}</p>
                                <p className="text-sm text-gray-600">Quantidade</p>
                              </div>
                              
                              <div className="text-center">
                                <Badge 
                                  className={`${getStatusColor(compra.status)} cursor-pointer`}
                                  onClick={() => compra.status === "Em Trânsito" && setIsTrackingOpen(true)}
                                >
                                  {compra.status}
                                </Badge>
                              </div>
                              
                              <div>
                                <p className="font-semibold">{compra.loja}</p>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => {
                                    setSelectedStore(compra.loja);
                                    setIsChatOpen(true);
                                  }}
                                  className="p-0 h-auto text-blue-600 hover:text-blue-800"
                                >
                                  <MessageSquare className="w-3 h-3 mr-1" />
                                  Mensagem
                                </Button>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-lg font-bold text-novura-primary">
                                  R$ {compra.valor.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-600">{compra.dataCompra}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Carrinho Drawer */}
      <Drawer open={carrinhoOpen} onOpenChange={setCarrinhoOpen} direction="right">
        <DrawerContent className="h-full w-[500px] fixed right-0">
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center justify-between">
              <span>Carrinho de Compras</span>
              <div className="flex items-center space-x-2">
                {stepAtual > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setStepAtual(stepAtual - 1)}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                <div className="flex space-x-2">
                  {steps.map((step, index) => (
                    <div
                      key={step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === stepAtual 
                          ? "bg-novura-primary text-white" 
                          : index < stepAtual 
                            ? "bg-green-500 text-white" 
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 p-6 overflow-y-auto">
            
            {stepAtual === 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Produtos no Carrinho</h3>
                {carrinho.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">Carrinho vazio</p>
                ) : (
                  carrinho.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.nome}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.nome}</h4>
                        <p className="text-sm text-gray-600">R$ {item.preco.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateQuantidade(item.id, -1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantidade}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateQuantidade(item.id, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {stepAtual === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Endereço de Entrega
                </h3>
                <div className="space-y-3">
                  {enderecos.map((endereco) => (
                    <label key={endereco.id} className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="endereco" 
                        value={endereco.id}
                        checked={enderecoSelecionado === endereco.id}
                        onChange={(e) => setEnderecoSelecionado(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium">{endereco.tipo}</p>
                        <p className="text-sm text-gray-600">{endereco.endereco}</p>
                        <p className="text-sm text-gray-600">{endereco.cidade}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {stepAtual === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Meio de Pagamento
                </h3>
                <div className="space-y-3">
                  {meiosPagamento.map((meio) => (
                    <label key={meio.id} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <input 
                          type="radio" 
                          name="pagamento" 
                          value={meio.id} 
                          disabled={!meio.ativo}
                          checked={pagamentoSelecionado === meio.id}
                          onChange={(e) => setPagamentoSelecionado(e.target.value)}
                        />
                        <span className={meio.ativo ? "text-gray-900" : "text-gray-400"}>
                          {meio.nome}
                        </span>
                      </div>
                      <Badge variant={meio.ativo ? "default" : "outline"}>
                        {meio.ativo ? "Disponível" : "Indisponível"}
                      </Badge>
                    </label>
                  ))}
                </div>

                <div className="border-t pt-4 mt-6">
                  <h4 className="font-semibold mb-3">Resumo do Pedido</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>R$ {totalCarrinho.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frete</span>
                      <span>R$ 25,90</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>R$ {(totalCarrinho + 25.90).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-6">
            {stepAtual < 2 ? (
              <Button 
                onClick={() => setStepAtual(stepAtual + 1)}
                className="w-full bg-novura-primary hover:bg-novura-primary/90"
                disabled={carrinho.length === 0}
              >
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={finalizarCompra}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Finalizar Compra
              </Button>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Tracking Drawer */}
      <Drawer open={isTrackingOpen} onOpenChange={setIsTrackingOpen} direction="right">
        <DrawerContent className="h-full w-[400px] fixed right-0">
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Status do Pedido
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-green-600">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <div>
                  <p className="font-medium">Pedido confirmado</p>
                  <p className="text-xs text-gray-600">18/01/2024 - 14:30</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-green-600">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <div>
                  <p className="font-medium">Saiu para entrega</p>
                  <p className="text-xs text-gray-600">19/01/2024 - 08:15</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-blue-600">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-medium">Em trânsito</p>
                  <p className="text-xs text-gray-600">Previsão: 22/01/2024</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-medium">Entregue</p>
                  <p className="text-xs text-gray-600">Aguardando...</p>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Chat Drawer */}
      <Drawer open={isChatOpen} onOpenChange={setIsChatOpen} direction="right">
        <DrawerContent className="h-full w-[400px] fixed right-0">
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Chat com {selectedStore}
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm">Olá! Como posso ajudá-lo com seu pedido?</p>
                <p className="text-xs text-gray-600 mt-1">Vendedor - 10:30</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg ml-8">
                <p className="text-sm">Gostaria de saber o status do pedido #2</p>
                <p className="text-xs text-gray-600 mt-1">Você - 10:32</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm">Seu pedido já saiu para entrega! Chegará em breve.</p>
                <p className="text-xs text-gray-600 mt-1">Vendedor - 10:35</p>
              </div>
            </div>
          </div>
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input placeholder="Digite sua mensagem..." className="flex-1" />
              <Button size="sm">Enviar</Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <SuccessModal open={successModalOpen} onOpenChange={setSuccessModalOpen} />
    </SidebarProvider>
  );
};

export default RecursosSeller;
