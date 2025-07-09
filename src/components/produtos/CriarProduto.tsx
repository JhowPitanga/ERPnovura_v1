import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Package, Layers, Package2, Plus, X, Link, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";

const stepsUnico = [
  { id: 1, title: "Tipo de Produto", description: "Escolha o tipo de produto" },
  { id: 2, title: "Informações Principais", description: "Dados básicos do produto" },
  { id: 3, title: "Preços e Estoque", description: "Definições comerciais" },
  { id: 4, title: "Detalhes Técnicos", description: "Dimensões e classificações" },
  { id: 5, title: "Vincular Anúncios", description: "Conecte aos marketplaces" },
];

const stepsVariacoes = [
  { id: 1, title: "Tipo de Produto", description: "Escolha o tipo de produto" },
  { id: 2, title: "Informações Básicas", description: "Dados básicos do produto" },
  { id: 3, title: "Variações", description: "Configure as variações" },
  { id: 4, title: "Detalhes Técnicos", description: "Dimensões por variação" },
  { id: 5, title: "Vincular Anúncios", description: "Conecte por variação" },
];

interface Variacao {
  id: string;
  nome: string;
  cor: string;
  tamanho: string;
  nomePersonalizado: string;
  sku: string;
  ean: string;
  precoCusto: string;
  imagem?: File;
}

