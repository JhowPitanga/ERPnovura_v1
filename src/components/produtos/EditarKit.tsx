
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StepIndicator } from "./criar/StepIndicator";
import { KitForm } from "./criar/KitForm";
import { NavigationButtons } from "./criar/NavigationButtons";
import { CloseConfirmationDialog } from "./criar/CloseConfirmationDialog";
import { FormData } from "./criar/types";

interface KitItem {
  id: string;
  name: string;
  sku: string;
  type: "unico" | "variacao";
  quantidade: number;
  image?: string;
}

const stepsKit = [
  { id: 1, title: "Informações", description: "Dados básicos do KIT" },
  { id: 2, title: "Produtos", description: "Produtos do KIT" },
  { id: 3, title: "Anúncios", description: "Vincular ou criar" }
];

export function EditarKit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
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

  useEffect(() => {
    // TODO: Carregar dados do kit do backend usando o id
    console.log("Carregando dados do kit:", id);
  }, [id]);

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
    navigate('/produtos/kits');
  };

  const handleCloseRequest = () => {
    setShowCloseDialog(true);
  };

  const handleConfirmClose = () => {
    navigate('/produtos/kits');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/produtos/kits')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar KIT</h1>
              <p className="text-gray-600 text-lg">Edite as informações do seu KIT</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCloseRequest}>
            <X className="w-5 h-5 mr-2" />
            Fechar
          </Button>
        </div>

        {/* Stepper */}
        <StepIndicator steps={stepsKit} currentStep={currentStep} />

        {/* Step Content */}
        <Card className="shadow-lg">
          <CardContent className="p-10">
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
                  <h3 className="text-xl font-semibold mb-6">Vincular Anúncios</h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    KIT atualizado com sucesso! Você pode vincular ou criar novos anúncios.
                  </p>
                  
                  {/* TODO: Implementar interface de vínculo de anúncios */}
                  <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
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
