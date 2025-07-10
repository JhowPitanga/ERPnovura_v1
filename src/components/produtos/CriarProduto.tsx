import { useState } from "react";
import { X, Link, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useCreateProduct, CreateProductData } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";

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
import { FormData, Variacao, TipoVariacao } from "./criar/types";
import { VariationDimensionsForm } from "./criar/VariationDimensionsForm";
import { VariationTaxForm } from "./criar/VariationTaxForm";

export function CriarProduto() {
  const navigate = useNavigate();
  const { createProduct, loading: createLoading } = useCreateProduct();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [productType, setProductType] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [productSaved, setProductSaved] = useState(false);
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  
  // New state for variation form
  const [variationEtapa, setVariationEtapa] = useState<"tipos" | "opcoes" | "configuracao">("tipos");
  const [tiposVariacao, setTiposVariacao] = useState<TipoVariacao[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    tipo: "",
    nome: "",
    sku: "",
    categoria: "",
    marca: "",
    descricao: "",
    precoCusto: "",
    precoVenda: "",
    estoque: "",
    armazem: "",
    altura: "",
    largura: "",
    comprimento: "",
    peso: "",
    tipoUnidade: "",
    codigoBarras: "",
    ncm: "",
    cest: "",
    origem: "",
  });

  const getCurrentSteps = () => {
    return productType === "variacao" ? stepsVariacoes : stepsUnico;
  };

  const getMaxSteps = () => {
    return 6;
  };

  const nextStep = async () => {
    if (currentStep < getMaxSteps()) {
      if (currentStep === 5 && !productSaved) {
        await handleCreateProduct();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleCreateProduct = async () => {
    try {
      // Validate required fields
      if (!formData.nome || !formData.sku || !formData.precoCusto || !formData.ncm || !formData.origem) {
        console.log(formData);
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        });
        return;
      }

      // Convert form data to the format expected by the database
      const productData: CreateProductData = {
        name: formData.nome,
        sku: formData.sku,
        type: getProductTypeForDB(productType),
        description: formData.descricao || undefined,
        cost_price: parseFloat(formData.precoCusto),
        sell_price: formData.precoVenda ? parseFloat(formData.precoVenda) : undefined,
        barcode: parseInt(formData.codigoBarras) || 0,
        ncm: parseInt(formData.ncm),
        cest: formData.cest ? parseInt(formData.cest) : undefined,
        package_height: parseInt(formData.altura) || 0,
        package_width: parseInt(formData.largura) || 0,
        package_length: parseInt(formData.comprimento) || 0,
        weight: formData.peso ? parseFloat(formData.peso) : undefined,
        weight_type: formData.tipoUnidade || undefined,
        tax_origin_code: parseInt(formData.origem),
        category_id: formData.categoria || undefined,
        brand_id: undefined, // TODO: Add brand support
        color: undefined,
        size: undefined,
        image_urls: [], // TODO: Handle image uploads
        custom_attributes: undefined,
        stock_current: formData.estoque ? parseInt(formData.estoque) : undefined,
        storage_id: formData.armazem || undefined,
      };

      await createProduct(productData);
      setProductSaved(true);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const getProductTypeForDB = (type: string): 'UNICO' | 'VARIANT' | 'ITEM' => {
    switch (type) {
      case 'unico':
        return 'UNICO';
      case 'variacao':
        return 'VARIANT';
      case 'kit':
        return 'ITEM';
      default:
        return 'UNICO';
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

  // New handlers for variation navigation
  const handleVariationNext = () => {
    if (variationEtapa === "tipos") {
      if (tiposVariacao.length > 0) {
        setVariationEtapa("opcoes");
      }
    } else if (variationEtapa === "opcoes") {
      // Check if we have options to generate variations
      const hasOptions = tiposVariacao.some(tipo => tipo.opcoes.length > 0);
      if (hasOptions) {
        // Generate variations and move to configuration
        generateVariations();
        setVariationEtapa("configuracao");
      }
    } else if (variationEtapa === "configuracao") {
      // Move to next main step (step 4)
      nextStep();
    }
  };

  const handleVariationBack = () => {
    if (variationEtapa === "opcoes") {
      setVariationEtapa("tipos");
    } else if (variationEtapa === "configuracao") {
      setVariationEtapa("opcoes");
    } else if (variationEtapa === "tipos") {
      // Go back to previous main step (step 2)
      backStep();
    }
  };

  const generateVariations = () => {
    const tiposComOpcoes = tiposVariacao.filter(tipo => tipo.opcoes.length > 0);
    
    if (tiposComOpcoes.length === 0) return;

    const gerarCombinacoes = (arrays: string[][]): string[][] => {
      if (arrays.length === 0) return [[]];
      if (arrays.length === 1) return arrays[0].map(item => [item]);
      
      const [first, ...rest] = arrays;
      const restCombinations = gerarCombinacoes(rest);
      
      return first.flatMap(item =>
        restCombinations.map(combination => [item, ...combination])
      );
    };

    const opcoesPorTipo = tiposComOpcoes.map(tipo => tipo.opcoes);
    const combinacoes = gerarCombinacoes(opcoesPorTipo);

    const novasVariacoes: Variacao[] = combinacoes.map((combinacao, index) => {
      const nomeVariacao = combinacao.join(" - ");
      const variacao: Variacao = {
        id: `var_${Date.now()}_${index}`,
        nome: nomeVariacao,
        sku: "",
        ean: "",
        precoCusto: "",
        imagens: [],
      };

      tiposComOpcoes.forEach((tipo, tipoIndex) => {
        const valor = combinacao[tipoIndex];
        switch (tipo.id) {
          case "cor":
            variacao.cor = valor;
            break;
          case "tamanho":
            variacao.tamanho = valor;
            break;
          case "voltagem":
            variacao.voltagem = valor;
            break;
          default:
            variacao.tipoPersonalizado = tipo.nome;
            variacao.valorPersonalizado = valor;
            break;
        }
      });

      return variacao;
    });

    setVariacoes(novasVariacoes);
  };

  const canProceedVariation = () => {
    if (variationEtapa === "tipos") {
      return tiposVariacao.length > 0;
    }
    if (variationEtapa === "opcoes") {
      return tiposVariacao.some(tipo => tipo.opcoes.length > 0);
    }
    if (variationEtapa === "configuracao") {
      return variacoes.length > 0;
    }
    return true;
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
              <VariationForm 
                variacoes={variacoes} 
                onVariacoesChange={setVariacoes}
                etapaAtual={variationEtapa}
                onEtapaChange={setVariationEtapa}
                tiposVariacao={tiposVariacao}
                onTiposVariacaoChange={setTiposVariacao}
              />
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
          variationEtapa={variationEtapa}
          canProceedVariation={canProceedVariation}
          loading={createLoading}
          onNext={currentStep === 3 && productType === "variacao" ? handleVariationNext : nextStep}
          onBack={currentStep === 3 && productType === "variacao" ? handleVariationBack : backStep}
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
