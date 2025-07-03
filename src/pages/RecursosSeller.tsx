
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, CreditCard, MapPin, Plus, Minus, ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { SuccessModal } from "@/components/recursos/SuccessModal";

const categorias = [
  { id: "smartphones", nome: "Smartphones", count: 12 },
  { id: "notebooks", nome: "Notebooks", count: 8 },
  { id: "acessorios", nome: "Acessórios", count: 24 },
  { id: "games", nome: "Games", count: 15 },
  { id: "casa", nome: "Casa e Cozinha", count: 18 },
];

const produtos = {
  smartphones: [
    { id: 1, nome: "iPhone 15 Pro Max", preco: 8999.99, categoria: "smartphones", image: "/placeholder.svg", descricao: "iPhone 15 Pro Max 256GB Titanium" },
    { id: 2, nome: "Samsung Galaxy S24 Ultra", preco: 6999.99, categoria: "smartphones", image: "/placeholder.svg", descricao: "Galaxy S24 Ultra 256GB" },
    { id: 3, nome: "iPhone 14", preco: 6999.99, categoria: "smartphones", image: "/placeholder.svg", descricao: "iPhone 14 128GB" },
    { id: 4, nome: "Xiaomi 13 Pro", preco: 3999.99, categoria: "smartphones", image: "/placeholder.svg", descricao: "Xiaomi 13 Pro 256GB" },
  ],
  notebooks: [
    { id: 5, nome: "MacBook Air M3", preco: 12999.99, categoria: "notebooks", image: "/placeholder.svg", descricao: "MacBook Air M3 16GB 512GB" },
    { id: 6, nome: "Dell XPS 13", preco: 8999.99, categoria: "notebooks", image: "/placeholder.svg", descricao: "Dell XPS 13 Plus Intel i7" },
    { id: 7, nome: "Lenovo ThinkPad", preco: 7499.99, categoria: "notebooks", image: "/placeholder.svg", descricao: "ThinkPad X1 Carbon" },
    { id: 8, nome: "ASUS ZenBook", preco: 5999.99, categoria: "notebooks", image: "/placeholder.svg", descricao: "ZenBook 14 OLED" },
  ],
  acessorios: [
    { id: 9, nome: "AirPods Pro", preco: 2299.99, categoria: "acessorios", image: "/placeholder.svg", descricao: "AirPods Pro 2ª Geração" },
    { id: 10, nome: "Magic Mouse", preco: 699.99, categoria: "acessorios", image: "/placeholder.svg", descricao: "Apple Magic Mouse" },
    { id: 11, nome: "Logitech MX Master", preco: 599.99, categoria: "acessorios", image: "/placeholder.svg", descricao: "MX Master 3S" },
    { id: 12, nome: "Carregador MagSafe", preco: 299.99, categoria: "acessorios", image: "/placeholder.svg", descricao: "Carregador MagSafe 15W" },
  ],
  games: [
    { id: 13, nome: "PlayStation 5", preco: 4499.99, categoria: "games", image: "/placeholder.svg", descricao: "Console PlayStation 5" },
    { id: 14, nome: "Nintendo Switch OLED", preco: 2299.99, categoria: "games", image: "/placeholder.svg", descricao: "Switch OLED White" },
    { id: 15, nome: "Xbox Series X", preco: 4199.99, categoria: "games", image: "/placeholder.svg", descricao: "Console Xbox Series X" },
    { id: 16, nome: "Steam Deck", preco: 3299.99, categoria: "games", image: "/placeholder.svg", descricao: "Steam Deck 512GB" },
  ],
  casa: [
    { id: 17, nome: "Echo Dot", preco: 399.99, categoria: "casa", image: "/placeholder.svg", descricao: "Amazon Echo Dot 5ª Geração" },
    { id: 18, nome: "Philips Hue", preco: 799.99, categoria: "casa", image: "/placeholder.svg", descricao: "Kit Lâmpadas Inteligentes" },
    { id: 19, nome: "Ring Doorbell", preco: 1299.99, categoria: "casa", image: "/placeholder.svg", descricao: "Video Doorbell Pro" },
    { id: 20, nome: "Nest Thermostat", preco: 1599.99, categoria: "casa", image: "/placeholder.svg", descricao: "Termostato Inteligente" },
  ],
};

const enderecos = [
  {
    id: "endereco1",
    tipo: "Casa",
    endereco: "Rua das Flores, 123 - Centro",
    cidade: "São Paulo, SP - 01234-567"
  },
  {
    id: "endereco2",
    tipo: "Trabalho",
    endereco: "Av. Paulista, 1000 - Bela Vista",
    cidade: "São Paulo, SP - 01310-100"
  }
];

const meiosPagamento = [
  { id: "pix", nome: "PIX", ativo: true },
  { id: "cartao", nome: "Cartão de Crédito", ativo: true },
  { id: "boleto", nome: "Boleto Bancário", ativo: false },
];

const RecursosSeller = () => {
  const [categoriaAtiva, setCategoriaAtiva] = useState("smartphones");
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [carrinhoOpen, setCarrinhoOpen] = useState(false);
  const [stepAtual, setStepAtual] = useState(0);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState("endereco1");
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState("pix");
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const produtosCategoria = produtos[categoriaAtiva] || [];

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

          {/* Navigation */}
          <div className="bg-white px-6 py-4">
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
          </div>

          {/* Products Grid */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {produtosCategoria.map((produto) => (
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
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-novura-primary">
                        R$ {produto.preco.toFixed(2)}
                      </span>
                      <Button 
                        onClick={() => adicionarAoCarrinho(produto)}
                        size="sm"
                        className="bg-novura-primary hover:bg-novura-primary/90"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setStepAtual(stepAtual - 1)}
                  >
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
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Novo Endereço
                  </Button>
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

                {/* Resumo Final */}
                <div className="border-t pt-4 mt-6">
                  <h4 className="font-semibold mb-3">Resumo do Pedido</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>R$ {totalCarrinho.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frete</span>
                      <span>R$ 15,90</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Desconto</span>
                      <span>- R$ 0,00</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>R$ {(totalCarrinho + 15.90).toFixed(2)}</span>
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

      <SuccessModal open={successModalOpen} onOpenChange={setSuccessModalOpen} />
    </SidebarProvider>
  );
};

export default RecursosSeller;
