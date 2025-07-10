
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { StepIndicator } from "./criar/StepIndicator";
import { ProductForm } from "./criar/ProductForm";
import { VariationForm } from "./criar/VariationForm";
import { VariationDimensionsForm } from "./criar/VariationDimensionsForm";
import { VariationTaxForm } from "./criar/VariationTaxForm";
import { NavigationButtons } from "./criar/NavigationButtons";
import { stepsVariacoes } from "./criar/constants";
import { FormData, Variacao, TipoVariacao } from "./criar/types";

interface EditarVariacaoAccordionProps {
  produtoId: string;
  produtoNome: string;
}

export function EditarVariacaoAccordion({ produtoId, produtoNome }: EditarVariacaoAccordionProps) {
  const [currentStep, setCurrentStep] = useState(1);
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
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-lg mb-4">Editar Produto: {produtoNome}</h4>
      </div>

      {/* Stepper */}
      <StepIndicator steps={stepsVariacoes} currentStep={currentStep} />

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
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
                <h3 className="text-lg font-semibold mb-4">Vincular Anúncios</h3>
                <p className="text-gray-600 mb-6">
                  Produto atualizado com sucesso! Você pode vincular ou criar novos anúncios.
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
        maxSteps={5}
        productType="variacao"
        variationEtapa={variationEtapa}
        canProceedVariation={canProceedVariation}
        onNext={currentStep === 2 ? handleVariationNext : nextStep}
        onBack={currentStep === 2 ? handleVariationBack : backStep}
        onSave={handleSave}
      />
    </div>
  );
}
