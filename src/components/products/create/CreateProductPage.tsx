
import { X, Link, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Import components
import { StepIndicator } from "@/components/produtos/criar/StepIndicator";
import { ProductTypeSelector } from "./ProductTypeSelector";
import { ProductForm } from "@/components/produtos/criar/ProductForm";
import { ImageUpload } from "@/components/produtos/criar/ImageUpload";
import { VariationForm } from "./VariationForm";
import { KitForm } from "./KitForm";
import { VariationDimensionsForm } from "./VariationDimensionsForm";
import { VariationTaxForm } from "./VariationTaxForm";
import { ProductLinkingSection } from "./ProductLinkingSection";
import { StockForm } from "@/components/produtos/criar/StockForm";
import { DimensionsForm } from "@/components/produtos/criar/DimensionsForm";
import { TaxForm } from "@/components/produtos/criar/TaxForm";
import { NavigationButtons } from "@/components/produtos/criar/NavigationButtons";
import { CloseConfirmationDialog } from "@/components/produtos/criar/CloseConfirmationDialog";

// Import constants and hooks
import { stepsUnico, stepsVariacoes, stepsKit } from "@/components/produtos/criar/constants";
import { useProductForm } from "@/hooks/useProductForm";

export function CreateProductPage() {
  const navigate = useNavigate();
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const {
    currentStep,
    productType,
    selectedImages,
    productSaved,
    variations,
    variationStep,
    variationTypes,
    kitStep,
    kitItems,
    formData,
    createLoading,
    setSelectedImages,
    setVariations,
    setVariationStep,
    setVariationTypes,
    setKitItems,
    nextStep,
    backStep,
    handleInputChange,
    handleProductTypeChange,
    getMaxSteps,
  } = useProductForm({
    onSuccess: () => console.log("Product created successfully!")
  });

  const getCurrentSteps = () => {
    if (productType === "variation") return stepsVariacoes;
    if (productType === "kit") return stepsKit;
    return stepsUnico;
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

  // Variation navigation handlers
  const handleVariationNext = () => {
    if (variationStep === "types") {
      if (variationTypes.length > 0) {
        setVariationStep("options");
      }
    } else if (variationStep === "options") {
      const hasOptions = variationTypes.some(tipo => tipo.options.length > 0);
      if (hasOptions) {
        generateVariations();
        setVariationStep("configuration");
      }
    } else if (variationStep === "configuration") {
      nextStep();
    }
  };

  const handleVariationBack = () => {
    if (variationStep === "options") {
      setVariationStep("types");
    } else if (variationStep === "configuration") {
      setVariationStep("options");
    } else if (variationStep === "types") {
      backStep();
    }
  };

  const generateVariations = () => {
    const tiposComOpcoes = variationTypes.filter(tipo => tipo.options.length > 0);
    
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

    const opcoesPorTipo = tiposComOpcoes.map(tipo => tipo.options);
    const combinacoes = gerarCombinacoes(opcoesPorTipo);

    const newVariations = combinacoes.map((combinacao, index) => {
      const variationName = combinacao.join(" - ");
      const variation: any = {
        id: `var_${Date.now()}_${index}`,
        name: variationName,
        sku: "",
        ean: "",
        costPrice: "",
        images: [],
      };

      tiposComOpcoes.forEach((tipo, tipoIndex) => {
        const valor = combinacao[tipoIndex];
        switch (tipo.id) {
          case "cor":
            variation.color = valor;
            break;
          case "tamanho":
            variation.size = valor;
            break;
          case "voltagem":
            variation.voltage = valor;
            break;
          default:
            variation.customType = tipo.name;
            variation.customValue = valor;
            break;
        }
      });

      return variation;
    });

    setVariations(newVariations);
  };

  const canProceedVariation = () => {
    if (variationStep === "types") {
      return variationTypes.length > 0;
    }
    if (variationStep === "options") {
      return variationTypes.some(tipo => tipo.options.length > 0);
    }
    if (variationStep === "configuration") {
      return variations.length > 0;
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
            <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
            <p className="text-gray-600 text-lg">Follow the steps to register your product</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCloseRequest}>
            <X className="w-5 h-5 mr-2" />
            Close
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

            {currentStep === 2 && productType === "single" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Main Information</h3>
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

            {currentStep === 2 && productType === "variation" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Basic Information</h3>
                  <ProductForm 
                    formData={formData} 
                    onInputChange={handleInputChange} 
                    includeSku={false} 
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && productType === "kit" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Kit Information</h3>
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

            {currentStep === 3 && productType === "single" && (
              <StockForm formData={formData} onInputChange={handleInputChange} />
            )}

            {currentStep === 3 && productType === "variation" && (
              <VariationForm 
                variations={variations} 
                onVariationsChange={setVariations}
                currentStep={variationStep}
                onStepChange={setVariationStep}
                variationTypes={variationTypes}
                onVariationTypesChange={setVariationTypes}
              />
            )}

            {currentStep === 3 && productType === "kit" && (
              <KitForm 
                formData={formData} 
                onInputChange={handleInputChange}
                currentStep={kitStep}
                onStepChange={() => {}} // Will be implemented properly later
                kitItems={kitItems}
                onKitItemsChange={setKitItems}
                selectedImages={selectedImages}
                onImagesChange={setSelectedImages}
              />
            )}

            {currentStep === 4 && productType === "single" && (
              <DimensionsForm formData={formData} onInputChange={handleInputChange} />
            )}

            {currentStep === 4 && productType === "variation" && (
              <VariationDimensionsForm variations={variations} onVariationsChange={setVariations} />
            )}

            {currentStep === 5 && productType === "single" && (
              <TaxForm formData={formData} onInputChange={handleInputChange} />
            )}

            {currentStep === 5 && productType === "variation" && (
              <VariationTaxForm variations={variations} onVariationsChange={setVariations} />
            )}

            {((currentStep === 6 && productType !== "kit") || (currentStep === 4 && productType === "kit")) && (
              <ProductLinkingSection 
                productType={productType} 
                variations={variations}
                onNavigateToAds={() => navigate('/anuncios')}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <NavigationButtons
          currentStep={currentStep}
          maxSteps={getMaxSteps()}
          productType={productType as string}
          variationEtapa={variationStep}
          canProceedVariation={canProceedVariation}
          loading={createLoading}
          onNext={currentStep === 3 && productType === "variation" ? handleVariationNext : nextStep}
          onBack={currentStep === 3 && productType === "variation" ? handleVariationBack : backStep}
          kitEtapa={kitStep}
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
