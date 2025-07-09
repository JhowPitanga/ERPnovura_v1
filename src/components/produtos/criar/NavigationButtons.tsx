
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
    if (currentStep === 1) return false;
    
    // For variation step 3, show back button unless we're on the first sub-step
    if (currentStep === 3 && productType === "variacao") {
      return variationEtapa !== "tipos";
    }
    
    return currentStep > 1;
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
