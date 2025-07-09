
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  currentStep: number;
  maxSteps: number;
  productType: string;
  onNext: () => void;
  onSave: () => void;
}

export function NavigationButtons({ 
  currentStep, 
  maxSteps, 
  productType, 
  onNext, 
  onSave 
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-end items-center pt-4">
      {currentStep < 4 ? (
        <Button 
          onClick={onNext} 
          className="bg-novura-primary hover:bg-novura-primary/90"
          size="lg"
          disabled={currentStep === 1 && !productType}
        >
          Próximo
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      ) : currentStep === 4 ? (
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
          Finalizar
        </Button>
      )}
    </div>
  );
}
