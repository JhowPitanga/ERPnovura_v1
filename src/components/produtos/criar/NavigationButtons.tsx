
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  currentStep: number;
  maxSteps: number;
  productType: string;
  variationEtapa?: "tipos" | "opcoes" | "configuracao";
  canProceedVariation?: () => boolean;
  onNext: () => void;
  onBack: () => void;
  onSave: () => void;
}

export function NavigationButtons({ 
  currentStep, 
  maxSteps, 
  productType, 
  variationEtapa,
  canProceedVariation,
  onNext, 
  onBack,
  onSave 
}: NavigationButtonsProps) {
  // Check if we can proceed based on current step and product type
  const canProceed = () => {
    if (currentStep === 1 && !productType) return false;
    
    // For variation products in step 3, use the specific variation logic
    if (currentStep === 3 && productType === "variacao" && canProceedVariation) {
      return canProceedVariation();
    }
    
    return true;
  };

  // Determine if we should show back button
  const shouldShowBackButton = () => {
    // Always show back button for step 3 variations, even in the first sub-step
    if (currentStep === 3 && productType === "variacao") {
      return true;
    }
    
    return currentStep > 1;
  };

  // Get the next button text based on current state
  const getNextButtonText = () => {
    if (currentStep === 3 && productType === "variacao") {
      if (variationEtapa === "tipos") return "Próximo";
      if (variationEtapa === "opcoes") return "Gerar Variações";
      if (variationEtapa === "configuracao") return "Próximo";
    }
    return "Próximo";
  };

  return (
    <div className="flex justify-between items-center pt-4">
      {/* Back Button */}
      {shouldShowBackButton() && (
        <Button 
          onClick={onBack} 
          variant="outline"
          size="lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
      )}

      <div className="flex-1" />

      {/* Next/Save Buttons */}
      {currentStep < 5 ? (
        <Button 
          onClick={onNext} 
          className="bg-novura-primary hover:bg-novura-primary/90"
          size="lg"
          disabled={!canProceed()}
        >
          {getNextButtonText()}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      ) : currentStep === 5 ? (
        <Button 
          onClick={onNext} 
          className="bg-novura-primary hover:bg-novura-primary/90"
          size="lg"
        >
          <Check className="w-5 h-5 mr-2" />
          Salvar e Continuar
        </Button>
      ) : (
        <Button 
          onClick={onSave} 
          className="bg-novura-primary hover:bg-novura-primary/90"
          size="lg"
        >
          <Check className="w-5 h-5 mr-2" />
          Fazer depois
        </Button>
      )}
    </div>
  );
}
