import { useState } from "react";
import { X, Link, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
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
import { VariationDimensionsForm } from "./criar/VariationDimensionsForm";
import { VariationTaxForm } from "./criar/VariationTaxForm";

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

            {currentStep === 4 && productType === "unico" && (
              <DimensionsForm formData={formData} onInputChange={handleInputChange} />
            )}

            {currentStep === 4 && productType === "variacao" && (
              <VariationDimensionsForm variacoes={variacoes} onVariacoesChange={setVariacoes} />
            )}

            {currentStep === 5 && productType === "unico" && (
              <TaxForm formData={formData} onInputChange={handleInputChange} />
            )}

            {currentStep === 5 && productType === "variacao" && (
              <VariationTaxForm variacoes={variacoes} onVariacoesChange={setVariacoes} />
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
                        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
                          <CardContent className="p-8 text-center">
                            <Link className="w-20 h-20 text-primary mx-auto mb-6" />
                            <h4 className="text-xl font-semibold mb-3">Vincular Anúncio</h4>
                            <p className="text-gray-600">
                              Conecte este produto a anúncios existentes nos marketplaces
                            </p>
                          </CardContent>
                        </Card>
                      </DrawerTrigger>
                      <DrawerContent className="max-h-[80vh]">
                        <DrawerHeader>
                          <DrawerTitle>Vincular Anúncio</DrawerTitle>
                          <DrawerDescription>
                            {productType === "variacao" 
                              ? "Selecione os anúncios existentes para vincular às variações deste produto"
                              : "Selecione os anúncios existentes para vincular a este produto"
                            }
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="p-6 overflow-y-auto">
                          <div className="space-y-6">
                            {/* Filtros */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                              <div>
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
                              <div>
                                <Label>Pesquisar</Label>
                                <Input placeholder="Buscar por SKU, ID ou descrição..." className="mt-2" />
                              </div>
                            </div>
                            
                            {productType === "variacao" && variacoes.length > 0 && (
                              <div>
                                <Label className="text-base font-medium">Vincular por Variação</Label>
                                <div className="mt-4 space-y-3">
                                  {variacoes.map((variacao) => (
                                    <Card key={variacao.id} className="p-4">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                          {variacao.cor && (
                                            <div
                                              className="w-8 h-8 rounded-full border-2 border-gray-300"
                                              style={{ backgroundColor: variacao.cor.toLowerCase() }}
                                            />
                                          )}
                                          <div>
                                            <span className="font-medium">{variacao.nome}</span>
                                            <p className="text-sm text-gray-500">SKU: {variacao.sku}</p>
                                          </div>
                                        </div>
                                        <Select>
                                          <SelectTrigger className="w-64">
                                            <SelectValue placeholder="Selecione anúncio" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="anuncio1">Produto Similar - ML123456</SelectItem>
                                            <SelectItem value="anuncio2">Produto Teste - AMZ789012</SelectItem>
                                            <SelectItem value="anuncio3">Produto Exemplo - SHP345678</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="border rounded-lg p-8 bg-gray-50">
                              <div className="text-center">
                                <p className="text-gray-500 mb-4">
                                  Selecione um marketplace e faça uma pesquisa para encontrar anúncios
                                </p>
                                <Button variant="outline" className="text-blue-600 border-blue-200">
                                  Buscar Anúncios
                                </Button>
                              </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                              <Button variant="outline" className="flex-1">
                                Cancelar
                              </Button>
                              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                                Confirmar Vínculos
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>

                    {/* Card 2: Criar Anúncio */}
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
                      onClick={() => navigate('/anuncios')}
                    >
                      <CardContent className="p-8 text-center">
                        <ExternalLink className="w-20 h-20 text-primary mx-auto mb-6" />
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
