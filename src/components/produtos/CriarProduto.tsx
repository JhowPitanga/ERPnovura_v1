import { useState } from "react";
import { X, Link, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";

// Import refactored components
import { StepIndicator } from "./criar/StepIndicator";
import { ProductTypeSelector } from "./criar/ProductTypeSelector";
import { ProductForm } from "./criar/ProductForm";
import { ImageUpload } from "./criar/ImageUpload";
import { VariationForm } from "./criar/VariationForm";
import { NavigationButtons } from "./criar/NavigationButtons";
import { stepsUnico, stepsVariacoes } from "./criar/constants";
import { FormData, Variacao } from "./criar/types";

export function CriarProduto() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [productType, setProductType] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [productSaved, setProductSaved] = useState(false);
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  const [formData, setFormData] = useState<FormData>({
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProductTypeChange = (type: string) => {
    setProductType(type);
    handleInputChange("tipo", type);
  };

  const handleSave = () => {
    navigate('/produtos');
  };

  const handleClose = () => {
    navigate('/produtos');
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
        <StepIndicator steps={currentSteps} currentStep={currentStep} />

        {/* Step Content */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <ProductTypeSelector 
                productType={productType} 
                onProductTypeChange={handleProductTypeChange} 
              />
            )}

            {currentStep === 2 && productType === "unico" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Informações Principais</h3>
                  <ProductForm 
                    formData={formData} 
                    onInputChange={handleInputChange} 
                    includeSku={true} 
                  />
                  <ImageUpload 
                    selectedImages={selectedImages} 
                    onImagesChange={setSelectedImages} 
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && productType === "variacao" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Informações Básicas</h3>
                  <ProductForm 
                    formData={formData} 
                    onInputChange={handleInputChange} 
                    includeSku={false} 
                  />
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
              <VariationForm variacoes={variacoes} onVariacoesChange={setVariacoes} />
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
        <NavigationButtons
          currentStep={currentStep}
          maxSteps={getMaxSteps()}
          productType={productType}
          onNext={nextStep}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
