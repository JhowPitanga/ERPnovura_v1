
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Variacao, TipoVariacao } from "./types";
import { VariationTypeSelector } from "./VariationTypeSelector";
import { VariationOptionsForm } from "./VariationOptionsForm";

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

  if (etapa === "tipos") {
    return (
      <VariationTypeSelector
        tiposSelecionados={tiposVariacao}
        onTiposChange={setTiposVariacao}
        onNext={() => setEtapa("opcoes")}
      />
    );
  }

  if (etapa === "opcoes") {
    return (
      <VariationOptionsForm
        tiposVariacao={tiposVariacao}
        onTiposChange={setTiposVariacao}
        onVariacoesGenerate={onVariacoesChange}
        onNext={() => setEtapa("configuracao")}
        onBack={() => setEtapa("tipos")}
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
                  <div className="text-sm text-gray-500">
                    {variacao.imagens?.length || 0}/8 fotos
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-6">
                  {/* Upload de Imagens */}
                  <div>
                    <Label className="text-base font-medium">Fotos da Variação (até 8 fotos)</Label>
                    <div className="grid grid-cols-8 gap-3 mt-4">
                      {/* Imagens já adicionadas */}
                      {(variacao.imagens || []).map((file, index) => (
                        <div key={index} className="relative">
                          <div className="aspect-square border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`${variacao.nome} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(variacao.id, index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              Capa
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Slots vazios para adicionar novas imagens */}
                      {Array.from({ length: 8 - (variacao.imagens?.length || 0) }).map((_, index) => (
                        <div key={`empty-${index}`} className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageUpload(variacao.id, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            id={`image-upload-${variacao.id}-${index}`}
                          />
                          <label
                            htmlFor={`image-upload-${variacao.id}-${index}`}
                            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
                          >
                            <Plus className="w-6 h-6 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500 text-center px-1">
                              Adicionar
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      A primeira foto será usada como capa da variação.
                    </p>
                  </div>

                  {/* Campos de SKU e EAN */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`sku-${variacao.id}`}>SKU</Label>
                      <Input
                        id={`sku-${variacao.id}`}
                        value={variacao.sku}
                        onChange={(e) => updateVariacao(variacao.id, "sku", e.target.value)}
                        placeholder="SKU da variação"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`ean-${variacao.id}`}>Código de Barras (EAN)</Label>
                      <Input
                        id={`ean-${variacao.id}`}
                        value={variacao.ean}
                        onChange={(e) => updateVariacao(variacao.id, "ean", e.target.value)}
                        placeholder="Código de barras"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* Campo de Preço de Custo */}
                  <div>
                    <Label htmlFor={`preco-${variacao.id}`}>Preço de Custo</Label>
                    <Input
                      id={`preco-${variacao.id}`}
                      type="number"
                      step="0.01"
                      value={variacao.precoCusto}
                      onChange={(e) => updateVariacao(variacao.id, "precoCusto", e.target.value)}
                      placeholder="0,00"
                      className="mt-2"
                    />
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
