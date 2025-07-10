
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StepIndicator } from "./criar/StepIndicator";
import { KitForm } from "./criar/KitForm";
import { NavigationButtons } from "./criar/NavigationButtons";
import { FormData } from "./criar/types";

interface KitItem {
  id: string;
  name: string;
  sku: string;
  type: "unico" | "variacao";
  quantidade: number;
  image?: string;
}

interface EditarKitAccordionProps {
  kitId: string;
  kitNome: string;
}

const stepsKit = [
  { id: 1, title: "Informações", description: "Dados básicos do KIT" },
  { id: 2, title: "Produtos", description: "Produtos do KIT" },
  { id: 3, title: "Anúncios", description: "Vincular ou criar" }
];

export function EditarKitAccordion({ kitId, kitNome }: EditarKitAccordionProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [etapaAtual, setEtapaAtual] = useState<"info" | "produtos">("info");
  const [kitItems, setKitItems] = useState<KitItem[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    tipo: "kit",
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

  const nextStep = () => {
    if (currentStep < 3) {
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

  const handleSave = () => {
    console.log("Salvando kit:", formData, kitItems);
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-lg mb-4">Editar KIT: {kitNome}</h4>
      </div>

      {/* Stepper */}
      <StepIndicator steps={stepsKit} currentStep={currentStep} />

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 1 && (
            <KitForm
              formData={formData}
              onInputChange={handleInputChange}
              etapaAtual="info"
              onEtapaChange={setEtapaAtual}
              kitItems={kitItems}
              onKitItemsChange={setKitItems}
            />
          )}

          {currentStep === 2 && (
            <KitForm
              formData={formData}
              onInputChange={handleInputChange}
              etapaAtual="produtos"
              onEtapaChange={setEtapaAtual}
              kitItems={kitItems}
              onKitItemsChange={setKitItems}
            />
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Vincular Anúncios</h3>
                <p className="text-gray-600 mb-6">
                  KIT atualizado com sucesso! Você pode vincular ou criar novos anúncios.
                </p>
                
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">Interface de vínculo de anúncios será implementada aqui</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <NavigationButtons
        currentStep={currentStep}
        maxSteps={3}
        productType="kit"
        onNext={nextStep}
        onBack={backStep}
        onSave={handleSave}
      />
    </div>
  );
}
