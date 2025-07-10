
import { ProductVariation, VariationType, VariationStep } from "@/types/products";
import { VariationTypeSelector } from "@/components/produtos/criar/VariationTypeSelector";
import { VariationOptionsForm } from "@/components/produtos/criar/VariationOptionsForm";
import { VariationDetailsForm } from "@/components/produtos/criar/VariationDetailsForm";

interface VariationFormProps {
  variations: ProductVariation[];
  onVariationsChange: (variations: ProductVariation[]) => void;
  currentStep: VariationStep;
  onStepChange: (step: VariationStep) => void;
  variationTypes: VariationType[];
  onVariationTypesChange: (types: VariationType[]) => void;
}

export function VariationForm({
  variations,
  onVariationsChange,
  currentStep,
  onStepChange,
  variationTypes,
  onVariationTypesChange
}: VariationFormProps) {
  // Convert between English and Portuguese types for compatibility with existing components
  const convertVariationsToPT = (variations: ProductVariation[]) => {
    return variations.map(variation => ({
      id: variation.id,
      nome: variation.name,
      cor: variation.color,
      tamanho: variation.size,
      voltagem: variation.voltage,
      tipoPersonalizado: variation.customType,
      valorPersonalizado: variation.customValue,
      sku: variation.sku,
      ean: variation.ean,
      precoCusto: variation.costPrice,
      imagens: variation.images,
      altura: variation.height,
      largura: variation.width,
      comprimento: variation.length,
      peso: variation.weight,
      ncm: variation.ncm,
      cest: variation.cest,
      codigoBarras: variation.barcode,
      unidade: variation.unit,
      origem: variation.origin,
    }));
  };

  const convertVariationsFromPT = (variations: any[]) => {
    return variations.map(variation => ({
      id: variation.id,
      name: variation.nome,
      color: variation.cor,
      size: variation.tamanho,
      voltage: variation.voltagem,
      customType: variation.tipoPersonalizado,
      customValue: variation.valorPersonalizado,
      sku: variation.sku,
      ean: variation.ean,
      costPrice: variation.precoCusto,
      images: variation.imagens,
      height: variation.altura,
      width: variation.largura,
      length: variation.comprimento,
      weight: variation.peso,
      ncm: variation.ncm,
      cest: variation.cest,
      barcode: variation.codigoBarras,
      unit: variation.unidade,
      origin: variation.origem,
    }));
  };

  const convertTypesToPT = (types: VariationType[]) => {
    return types.map(type => ({
      id: type.id,
      nome: type.name,
      icon: type.icon,
      opcoes: type.options,
    }));
  };

  const convertTypesFromPT = (types: any[]) => {
    return types.map(type => ({
      id: type.id,
      name: type.nome,
      icon: type.icon,
      options: type.opcoes,
    }));
  };

  const convertStepToPT = (step: VariationStep) => {
    switch (step) {
      case "types": return "tipos";
      case "options": return "opcoes";
      case "configuration": return "configuracao";
      default: return "tipos";
    }
  };

  const convertStepFromPT = (step: string) => {
    switch (step) {
      case "tipos": return "types" as VariationStep;
      case "opcoes": return "options" as VariationStep;
      case "configuracao": return "configuration" as VariationStep;
      default: return "types" as VariationStep;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-6">Product Variations</h3>
        
        {currentStep === "types" && (
          <VariationTypeSelector
            tiposVariacao={convertTypesToPT(variationTypes)}
            onTiposVariacaoChange={(types) => onVariationTypesChange(convertTypesFromPT(types))}
          />
        )}

        {currentStep === "options" && (
          <VariationOptionsForm
            tiposVariacao={convertTypesToPT(variationTypes)}
            onTiposVariacaoChange={(types) => onVariationTypesChange(convertTypesFromPT(types))}
          />
        )}

        {currentStep === "configuration" && (
          <VariationDetailsForm
            variacoes={convertVariationsToPT(variations)}
            onVariacoesChange={(variations) => onVariationsChange(convertVariationsFromPT(variations))}
          />
        )}
      </div>
    </div>
  );
}
