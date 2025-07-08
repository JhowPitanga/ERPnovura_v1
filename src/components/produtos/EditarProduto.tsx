
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, Search, Filter, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data para produto
const mockProduct = {
  id: 1,
  nome: "iPhone 15 Pro",
  sku: "IPH15P-001",
  descricao: "iPhone 15 Pro com 128GB de armazenamento",
  categoria: "Eletrônicos",
  custoBuyPrice: 6500.99,
  precoVenda: 7999.99,
  estoque: 25,
  peso: 0.2,
  dimensoes: {
    altura: 14.7,
    largura: 7.1,
    profundidade: 0.8
  },
  imagens: ["/placeholder.svg"],
  vinculos: [
    { id: 1, marketplace: "Mercado Livre", sku: "MLB123456789", status: "Ativo", link: "https://mercadolivre.com" },
    { id: 2, marketplace: "Amazon", sku: "AMZ987654321", status: "Ativo", link: "https://amazon.com" },
    { id: 3, marketplace: "Shopee", sku: "SHP456789123", status: "Pausado", link: "https://shopee.com" }
  ]
};

const marketplaces = [
  { value: "mercado-livre", label: "Mercado Livre" },
  { value: "amazon", label: "Amazon" },
  { value: "shopee", label: "Shopee" },
  { value: "magazine-luiza", label: "Magazine Luiza" },
  { value: "americanas", label: "Americanas" }
];

export function EditarProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(mockProduct);
  const [openMapeamento, setOpenMapeamento] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleVoltar = () => {
    navigate("/produtos");
  };

  const handleSalvar = () => {
    console.log("Salvando produto:", produto);
    // TODO: Implementar salvamento
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleVoltar}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Produto</h1>
            <p className="text-gray-600">SKU: {produto.sku}</p>
          </div>
        </div>
        <Button onClick={handleSalvar} className="bg-novura-primary hover:bg-novura-primary/90">
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      {/* Accordion Form */}
      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible defaultValue="informacoes-basicas" className="w-full">
            {/* Informações Básicas */}
            <AccordionItem value="informacoes-basicas">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">1</span>
                  <span className="font-medium">Informações Básicas</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Produto</Label>
                    <Input
                      id="nome"
                      value={produto.nome}
                      onChange={(e) => setProduto({...produto, nome: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={produto.sku}
                      onChange={(e) => setProduto({...produto, sku: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Input
                      id="categoria"
                      value={produto.categoria}
                      onChange={(e) => setProduto({...produto, categoria: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estoque">Estoque</Label>
                    <Input
                      id="estoque"
                      type="number"
                      value={produto.estoque}
                      onChange={(e) => setProduto({...produto, estoque: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="col-span-full space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={produto.descricao}
                      onChange={(e) => setProduto({...produto, descricao: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Preços */}
            <AccordionItem value="precos">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">2</span>
                  <span className="font-medium">Preços</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="custoBuyPrice">Custo de Compra</Label>
                    <Input
                      id="custoBuyPrice"
                      type="number"
                      step="0.01"
                      value={produto.custoBuyPrice}
                      onChange={(e) => setProduto({...produto, custoBuyPrice: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="precoVenda">Preço de Venda</Label>
                    <Input
                      id="precoVenda"
                      type="number"
                      step="0.01"
                      value={produto.precoVenda}
                      onChange={(e) => setProduto({...produto, precoVenda: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Dimensões e Peso */}
            <AccordionItem value="dimensoes">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">3</span>
                  <span className="font-medium">Dimensões e Peso</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="altura">Altura (cm)</Label>
                    <Input
                      id="altura"
                      type="number"
                      step="0.1"
                      value={produto.dimensoes.altura}
                      onChange={(e) => setProduto({
                        ...produto,
                        dimensoes: {...produto.dimensoes, altura: parseFloat(e.target.value)}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="largura">Largura (cm)</Label>
                    <Input
                      id="largura"
                      type="number"
                      step="0.1"
                      value={produto.dimensoes.largura}
                      onChange={(e) => setProduto({
                        ...produto,
                        dimensoes: {...produto.dimensoes, largura: parseFloat(e.target.value)}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profundidade">Profundidade (cm)</Label>
                    <Input
                      id="profundidade"
                      type="number"
                      step="0.1"
                      value={produto.dimensoes.profundidade}
                      onChange={(e) => setProduto({
                        ...produto,
                        dimensoes: {...produto.dimensoes, profundidade: parseFloat(e.target.value)}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input
                      id="peso"
                      type="number"
                      step="0.01"
                      value={produto.peso}
                      onChange={(e) => setProduto({...produto, peso: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Mapeamento */}
            <AccordionItem value="mapeamento">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">4</span>
                  <span className="font-medium">Mapeamento de Anúncios</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Anúncios Vinculados</h3>
                    <Drawer open={openMapeamento} onOpenChange={setOpenMapeamento}>
                      <DrawerTrigger asChild>
                        <Button className="bg-novura-primary hover:bg-novura-primary/90">
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Vínculo
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Adicionar Novo Vínculo</DrawerTitle>
                          <DrawerDescription>
                            Busque e vincule anúncios dos marketplaces
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="p-6 space-y-4">
                          {/* Filtros */}
                          <div className="flex space-x-4">
                            <div className="flex-1">
                              <Select value={selectedMarketplace} onValueChange={setSelectedMarketplace}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o marketplace" />
                                </SelectTrigger>
                                <SelectContent>
                                  {marketplaces.map((marketplace) => (
                                    <SelectItem key={marketplace.value} value={marketplace.value}>
                                      {marketplace.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button variant="outline">
                              <Filter className="w-4 h-4 mr-2" />
                              Filtros
                            </Button>
                          </div>
                          
                          {/* Barra de Pesquisa */}
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              placeholder="Buscar por SKU, ID do produto ou descrição..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>

                          {/* Resultados Mock */}
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">iPhone 15 Pro - Mercado Livre</p>
                                    <p className="text-sm text-gray-500">SKU: MLB123456789</p>
                                    <p className="text-sm text-gray-500">ID: 12345</p>
                                  </div>
                                  <Button size="sm">Vincular</Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </div>

                  {/* Tabela de Vínculos */}
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Marketplace</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Link</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {produto.vinculos.map((vinculo) => (
                            <TableRow key={vinculo.id}>
                              <TableCell className="font-medium">{vinculo.marketplace}</TableCell>
                              <TableCell className="font-mono text-sm">{vinculo.sku}</TableCell>
                              <TableCell>
                                <Badge variant={vinculo.status === "Ativo" ? "default" : "secondary"}>
                                  {vinculo.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={vinculo.link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  Desvincular
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
