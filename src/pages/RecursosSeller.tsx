
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CleanNavigation } from "@/components/CleanNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Package, Printer, Mail, Tag, Truck, Plus, Minus } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: CartItem[];
}

const navigationItems = [
  { title: "Produtos", path: "", description: "Insumos e materiais" },
  { title: "Pedidos", path: "/pedidos", description: "Histórico de compras" },
];

const products: Product[] = [
  {
    id: "1",
    name: "Fita Adesiva Transparente 48mm",
    description: "Fita para embalagem de produtos - Rolo com 100m",
    price: 12.90,
    image: "/placeholder.svg",
    category: "fitas",
    inStock: true,
  },
  {
    id: "2",
    name: "Impressora Térmica Zebra ZD220",
    description: "Impressora de etiquetas profissional - USB/Ethernet",
    price: 899.00,
    image: "/placeholder.svg",
    category: "impressoras",
    inStock: true,
  },
  {
    id: "3",
    name: "Envelope Plástico 26x36cm",
    description: "Envelope para envio de produtos - Pacote com 100 unidades",
    price: 45.90,
    image: "/placeholder.svg",
    category: "envelopes",
    inStock: true,
  },
  {
    id: "4",
    name: "Etiquetas Adesivas 10x7cm",
    description: "Etiquetas para produtos - Rolo com 500 unidades",
    price: 28.50,
    image: "/placeholder.svg",
    category: "etiquetas",
    inStock: false,
  },
];

const orders: Order[] = [
  {
    id: "ORD001",
    date: "2024-01-15",
    total: 157.80,
    status: "delivered",
    items: [
      { ...products[0], quantity: 5 },
      { ...products[2], quantity: 2 },
    ],
  },
  {
    id: "ORD002",
    date: "2024-01-10",
    total: 899.00,
    status: "shipped",
    items: [
      { ...products[1], quantity: 1 },
    ],
  },
];

export default function RecursosSeller() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const categories = [
    { id: "all", name: "Todos os Produtos", icon: Package },
    { id: "fitas", name: "Fitas", icon: Package },
    { id: "impressoras", name: "Impressoras", icon: Printer },
    { id: "envelopes", name: "Envelopes", icon: Mail },
    { id: "etiquetas", name: "Etiquetas", icon: Tag },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(prev => prev.filter(item => item.id !== productId));
    } else {
      setCart(prev =>
        prev.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'processing': return 'Processando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      default: return 'Desconhecido';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">Recursos Seller</h2>
            </div>
          </header>

          <CleanNavigation items={navigationItems} basePath="/recursos-seller" />

          <main className="flex-1 p-6 overflow-auto">
            <Tabs defaultValue="produtos" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="produtos">Produtos</TabsTrigger>
                <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
              </TabsList>

              <TabsContent value="produtos" className="space-y-6">
                {/* Search and Cart */}
                <div className="flex justify-between items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar produtos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Drawer open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                    <DrawerTrigger asChild>
                      <Button className="ml-4 relative">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Carrinho
                        {cart.length > 0 && (
                          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                            {cart.reduce((sum, item) => sum + item.quantity, 0)}
                          </Badge>
                        )}
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Carrinho de Compras</DrawerTitle>
                        <DrawerDescription>
                          Revise seus itens antes de finalizar a compra
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4 max-h-96 overflow-auto">
                        {cart.length === 0 ? (
                          <p className="text-center text-gray-500 py-8">Carrinho vazio</p>
                        ) : (
                          <div className="space-y-4">
                            {cart.map((item) => (
                              <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <p className="text-sm text-gray-600">R$ {item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                            <div className="border-t pt-4 mt-4">
                              <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total:</span>
                                <span>R$ {getCartTotal().toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <DrawerFooter>
                        <Button 
                          className="w-full" 
                          disabled={cart.length === 0}
                          onClick={() => {
                            // Simular finalização da compra
                            alert('Compra finalizada com sucesso!');
                            setCart([]);
                            setIsCheckoutOpen(false);
                          }}
                        >
                          Finalizar Compra - R$ {getCartTotal().toFixed(2)}
                        </Button>
                        <DrawerClose asChild>
                          <Button variant="outline">Continuar Comprando</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </div>

                {/* Categories */}
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex items-center space-x-2 whitespace-nowrap"
                    >
                      <category.icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </Button>
                  ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm line-clamp-2">{product.name}</CardTitle>
                        <CardDescription className="text-xs line-clamp-2">{product.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl font-bold text-novura-primary">R$ {product.price.toFixed(2)}</p>
                            <Badge variant={product.inStock ? "default" : "secondary"} className="text-xs">
                              {product.inStock ? "Em estoque" : "Indisponível"}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            disabled={!product.inStock}
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pedidos" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Histórico de Pedidos</h3>
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">Pedido #{order.id}</CardTitle>
                            <CardDescription>
                              {new Date(order.date).toLocaleDateString('pt-BR')}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                            <p className="text-lg font-bold mt-1">R$ {order.total.toFixed(2)}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                              <span>{item.name}</span>
                              <span>Qtd: {item.quantity} - R$ {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
