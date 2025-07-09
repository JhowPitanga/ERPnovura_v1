
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Variacao } from "./types";

interface VariationDimensionsFormProps {
  variacoes: Variacao[];
  onVariacoesChange: (variacoes: Variacao[]) => void;
}

export function VariationDimensionsForm({ variacoes, onVariacoesChange }: VariationDimensionsFormProps) {
  const [showMassDimensionsDrawer, setShowMassDimensionsDrawer] = useState(false);
  const [massDimensionsData, setMassDimensionsData] = useState({
    altura: "",
    largura: "",
    comprimento: "",
    peso: "",
  });

  const updateVariacao = (variacaoId: string, field: string, value: string) => {
    onVariacoesChange(variacoes.map(v => 
      v.id === variacaoId ? { ...v, [field]: value } : v
    ));
  };

  const applyMassDimensions = () => {
    onVariacoesChange(variacoes.map(v => ({
      ...v,
      ...massDimensionsData
    })));
    setShowMassDimensionsDrawer(false);
    setMassDimensionsData({
      altura: "",
      largura: "",
      comprimento: "",
      peso: "",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">Dimensões e Peso por Variação</h3>
          <p className="text-gray-600">Configure as medidas do pacote para cada variação</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowMassDimensionsDrawer(true)}
          className="border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          Adicionar dimensões em massa
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

      <Drawer open={showMassDimensionsDrawer} onOpenChange={setShowMassDimensionsDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Aplicar Dimensões em Massa</DrawerTitle>
          </DrawerHeader>
          <div className="p-6 space-y-6">
            <p className="text-gray-600">
              As dimensões inseridas aqui serão aplicadas a todas as variações do produto.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Dimensões da Embalagem (cm)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="mass-altura">Altura (cm)</Label>
                    <Input
                      id="mass-altura"
                      type="number"
                      step="0.1"
                      value={massDimensionsData.altura}
                      onChange={(e) => setMassDimensionsData({ ...massDimensionsData, altura: e.target.value })}
                      placeholder="0,0"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mass-largura">Largura (cm)</Label>
                    <Input
                      id="mass-largura"
                      type="number"
                      step="0.1"
                      value={massDimensionsData.largura}
                      onChange={(e) => setMassDimensionsData({ ...massDimensionsData, largura: e.target.value })}
                      placeholder="0,0"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mass-comprimento">Comprimento (cm)</Label>
                    <Input
                      id="mass-comprimento"
                      type="number"
                      step="0.1"
                      value={massDimensionsData.comprimento}
                      onChange={(e) => setMassDimensionsData({ ...massDimensionsData, comprimento: e.target.value })}
                      placeholder="0,0"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Peso</h4>
                <div>
                  <Label htmlFor="mass-peso">Peso do Pacote (gramas)</Label>
                  <Input
                    id="mass-peso"
                    type="number"
                    step="1"
                    value={massDimensionsData.peso}
                    onChange={(e) => setMassDimensionsData({ ...massDimensionsData, peso: e.target.value })}
                    placeholder="0"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowMassDimensionsDrawer(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={applyMassDimensions}
                className="flex-1"
              >
                Aplicar a todas as variações
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
