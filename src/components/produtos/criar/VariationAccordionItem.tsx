
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Variacao } from "./types";
import { VariationImageUpload } from "./VariationImageUpload";
import { VariationDetailsForm } from "./VariationDetailsForm";

interface VariationAccordionItemProps {
  variacao: Variacao;
  onImageUpload: (variacaoId: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (variacaoId: string, imageIndex: number) => void;
  onUpdate: (variacaoId: string, field: string, value: string) => void;
}

export function VariationAccordionItem({ 
  variacao, 
  onImageUpload, 
  onRemoveImage, 
  onUpdate 
}: VariationAccordionItemProps) {
  return (
    <AccordionItem value={variacao.id} className="border rounded-lg">
      <AccordionTrigger className="px-6 hover:no-underline">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            {variacao.cor && (
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: variacao.cor.toLowerCase() }}
              />
            )}
            <span className="font-medium text-left">{variacao.nome}</span>
          </div>
          <div className="text-sm text-gray-500">
            {variacao.imagens?.length || 0}/8 fotos
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <div className="space-y-6">
          <VariationImageUpload
            variacao={variacao}
            onImageUpload={onImageUpload}
            onRemoveImage={onRemoveImage}
          />
          <VariationDetailsForm
            variacao={variacao}
            onUpdate={onUpdate}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
