
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Variacao } from "./types";

interface VariationTaxFormProps {
  variacoes: Variacao[];
  onVariacoesChange: (variacoes: Variacao[]) => void;
}

export function VariationTaxForm({ variacoes, onVariacoesChange }: VariationTaxFormProps) {
  const [showMassApplyDrawer, setShowMassApplyDrawer] = useState(false);
  const [massData, setMassData] = useState({
    ncm: "",
    cest: "",
    codigoBarras: "",
    unidade: "",
    origem: "",
  });

  const updateVariacao = (variacaoId: string, field: string, value: string) => {
    onVariacoesChange(variacoes.map(v => 
      v.id === variacaoId ? { ...v, [field]: value } : v
    ));
  };

  const applyMassData = () => {
    onVariacoesChange(variacoes.map(v => ({
      ...v,
      ...massData
    })));
    setShowMassApplyDrawer(false);
    setMassData({
      ncm: "",
      cest: "",
      codigoBarras: "",
      unidade: "",
      origem: "",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">Informações Fiscais por Variação</h3>
          <p className="text-gray-600">Configure as informações fiscais para cada variação</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowMassApplyDrawer(true)}
          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          Aplicar dados em massa
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
                    {variacao.ncm && variacao.codigoBarras ? "✓ Completo" : "Pendente"}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`codigo-barras-${variacao.id}`}>
                        Código de Barras <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`codigo-barras-${variacao.id}`}
                        value={variacao.codigoBarras || ""}
                        onChange={(e) => updateVariacao(variacao.id, "codigoBarras", e.target.value)}
                        placeholder="Código de barras"
                        className="mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`ncm-${variacao.id}`}>
                        NCM <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`ncm-${variacao.id}`}
                        value={variacao.ncm || ""}
                        onChange={(e) => updateVariacao(variacao.id, "ncm", e.target.value)}
                        placeholder="00000000"
                        className="mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`cest-${variacao.id}`}>CEST</Label>
                      <Input
                        id={`cest-${variacao.id}`}
                        value={variacao.cest || ""}
                        onChange={(e) => updateVariacao(variacao.id, "cest", e.target.value)}
                        placeholder="0000000"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`unidade-${variacao.id}`}>Unidade de Medida</Label>
                      <Select
                        value={variacao.unidade || ""}
                        onValueChange={(value) => updateVariacao(variacao.id, "unidade", value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UN">Unidade (UN)</SelectItem>
                          <SelectItem value="PC">Peça (PC)</SelectItem>
                          <SelectItem value="KG">Quilograma (KG)</SelectItem>
                          <SelectItem value="LT">Litro (LT)</SelectItem>
                          <SelectItem value="MT">Metro (MT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`origem-${variacao.id}`}>Origem</Label>
                      <Select
                        value={variacao.origem || ""}
                        onValueChange={(value) => updateVariacao(variacao.id, "origem", value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Selecione a origem" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - Nacional</SelectItem>
                          <SelectItem value="1">1 - Estrangeira - Importação direta</SelectItem>
                          <SelectItem value="2">2 - Estrangeira - Adquirida no mercado interno</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <Drawer open={showMassApplyDrawer} onOpenChange={setShowMassApplyDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Aplicar Dados Fiscais em Massa</DrawerTitle>
          </DrawerHeader>
          <div className="p-6 space-y-6">
            <p className="text-gray-600">
              Os dados inseridos aqui serão aplicados a todas as variações do produto.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mass-codigo-barras">
                    Código de Barras <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mass-codigo-barras"
                    value={massData.codigoBarras}
                    onChange={(e) => setMassData({ ...massData, codigoBarras: e.target.value })}
                    placeholder="Código de barras"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="mass-ncm">
                    NCM <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mass-ncm"
                    value={massData.ncm}
                    onChange={(e) => setMassData({ ...massData, ncm: e.target.value })}
                    placeholder="00000000"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="mass-cest">CEST</Label>
                  <Input
                    id="mass-cest"
                    value={massData.cest}
                    onChange={(e) => setMassData({ ...massData, cest: e.target.value })}
                    placeholder="0000000"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="mass-unidade">Unidade de Medida</Label>
                  <Select
                    value={massData.unidade}
                    onValueChange={(value) => setMassData({ ...massData, unidade: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UN">Unidade (UN)</SelectItem>
                      <SelectItem value="PC">Peça (PC)</SelectItem>
                      <SelectItem value="KG">Quilograma (KG)</SelectItem>
                      <SelectItem value="LT">Litro (LT)</SelectItem>
                      <SelectItem value="MT">Metro (MT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mass-origem">Origem</Label>
                  <Select
                    value={massData.origem}
                    onValueChange={(value) => setMassData({ ...massData, origem: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 - Nacional</SelectItem>
                      <SelectItem value="1">1 - Estrangeira - Importação direta</SelectItem>
                      <SelectItem value="2">2 - Estrangeira - Adquirida no mercado interno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowMassApplyDrawer(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={applyMassData}
                disabled={!massData.ncm || !massData.codigoBarras}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
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
