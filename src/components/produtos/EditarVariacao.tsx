
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StepIndicator } from "./criar/StepIndicator";
import { ProductForm } from "./criar/ProductForm";
import { VariationForm } from "./criar/VariationForm";
import { VariationDimensionsForm } from "./criar/VariationDimensionsForm";
import { VariationTaxForm } from "./criar/VariationTaxForm";
import { NavigationButtons } from "./criar/NavigationButtons";
import { CloseConfirmationDialog } from "./criar/CloseConfirmationDialog";
import { stepsVariacoes } from "./criar/constants";
import { FormData, Variacao, TipoVariacao } from "./criar/types";

export function EditarVariacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [variationEtapa, setVariationEtapa] = useState<"tipos" | "opcoes" | "configuracao">("tipos");
  const [tiposVariacao, setTiposVariacao] = useState<TipoVariacao[]>([]);
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    tipo: "variacao",
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
    // TODO: Carregar dados da variação do backend usando o id
    console.log("Carregando dados da variação:", id);
  }, [id]);

  const nextStep = () => {
    if (currentStep < 5) {
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
    console.log("Salvando variação:", formData);
    navigate('/produtos/variacoes');
  };

  const handleCloseRequest = () => {
    setShowCloseDialog(true);
  };

  const handleConfirmClose = () => {
    navigate('/produtos/variacoes');
  };

  const handleVariationNext = () => {
    if (variationEtapa === "tipos") {
      if (tiposVariacao.length > 0) {
        setVariationEtapa("opcoes");
      }
    } else if (variationEtapa === "opcoes") {
      const hasOptions = tiposVariacao.some(tipo => tipo.opcoes.length > 0);
      if (hasOptions) {
        setVariationEtapa("configuracao");
      }
    } else if (variationEtapa === "configuracao") {
      nextStep();
    }
  };

  const handleVariationBack = () => {
    if (variationEtapa === "opcoes") {
      setVariationEtapa("tipos");
    } else if (variationEtapa === "configuracao") {
      setVariationEtapa("opcoes");
    } else if (variationEtapa === "tipos") {
      backStep();
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/produtos/variacoes')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Produto com Variações</h1>
              <p className="text-gray-600 text-lg">Edite as informações do seu produto</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCloseRequest}>
            <X className="w-5 h-5 mr-2" />
            Fechar
          </Button>
        </div>

        {/* Stepper */}
        <StepIndicator steps={stepsVariacoes} currentStep={currentStep} />

        {/* Step Content */}
        <Card className="shadow-lg">
          <CardContent className="p-10">
            {currentStep === 1 && (
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

            {currentStep === 2 && (
              <VariationForm 
                variacoes={variacoes} 
                onVariacoesChange={setVariacoes}
                etapaAtual={variationEtapa}
                onEtapaChange={setVariationEtapa}
                tiposVariacao={tiposVariacao}
                onTiposVariacaoChange={setTiposVariacao}
              />
            )}

            {currentStep === 3 && (
              <VariationDimensionsForm 
                variacoes={variacoes} 
                onVariacoesChange={setVariacoes} 
              />
            )}

            {currentStep === 4 && (
              <VariationTaxForm 
                variacoes={variacoes} 
                onVariacoesChange={setVariacoes} 
              />
            )}

            {currentStep === 5 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Vincular Anúncios</h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    Produto atualizado com sucesso! Você pode vincular ou criar novos anúncios.
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
          maxSteps={5}
          productType="variacao"
          variationEtapa={variationEtapa}
          canProceedVariation={canProceedVariation}
          onNext={currentStep === 2 ? handleVariationNext : nextStep}
          onBack={currentStep === 2 ? handleVariationBack : backStep}
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