export function CriarProduto() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [productType, setProductType] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [productSaved, setProductSaved] = useState(false);
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  const [novaVariacao, setNovaVariacao] = useState({
    cor: "",
    tamanho: "",
    nomePersonalizado: "",
    sku: "",
    ean: "",
    precoCusto: ""
  });
  const [formData, setFormData] = useState({
    tipo: "",
    nome: "",
    sku: "",
    categoria: "",
    marca: "",
    descricao: "",
    precoVenda: "",
    precoCusto: "",
    estoque: "",
    armazem: "",
    altura: "",
    largura: "",
    comprimento: "",
    peso: "",
    ncm: "",
    cest: "",
    unidade: "",
    origem: "",
  });

  const getCurrentSteps = () => {
    return productType === "variacao" ? stepsVariacoes : stepsUnico;
  };

  const getMaxSteps = () => {
    return productType === "variacao" ? 5 : 5;
  };

  const nextStep = () => {
    if (currentStep < getMaxSteps()) {
      if (currentStep === 4 && !productSaved) {
        setProductSaved(true);
        console.log("Produto salvo:", formData);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const remainingSlots = 8 - selectedImages.length;
    const filesToAdd = files.slice(0, remainingSlots);
    
    setSelectedImages(prev => [...prev, ...filesToAdd]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    navigate('/produtos');
  };

  const handleClose = () => {
    navigate('/produtos');
  };

  const adicionarVariacao = () => {
    if (novaVariacao.cor || novaVariacao.tamanho || novaVariacao.nomePersonalizado) {
      const novaVar: Variacao = {
        id: Date.now().toString(),
        nome: novaVariacao.nomePersonalizado || `${novaVariacao.cor} ${novaVariacao.tamanho}`.trim(),
        cor: novaVariacao.cor,
        tamanho: novaVariacao.tamanho,
        nomePersonalizado: novaVariacao.nomePersonalizado,
        sku: novaVariacao.sku,
        ean: novaVariacao.ean,
        precoCusto: novaVariacao.precoCusto,
      };
      
      setVariacoes(prev => [...prev, novaVar]);
      setNovaVariacao({
        cor: "",
        tamanho: "",
        nomePersonalizado: "",
        sku: "",
        ean: "",
        precoCusto: ""
      });
    }
  };

  const removerVariacao = (id: string) => {
    setVariacoes(prev => prev.filter(v => v.id !== id));
  };

  const handleVariacaoImageUpload = (variacaoId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVariacoes(prev => prev.map(v => 
        v.id === variacaoId ? { ...v, imagem: file } : v
      ));
    }
  };

  const currentSteps = getCurrentSteps();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Criar Novo Produto</h1>
            <p className="text-gray-600 text-lg">Siga os passos para cadastrar seu produto</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-5 h-5 mr-2" />
            Fechar
          </Button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10">
          {currentSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.id
                      ? "bg-novura-primary border-novura-primary text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm font-medium text-gray-900">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              {index < currentSteps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-6 ${
                  currentStep > step.id ? "bg-novura-primary" : "bg-gray-300"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Selecione o tipo de produto</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div
                      className={`p-8 border-2 rounded-lg cursor-pointer transition-all ${
                        productType === "unico"
                          ? "border-novura-primary bg-novura-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        setProductType("unico");
                        handleInputChange("tipo", "unico");
                      }}
                    >
                      <Package className="w-10 h-10 text-novura-primary mb-4" />
                      <h4 className="font-semibold mb-2 text-lg">Produto Único</h4>
                      <p className="text-sm text-gray-600">
                        Produto simples sem variações
                      </p>
                    </div>

                    <div
                      className={`p-8 border-2 rounded-lg cursor-pointer transition-all ${
                        productType === "variacao"
                          ? "border-novura-primary bg-novura-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        setProductType("variacao");
                        handleInputChange("tipo", "variacao");
                      }}
                    >
                      <Layers className="w-10 h-10 text-novura-primary mb-4" />
                      <h4 className="font-semibold mb-2 text-lg">Com Variações</h4>
                      <p className="text-sm text-gray-600">
                        Produto com cores, tamanhos, etc.
                      </p>
                    </div>

                    <div
                      className={`p-8 border-2 rounded-lg cursor-pointer transition-all ${
                        productType === "kit"
                          ? "border-novura-primary bg-novura-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        setProductType("kit");
                        handleInputChange("tipo", "kit");
                      }}
                    >
                      <Package2 className="w-10 h-10 text-novura-primary mb-4" />
                      <h4 className="font-semibold mb-2 text-lg">Kit</h4>
                      <p className="text-sm text-gray-600">
                        Conjunto de produtos vendidos juntos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && productType === "unico" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Informações Principais</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="nome">Nome do Produto *</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => handleInputChange("nome", e.target.value)}
                        placeholder="Digite o nome do produto"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU *</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => handleInputChange("sku", e.target.value)}
                        placeholder="Código único do produto"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoria">Categoria</Label>
                      <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                          <SelectItem value="roupas">Roupas</SelectItem>
                          <SelectItem value="casa">Casa e Decoração</SelectItem>
                          <SelectItem value="esporte">Esporte e Lazer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="marca">Marca</Label>
                      <Input
                        id="marca"
                        value={formData.marca}
                        onChange={(e) => handleInputChange("marca", e.target.value)}
                        placeholder="Marca do produto"
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) => handleInputChange("descricao", e.target.value)}
                      placeholder="Descreva o produto detalhadamente"
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                  <div className="mt-6">
                    <Label>Imagens do Produto (até 8 fotos)</Label>
                    <div className="grid grid-cols-8 gap-4 mt-4">
                      {/* Imagens selecionadas */}
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative">
                          <div className="aspect-square border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Imagem ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      
                      {/* Quadros para adicionar novas imagens */}
                      {Array.from({ length: 8 - selectedImages.length }).map((_, index) => (
                        <div key={`empty-${index}`} className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            id={`image-upload-${index}`}
                          />
                          <label
                            htmlFor={`image-upload-${index}`}
                            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
                          >
                            <Plus className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500 text-center px-2">
                              Adicionar
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB por imagem.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && productType === "variacao" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Informações Básicas</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="nome">Nome do Produto *</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => handleInputChange("nome", e.target.value)}
                        placeholder="Digite o nome do produto"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoria">Categoria</Label>
                      <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                          <SelectItem value="roupas">Roupas</SelectItem>
                          <SelectItem value="casa">Casa e Decoração</SelectItem>
                          <SelectItem value="esporte">Esporte e Lazer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="marca">Marca</Label>
                      <Input
                        id="marca"
                        value={formData.marca}
                        onChange={(e) => handleInputChange("marca", e.target.value)}
                        placeholder="Marca do produto"
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) => handleInputChange("descricao", e.target.value)}
                      placeholder="Descreva o produto detalhadamente"
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && productType === "unico" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Preços e Estoque</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="precoVenda">Preço de Venda *</Label>
                      <Input
                        id="precoVenda"
                        type="number"
                        step="0.01"
                        value={formData.precoVenda}
                        onChange={(e) => handleInputChange("precoVenda", e.target.value)}
                        placeholder="0,00"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="precoCusto">Preço de Custo</Label>
                      <Input
                        id="precoCusto"
                        type="number"
                        step="0.01"
                        value={formData.precoCusto}
                        onChange={(e) => handleInputChange("precoCusto", e.target.value)}
                        placeholder="0,00"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="estoque">Quantidade em Estoque</Label>
                      <Input
                        id="estoque"
                        type="number"
                        value={formData.estoque}
                        onChange={(e) => handleInputChange("estoque", e.target.value)}
                        placeholder="0"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="armazem">Armazém</Label>
                      <Select value={formData.armazem} onValueChange={(value) => handleInputChange("armazem", value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Selecione o armazém" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="principal">Armazém Principal</SelectItem>
                          <SelectItem value="secundario">Armazém Secundário</SelectItem>
                          <SelectItem value="externo">Armazém Externo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && productType === "variacao" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Configurar Variações</h3>
                  
                  {/* Formulário para adicionar nova variação */}
                  <Card className="p-6 bg-gray-50">
                    <h4 className="font-semibold mb-4">Adicionar Nova Variação</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="cor">Cor</Label>
                        <Input
                          id="cor"
                          value={novaVariacao.cor}
                          onChange={(e) => setNovaVariacao(prev => ({ ...prev, cor: e.target.value }))}
                          placeholder="Ex: Azul"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tamanho">Tamanho</Label>
                        <Input
                          id="tamanho"
                          value={novaVariacao.tamanho}
                          onChange={(e) => setNovaVariacao(prev => ({ ...prev, tamanho: e.target.value }))}
                          placeholder="Ex: M"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nomePersonalizado">Nome Personalizado</Label>
                        <Input
                          id="nomePersonalizado"
                          value={novaVariacao.nomePersonalizado}
                          onChange={(e) => setNovaVariacao(prev => ({ ...prev, nomePersonalizado: e.target.value }))}
                          placeholder="Nome da variação"
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <Label htmlFor="varSku">SKU da Variação</Label>
                        <Input
                          id="varSku"
                          value={novaVariacao.sku}
                          onChange={(e) => setNovaVariacao(prev => ({ ...prev, sku: e.target.value }))}
                          placeholder="SKU-001"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ean">EAN</Label>
                        <Input
                          id="ean"
                          value={novaVariacao.ean}
                          onChange={(e) => setNovaVariacao(prev => ({ ...prev, ean: e.target.value }))}
                          placeholder="Código EAN"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="precoCustoVar">Preço de Custo</Label>
                        <Input
                          id="precoCustoVar"
                          type="number"
                          step="0.01"
                          value={novaVariacao.precoCusto}
                          onChange={(e) => setNovaVariacao(prev => ({ ...prev, precoCusto: e.target.value }))}
                          placeholder="0,00"
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={adicionarVariacao} 
                      className="mt-4 bg-novura-primary hover:bg-novura-primary/90"
                      disabled={!novaVariacao.cor && !novaVariacao.tamanho && !novaVariacao.nomePersonalizado}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Variação
                    </Button>
                  </Card>

                  {/* Lista de variações em accordion */}
                  {variacoes.length > 0 && (
                    <div className="mt-8">
                      <h4 className="font-semibold mb-4">Variações Criadas ({variacoes.length})</h4>
                      <Accordion type="single" collapsible className="space-y-2">
                        {variacoes.map((variacao) => (
                          <AccordionItem key={variacao.id} value={variacao.id} className="border rounded-lg">
                            <AccordionTrigger className="px-4 hover:no-underline">
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-4">
                                  <span className="font-medium">{variacao.nome}</span>
                                  <span className="text-sm text-gray-500">SKU: {variacao.sku}</span>
                                  <span className="text-sm text-gray-500">EAN: {variacao.ean}</span>
                                  <span className="text-sm text-gray-500">Custo: R$ {variacao.precoCusto}</span>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div>
                                    <Label>Foto de Capa</Label>
                                    <div className="mt-2">
                                      {variacao.imagem ? (
                                        <div className="relative inline-block">
                                          <img
                                            src={URL.createObjectURL(variacao.imagem)}
                                            alt={variacao.nome}
                                            className="w-16 h-16 object-cover rounded border"
                                          />
                                          <button
                                            onClick={() => setVariacoes(prev => prev.map(v => 
                                              v.id === variacao.id ? { ...v, imagem: undefined } : v
                                            ))}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                          >
                                            <X className="w-2 h-2" />
                                          </button>
                                        </div>
                                      ) : (
                                        <label className="inline-block">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleVariacaoImageUpload(variacao.id, e)}
                                            className="hidden"
                                          />
                                          <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400">
                                            <Plus className="w-4 h-4 text-gray-400" />
                                          </div>
                                        </label>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removerVariacao(variacao.id)}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Remover
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 4 && productType === "unico" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Detalhes Técnicos</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="altura">Altura (cm)</Label>
                      <Input
                        id="altura"
                        type="number"
                        step="0.1"
                        value={formData.altura}
                        onChange={(e) => handleInputChange("altura", e.target.value)}
                        placeholder="0.0"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="largura">Largura (cm)</Label>
                      <Input
                        id="largura"
                        type="number"
                        step="0.1"
                        value={formData.largura}
                        onChange={(e) => handleInputChange("largura", e.target.value)}
                        placeholder="0.0"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="comprimento">Comprimento (cm)</Label>
                      <Input
                        id="comprimento"
                        type="number"
                        step="0.1"
                        value={formData.comprimento}
                        onChange={(e) => handleInputChange("comprimento", e.target.value)}
                        placeholder="0.0"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="peso">Peso (kg)</Label>
                      <Input
                        id="peso"
                        type="number"
                        step="0.001"
                        value={formData.peso}
                        onChange={(e) => handleInputChange("peso", e.target.value)}
                        placeholder="0.000"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ncm">NCM *</Label>
                      <Input
                        id="ncm"
                        value={formData.ncm}
                        onChange={(e) => handleInputChange("ncm", e.target.value)}
                        placeholder="00000000"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cest">CEST (Opcional)</Label>
                      <Input
                        id="cest"
                        value={formData.cest}
                        onChange={(e) => handleInputChange("cest", e.target.value)}
                        placeholder="0000000"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unidade">Unidade</Label>
                      <Select value={formData.unidade} onValueChange={(value) => handleInputChange("unidade", value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="un">Unidade</SelectItem>
                          <SelectItem value="kg">Quilograma</SelectItem>
                          <SelectItem value="g">Grama</SelectItem>
                          <SelectItem value="l">Litro</SelectItem>
                          <SelectItem value="ml">Mililitro</SelectItem>
                          <SelectItem value="m">Metro</SelectItem>
                          <SelectItem value="cm">Centímetro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="origem">Origem</Label>
                      <Select value={formData.origem} onValueChange={(value) => handleInputChange("origem", value)}>
                        <SelectTrigger className="mt-2">
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
                </div>
              </div>
            )}

            {currentStep === 4 && productType === "variacao" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Detalhes Técnicos por Variação</h3>
                  {variacoes.length > 0 ? (
                    <Accordion type="single" collapsible className="space-y-4">
                      {variacoes.map((variacao) => (
                        <AccordionItem key={variacao.id} value={variacao.id} className="border rounded-lg">
                          <AccordionTrigger className="px-4">
                            <span className="font-medium">{variacao.nome}</span>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Altura (cm)</Label>
                                <Input type="number" step="0.1" placeholder="0.0" className="mt-2" />
                              </div>
                              <div>
                                <Label>Largura (cm)</Label>
                                <Input type="number" step="0.1" placeholder="0.0" className="mt-2" />
                              </div>
                              <div>
                                <Label>Comprimento (cm)</Label>
                                <Input type="number" step="0.1" placeholder="0.0" className="mt-2" />
                              </div>
                              <div>
                                <Label>Peso (kg)</Label>
                                <Input type="number" step="0.001" placeholder="0.000" className="mt-2" />
                              </div>
                              <div>
                                <Label>NCM *</Label>
                                <Input placeholder="00000000" className="mt-2" />
                              </div>
                              <div>
                                <Label>CEST (Opcional)</Label>
                                <Input placeholder="0000000" className="mt-2" />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Adicione variações na etapa anterior para configurar os detalhes técnicos.
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Vincular Anúncios</h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    Seu produto foi salvo com sucesso! Agora você pode vinculá-lo aos marketplaces ou criar novos anúncios.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-8">
                    {/* Card 1: Vincular Anúncio */}
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-novura-primary">
                          <CardContent className="p-8 text-center">
                            <Link className="w-20 h-20 text-novura-primary mx-auto mb-6" />
                            <h4 className="text-xl font-semibold mb-3">Vincular Anúncio</h4>
                            <p className="text-gray-600">
                              Conecte este produto a anúncios existentes nos marketplaces
                            </p>
                          </CardContent>
                        </Card>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Vincular Anúncio</DrawerTitle>
                          <DrawerDescription>
                            {productType === "variacao" 
                              ? "Selecione os anúncios existentes para vincular às variações deste produto"
                              : "Selecione os anúncios existentes para vincular a este produto"
                            }
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="p-6">
                          <div className="space-y-4">
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <Label>Marketplace</Label>
                                <Select>
                                  <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Selecione o marketplace" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="mercadolivre">Mercado Livre</SelectItem>
                                    <SelectItem value="amazon">Amazon</SelectItem>
                                    <SelectItem value="shopee">Shopee</SelectItem>
                                    <SelectItem value="magazineluiza">Magazine Luiza</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex-1">
                                <Label>Pesquisar</Label>
                                <Input placeholder="Buscar por SKU, ID ou descrição..." className="mt-2" />
                              </div>
                            </div>
                            
                            {productType === "variacao" && variacoes.length > 0 && (
                              <div className="mt-6">
                                <Label>Vincular por Variação</Label>
                                <div className="mt-2 space-y-2">
                                  {variacoes.map((variacao) => (
                                    <div key={variacao.id} className="flex items-center justify-between p-3 border rounded">
                                      <span className="font-medium">{variacao.nome}</span>
                                      <Select>
                                        <SelectTrigger className="w-48">
                                          <SelectValue placeholder="Selecione anúncio" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="anuncio1">Anúncio 1</SelectItem>
                                          <SelectItem value="anuncio2">Anúncio 2</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="border rounded-lg p-6 bg-gray-50 mt-6">
                              <p className="text-center text-gray-500">
                                Selecione um marketplace e faça uma pesquisa para encontrar anúncios
                              </p>
                            </div>
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>

                    {/* Card 2: Criar Anúncio */}
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-novura-primary"
                      onClick={() => navigate('/anuncios')}
                    >
                      <CardContent className="p-8 text-center">
                        <ExternalLink className="w-20 h-20 text-novura-primary mx-auto mb-6" />
                        <h4 className="text-xl font-semibold mb-3">Criar Anúncio</h4>
                        <p className="text-gray-600">
                          Crie um novo anúncio para este produto nos marketplaces
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Anterior
          </Button>

          <div className="flex space-x-3">
            {currentStep < 4 ? (
              <Button 
                onClick={nextStep} 
                className="bg-novura-primary hover:bg-novura-primary/90"
                size="lg"
                disabled={currentStep === 1 && !productType}
              >
                Próximo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : currentStep === 4 ? (
              <Button 
                onClick={nextStep} 
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Check className="w-5 h-5 mr-2" />
                Salvar e Continuar
              </Button>
            ) : (
              <Button 
                onClick={handleSave} 
                className="bg-novura-primary hover:bg-novura-primary/90"
                size="lg"
              >
                <Check className="w-5 h-5 mr-2" />
                Finalizar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
