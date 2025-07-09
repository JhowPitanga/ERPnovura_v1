
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  currentStep: number;
  maxSteps: number;
  productType: string;
  onNext: () => void;
  onBack: () => void;
  onSave: () => void;
}

export function NavigationButtons({ 
  currentStep, 
  maxSteps, 
  productType, 
  onNext, 
  onBack,
  onSave 
}: NavigationButtonsProps) {
  // Check if we can proceed based on current step and product type
  const canProceed = () => {
    if (currentStep === 1 && !productType) return false;
    
    // For variation products in step 3, check if we can proceed through variation form
    if (currentStep === 3 && productType === "variacao") {
      const handlers = (window as any).variationFormHandlers;
      return handlers ? handlers.canProceed() : false;
    }
    
    return true;
  };

  const handleNext = () => {
    // For variation products in step 3, use the variation form's handler
    if (currentStep === 3 && productType === "variacao") {
      const handlers = (window as any).variationFormHandlers;
      if (handlers && handlers.currentStep !== "configuracao") {
        handlers.handleNext();
        return;
      }
    }
    
    onNext();
  };

  const handleBack = () => {
    // For variation products in step 3, use the variation form's handler if not on first sub-step
    if (currentStep === 3 && productType === "variacao") {
      const handlers = (window as any).variationFormHandlers;
      if (handlers && handlers.currentStep !== "tipos") {
        handlers.handleBack();
        return;
      }
    }
    
    onBack();
  };

  return (
    <div className="flex justify-between items-center pt-4">
      {/* Back Button - Only show after step 1 or when in variation sub-steps */}
      {(currentStep > 1 || (currentStep === 3 && productType === "variacao" && (window as any).variationFormHandlers?.currentStep !== "tipos")) && (
        <Button 
          onClick={handleBack} 
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
          onClick={handleNext} 
          className="bg-novura-primary hover:bg-novura-primary/90"
          size="lg"
          disabled={!canProceed()}
        >
          Próximo
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      ) : currentStep === 5 ? (
        <Button 
          onClick={onNext} 
          className="bg-green-600 hover:bg-green-700"
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
