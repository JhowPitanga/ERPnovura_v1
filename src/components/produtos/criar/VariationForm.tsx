
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Variacao, TipoVariacao } from "./types";
import { VariationTypeSelector } from "./VariationTypeSelector";
import { VariationOptionsForm } from "./VariationOptionsForm";
import { VariationAccordionItem } from "./VariationAccordionItem";

interface VariationFormProps {
  variacoes: Variacao[];
  onVariacoesChange: (variacoes: Variacao[]) => void;
}

export function VariationForm({ variacoes, onVariacoesChange }: VariationFormProps) {
  const [etapa, setEtapa] = useState<"tipos" | "opcoes" | "configuracao">("tipos");
  const [tiposVariacao, setTiposVariacao] = useState<TipoVariacao[]>([]);

  const handleImageUpload = (variacaoId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const variacaoAtual = variacoes.find(v => v.id === variacaoId);
    
    if (variacaoAtual) {
      const imagensAtuais = variacaoAtual.imagens || [];
      const remainingSlots = 8 - imagensAtuais.length;
      const filesToAdd = files.slice(0, remainingSlots);
      
      onVariacoesChange(variacoes.map(v => 
        v.id === variacaoId 
          ? { ...v, imagens: [...imagensAtuais, ...filesToAdd] }
          : v
      ));
    }
  };

  const removeImage = (variacaoId: string, imageIndex: number) => {
    onVariacoesChange(variacoes.map(v => 
      v.id === variacaoId 
        ? { ...v, imagens: v.imagens.filter((_, i) => i !== imageIndex) }
        : v
    ));
  };

  const updateVariacao = (variacaoId: string, field: string, value: string) => {
    onVariacoesChange(variacoes.map(v => 
      v.id === variacaoId ? { ...v, [field]: value } : v
    ));
  };

  // Check if we can proceed to next step based on current etapa
  const canProceed = () => {
    if (etapa === "tipos") {
      return tiposVariacao.length > 0;
    }
    if (etapa === "opcoes") {
      const totalOpcoes = tiposVariacao.reduce((total, tipo) => total + tipo.opcoes.length, 0);
      return totalOpcoes > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (etapa === "tipos" && canProceed()) {
      setEtapa("opcoes");
    } else if (etapa === "opcoes" && canProceed()) {
      // Generate variations when moving from options to configuration
      const tiposComOpcoes = tiposVariacao.filter(tipo => tipo.opcoes.length > 0);
      
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

      const opcoesPorTipo = tiposComOpcoes.map(tipo => tipo.opcoes);
      const combinacoes = gerarCombinacoes(opcoesPorTipo);

      const variacoes: Variacao[] = combinacoes.map((combinacao, index) => {
        const nomeVariacao = combinacao.join(" - ");
        const variacao: Variacao = {
          id: `var_${Date.now()}_${index}`,
          nome: nomeVariacao,
          sku: "",
          ean: "",
          precoCusto: "",
          imagens: [],
        };

        tiposComOpcoes.forEach((tipo, tipoIndex) => {
          const valor = combinacao[tipoIndex];
          switch (tipo.id) {
            case "cor":
              variacao.cor = valor;
              break;
            case "tamanho":
              variacao.tamanho = valor;
              break;
            case "voltagem":
              variacao.voltagem = valor;
              break;
            default:
              variacao.tipoPersonalizado = tipo.nome;
              variacao.valorPersonalizado = valor;
              break;
          }
        });

        return variacao;
      });

      onVariacoesChange(variacoes);
      setEtapa("configuracao");
    }
  };

  const handleBack = () => {
    if (etapa === "opcoes") {
      setEtapa("tipos");
    } else if (etapa === "configuracao") {
      setEtapa("opcoes");
    }
  };

  // Expose these functions to be called by NavigationButtons
  // We'll use a ref or callback pattern in the parent component
  if (typeof window !== 'undefined') {
    (window as any).variationFormHandlers = {
      canProceed,
      handleNext,
      handleBack,
      currentStep: etapa
    };
  }

  if (etapa === "tipos") {
    return (
      <VariationTypeSelector
        tiposSelecionados={tiposVariacao}
        onTiposChange={setTiposVariacao}
        onNext={handleNext}
      />
    );
  }

  if (etapa === "opcoes") {
    return (
      <VariationOptionsForm
        tiposVariacao={tiposVariacao}
        onTiposChange={setTiposVariacao}
        onVariacoesGenerate={onVariacoesChange}
        onNext={handleNext}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">Configurar Variações</h3>
          <p className="text-gray-600">Configure as fotos, SKU e códigos de barras para cada variação</p>
        </div>
        <Button variant="outline" onClick={() => setEtapa("opcoes")}>
          Editar variações
        </Button>
      </div>

      {variacoes.length > 0 && (
        <Accordion type="single" collapsible className="space-y-4">
          {variacoes.map((variacao) => (
            <VariationAccordionItem
              key={variacao.id}
              variacao={variacao}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeImage}
              onUpdate={updateVariacao}
            />
          ))}
        </Accordion>
      )}
    </div>
  );
}
