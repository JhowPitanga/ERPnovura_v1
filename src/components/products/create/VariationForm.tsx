
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

  const handleVariationUpdate = (variacaoId: string, field: string, value: string) => {
    const updatedVariations = variations.map(variation => {
      if (variation.id === variacaoId) {
        return { ...variation, [field]: value };
      }
      return variation;
    });
    onVariationsChange(updatedVariations);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-6">Product Variations</h3>
        
        {currentStep === "types" && (
          <VariationTypeSelector
            tiposSelecionados={convertTypesToPT(variationTypes)}
            onTiposChange={(types) => onVariationTypesChange(convertTypesFromPT(types))}
          />
        )}

        {currentStep === "options" && (
          <VariationOptionsForm
            tiposVariacao={convertTypesToPT(variationTypes)}
            onTiposChange={(types) => onVariationTypesChange(convertTypesFromPT(types))}
            onVariacoesGenerate={() => {
              // Generate variations logic would go here
              console.log("Generate variations");
            }}
          />
        )}

        {currentStep === "configuration" && (
          <div className="space-y-6">
            {variations.map((variation) => (
              <div key={variation.id} className="border rounded-lg p-4">
                <h4 className="font-medium mb-4">{variation.name}</h4>
                <VariationDetailsForm
                  variacao={convertVariationsToPT([variation])[0]}
                  onUpdate={(variacaoId, field, value) => {
                    // Convert field names back to English
                    const fieldMap: Record<string, string> = {
                      sku: 'sku',
                      ean: 'ean',
                      precoCusto: 'costPrice'
                    };
                    const englishField = fieldMap[field] || field;
                    handleVariationUpdate(variacaoId, englishField, value);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
