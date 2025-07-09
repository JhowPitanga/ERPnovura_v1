
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
  return (
    <div className="flex justify-between items-center pt-4">
      {/* Back Button - Only show after step 1 */}
      {currentStep > 1 && (
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
          disabled={currentStep === 1 && !productType}
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
