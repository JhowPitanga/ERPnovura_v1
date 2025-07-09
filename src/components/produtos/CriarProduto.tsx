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
import { StockForm } from "./criar/StockForm";
import { DimensionsForm } from "./criar/DimensionsForm";
import { TaxForm } from "./criar/TaxForm";
import { NavigationButtons } from "./criar/NavigationButtons";
import { CloseConfirmationDialog } from "./criar/CloseConfirmationDialog";
import { stepsUnico, stepsVariacoes } from "./criar/constants";
import { FormData, Variacao } from "./criar/types";

export function CriarProduto() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [productType, setProductType] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [productSaved, setProductSaved] = useState(false);
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    tipo: "",
    nome: "",
    sku: "",
    categoria: "",
    marca: "",
    descricao: "",
    precoCusto: "",
    estoque: "",
    armazem: "",
    altura: "",
    largura: "",
    comprimento: "",
    peso: "",
    codigoBarras: "",
    ncm: "",
    cest: "",
    unidade: "",
    origem: "",
  });

  const getCurrentSteps = () => {
    return productType === "variacao" ? stepsVariacoes : stepsUnico;
  };

  const getMaxSteps = () => {
    return 6;
  };

  const nextStep = () => {
    if (currentStep < getMaxSteps()) {
      if (currentStep === 5 && !productSaved) {
        setProductSaved(true);
        console.log("Produto salvo:", formData);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const backStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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

  const handleCloseRequest = () => {
    setShowCloseDialog(true);
  };

  const handleConfirmClose = () => {
    navigate('/produtos');
  };

  const currentSteps = getCurrentSteps();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Criar Novo Produto</h1>
            <p className="text-gray-600 text-lg">Siga os passos para cadastrar seu produto</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCloseRequest}>
            <X className="w-5 h-5 mr-2" />
            Fechar
          </Button>
        </div>

        {/* Stepper */}
        <StepIndicator steps={currentSteps} currentStep={currentStep} />

        {/* Step Content */}
        <Card className="shadow-lg">
          <CardContent className="p-10">
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
              <StockForm formData={formData} onInputChange={handleInputChange} />
            )}

            {currentStep === 3 && productType === "variacao" && (
              <VariationForm variacoes={variacoes} onVariacoesChange={setVariacoes} />
            )}

            {currentStep === 4 && (
              <DimensionsForm formData={formData} onInputChange={handleInputChange} />
            )}

            {currentStep === 5 && productType === "unico" && (
              <TaxForm formData={formData} onInputChange={handleInputChange} />
            )}

            {currentStep === 5 && productType === "variacao" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Informações Fiscais por Variação</h3>
                  {variacoes.length > 0 ? (
                    <Accordion type="single" collapsible className="space-y-4">
                      {variacoes.map((variacao) => (
                        <AccordionItem key={variacao.id} value={variacao.id} className="border rounded-lg">
                          <AccordionTrigger className="px-4">
                            <span className="font-medium">{variacao.nome}</span>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <TaxForm formData={formData} onInputChange={handleInputChange} />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Adicione variações na etapa anterior para configurar as informações fiscais.
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 6 && (
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
          onBack={backStep}
          onSave={handleSave}
        />

        {/* Close Confirmation Dialog */}
        <CloseConfirmationDialog
          open={showCloseDialog}
          onOpenChange={setShowCloseDialog}
          onConfirm={handleConfirmClose}
        />
      </div>
    </div>
  );
}
