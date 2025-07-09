
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
  etapaAtual: "tipos" | "opcoes" | "configuracao";
  onEtapaChange: (etapa: "tipos" | "opcoes" | "configuracao") => void;
  tiposVariacao: TipoVariacao[];
  onTiposVariacaoChange: (tipos: TipoVariacao[]) => void;
}

export function VariationForm({ 
  variacoes, 
  onVariacoesChange,
  etapaAtual,
  onEtapaChange,
  tiposVariacao,
  onTiposVariacaoChange
}: VariationFormProps) {
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

  if (etapaAtual === "tipos") {
    return (
      <VariationTypeSelector
        tiposSelecionados={tiposVariacao}
        onTiposChange={onTiposVariacaoChange}
      />
    );
  }

  if (etapaAtual === "opcoes") {
    return (
      <VariationOptionsForm
        tiposVariacao={tiposVariacao}
        onTiposChange={onTiposVariacaoChange}
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
        <Button variant="outline" onClick={() => onEtapaChange("opcoes")}>
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
