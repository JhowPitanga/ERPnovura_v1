
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Variacao } from "./types";

interface VariationDimensionsFormProps {
  variacoes: Variacao[];
  onVariacoesChange: (variacoes: Variacao[]) => void;
}

export function VariationDimensionsForm({ variacoes, onVariacoesChange }: VariationDimensionsFormProps) {
  const updateVariacao = (variacaoId: string, field: string, value: string) => {
    onVariacoesChange(variacoes.map(v => 
      v.id === variacaoId ? { ...v, [field]: value } : v
    ));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-2">Dimensões e Peso por Variação</h3>
        <p className="text-gray-600">Configure as medidas do pacote para cada variação</p>
      </div>

      {variacoes.length > 0 && (
        <Accordion type="single" collapsible className="space-y-4">
          {variacoes.map((variacao) => (
            <AccordionItem key={variacao.id} value={variacao.id} className="border rounded-lg">
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
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Dimensões da Embalagem (cm)</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`altura-${variacao.id}`}>Altura (cm)</Label>
                        <Input
                          id={`altura-${variacao.id}`}
                          type="number"
                          step="0.1"
                          value={variacao.altura || ""}
                          onChange={(e) => updateVariacao(variacao.id, "altura", e.target.value)}
                          placeholder="0,0"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`largura-${variacao.id}`}>Largura (cm)</Label>
                        <Input
                          id={`largura-${variacao.id}`}
                          type="number"
                          step="0.1"
                          value={variacao.largura || ""}
                          onChange={(e) => updateVariacao(variacao.id, "largura", e.target.value)}
                          placeholder="0,0"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`comprimento-${variacao.id}`}>Comprimento (cm)</Label>
                        <Input
                          id={`comprimento-${variacao.id}`}
                          type="number"
                          step="0.1"
                          value={variacao.comprimento || ""}
                          onChange={(e) => updateVariacao(variacao.id, "comprimento", e.target.value)}
                          placeholder="0,0"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Peso</h4>
                    <div>
                      <Label htmlFor={`peso-${variacao.id}`}>Peso do Pacote (gramas)</Label>
                      <Input
                        id={`peso-${variacao.id}`}
                        type="number"
                        step="1"
                        value={variacao.peso || ""}
                        onChange={(e) => updateVariacao(variacao.id, "peso", e.target.value)}
                        placeholder="0"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
