
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, Search, Filter, ExternalLink, X } from "lucide-react";
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
  marca: "Apple",
  custoBuyPrice: 6500.99,
  estoque: 25,
  armazem: "Principal",
  peso: 200, // em gramas
  dimensoes: {
    altura: 14.7,
    largura: 7.1,
    comprimento: 0.8
  },
  codigoBarras: "7891000123456",
  ncm: "85171231",
  cest: "0123456",
  unidade: "UN",
  origem: "0",
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Produto</h1>
          <p className="text-gray-600">SKU: {produto.sku}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleVoltar}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={handleSalvar} className="bg-novura-primary hover:bg-novura-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Accordion Form */}
      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible defaultValue="informacoes-basicas" className="w-full">
            {/* Passo 1 - Informações Básicas */}
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
                    <Label htmlFor="nome">Nome do Produto *</Label>
                    <Input
                      id="nome"
                      value={produto.nome}
                      onChange={(e) => setProduto({...produto, nome: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={produto.sku}
                      onChange={(e) => setProduto({...produto, sku: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Input
                      id="categoria"
                      value={produto.categoria}
                      onChange={(e) => setProduto({...produto, categoria: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Input
                      id="marca"
                      value={produto.marca}
                      onChange={(e) => setProduto({...produto, marca: e.target.value})}
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

            {/* Passo 2 - Fotos */}
            <AccordionItem value="fotos">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">2</span>
                  <span className="font-medium">Fotos do Produto</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Clique para adicionar fotos ou arraste e solte aqui</p>
                  <p className="text-sm text-gray-400 mt-2">PNG, JPG até 10MB cada</p>
                  <div className="mt-4 flex flex-wrap gap-4">
                    {produto.imagens.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Produto ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                        <button className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Passo 3 - Preço de Custo */}
            <AccordionItem value="preco-custo">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">3</span>
                  <span className="font-medium">Preço de Custo</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="custoBuyPrice">Custo de Compra *</Label>
                    <Input
                      id="custoBuyPrice"
                      type="number"
                      step="0.01"
                      value={produto.custoBuyPrice}
                      onChange={(e) => setProduto({...produto, custoBuyPrice: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estoque">Estoque Inicial *</Label>
                    <Input
                      id="estoque"
                      type="number"
                      value={produto.estoque}
                      onChange={(e) => setProduto({...produto, estoque: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="armazem">Armazém</Label>
                    <Select value={produto.armazem} onValueChange={(value) => setProduto({...produto, armazem: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o armazém" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="principal">Principal</SelectItem>
                        <SelectItem value="secundario">Secundário</SelectItem>
                        <SelectItem value="deposito">Depósito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Passo 4 - Dimensões e Peso */}
            <AccordionItem value="dimensoes">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">4</span>
                  <span className="font-medium">Dimensões e Peso do Pacote</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="altura">Altura (cm) *</Label>
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
                    <Label htmlFor="largura">Largura (cm) *</Label>
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
                    <Label htmlFor="comprimento">Comprimento (cm) *</Label>
                    <Input
                      id="comprimento"
                      type="number"
                      step="0.1"
                      value={produto.dimensoes.comprimento}
                      onChange={(e) => setProduto({
                        ...produto,
                        dimensoes: {...produto.dimensoes, comprimento: parseFloat(e.target.value)}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso (gramas) *</Label>
                    <Input
                      id="peso"
                      type="number"
                      value={produto.peso}
                      onChange={(e) => setProduto({...produto, peso: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Passo 5 - Informações Fiscais */}
            <AccordionItem value="fiscais">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">5</span>
                  <span className="font-medium">Informações Fiscais</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="codigoBarras">Código de Barras *</Label>
                    <Input
                      id="codigoBarras"
                      value={produto.codigoBarras}
                      onChange={(e) => setProduto({...produto, codigoBarras: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ncm">NCM *</Label>
                    <Input
                      id="ncm"
                      value={produto.ncm}
                      onChange={(e) => setProduto({...produto, ncm: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cest">CEST</Label>
                    <Input
                      id="cest"
                      value={produto.cest}
                      onChange={(e) => setProduto({...produto, cest: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidade">Unidade de Medida</Label>
                    <Select value={produto.unidade} onValueChange={(value) => setProduto({...produto, unidade: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UN">UN - Unidade</SelectItem>
                        <SelectItem value="KG">KG - Quilograma</SelectItem>
                        <SelectItem value="MT">MT - Metro</SelectItem>
                        <SelectItem value="LT">LT - Litro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="origem">Origem</Label>
                    <Select value={produto.origem} onValueChange={(value) => setProduto({...produto, origem: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a origem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 - Nacional</SelectItem>
                        <SelectItem value="1">1 - Estrangeira - Importação direta</SelectItem>
                        <SelectItem value="2">2 - Estrangeira - Adquirida no mercado interno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Passo 6 - Mapeamento */}
            <AccordionItem value="mapeamento">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">6</span>
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
