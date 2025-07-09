
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Variacao } from "./types";

interface VariationFormProps {
  variacoes: Variacao[];
  onVariacoesChange: (variacoes: Variacao[]) => void;
}

export function VariationForm({ variacoes, onVariacoesChange }: VariationFormProps) {
  const [novaVariacao, setNovaVariacao] = useState({
    cor: "",
    tamanho: "",
    nomePersonalizado: "",
    sku: "",
    ean: "",
    precoCusto: ""
  });

  const adicionarVariacao = () => {
    if (novaVariacao.cor || novaVariacao.tamanho || novaVariacao.nomePersonalizado) {
      const novaVar: Variacao = {
        id: Date.now().toString(),
        nome: novaVariacao.nomePersonalizado || `${novaVariacao.cor} ${novaVariacao.tamanho}`.trim(),
        cor: novaVariacao.cor,
        tamanho: novaVariacao.tamanho,
        nomePersonalizado: novaVariacao.nomePersonalizado,
        sku: novaVariacao.sku,
        ean: novaVariacao.ean,
        precoCusto: novaVariacao.precoCusto,
      };
      
      onVariacoesChange([...variacoes, novaVar]);
      setNovaVariacao({
        cor: "",
        tamanho: "",
        nomePersonalizado: "",
        sku: "",
        ean: "",
        precoCusto: ""
      });
    }
  };

  const removerVariacao = (id: string) => {
    onVariacoesChange(variacoes.filter(v => v.id !== id));
  };

  const handleVariacaoImageUpload = (variacaoId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onVariacoesChange(variacoes.map(v => 
        v.id === variacaoId ? { ...v, imagem: file } : v
      ));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-6">Configurar Variações</h3>
        
        {/* Formulário para adicionar nova variação */}
        <Card className="p-6 bg-gray-50">
          <h4 className="font-semibold mb-4">Adicionar Nova Variação</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cor">Cor</Label>
              <Input
                id="cor"
                value={novaVariacao.cor}
                onChange={(e) => setNovaVariacao(prev => ({ ...prev, cor: e.target.value }))}
                placeholder="Ex: Azul"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="tamanho">Tamanho</Label>
              <Input
                id="tamanho"
                value={novaVariacao.tamanho}
                onChange={(e) => setNovaVariacao(prev => ({ ...prev, tamanho: e.target.value }))}
                placeholder="Ex: M"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="nomePersonalizado">Nome Personalizado</Label>
              <Input
                id="nomePersonalizado"
                value={novaVariacao.nomePersonalizado}
                onChange={(e) => setNovaVariacao(prev => ({ ...prev, nomePersonalizado: e.target.value }))}
                placeholder="Nome da variação"
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <Label htmlFor="varSku">SKU da Variação</Label>
              <Input
                id="varSku"
                value={novaVariacao.sku}
                onChange={(e) => setNovaVariacao(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="SKU-001"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="ean">EAN</Label>
              <Input
                id="ean"
                value={novaVariacao.ean}
                onChange={(e) => setNovaVariacao(prev => ({ ...prev, ean: e.target.value }))}
                placeholder="Código EAN"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="precoCustoVar">Preço de Custo</Label>
              <Input
                id="precoCustoVar"
                type="number"
                step="0.01"
                value={novaVariacao.precoCusto}
                onChange={(e) => setNovaVariacao(prev => ({ ...prev, precoCusto: e.target.value }))}
                placeholder="0,00"
                className="mt-2"
              />
            </div>
          </div>
          <Button 
            onClick={adicionarVariacao} 
            className="mt-4 bg-novura-primary hover:bg-novura-primary/90"
            disabled={!novaVariacao.cor && !novaVariacao.tamanho && !novaVariacao.nomePersonalizado}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Variação
          </Button>
        </Card>

        {/* Lista de variações em accordion */}
        {variacoes.length > 0 && (
          <div className="mt-8">
            <h4 className="font-semibold mb-4">Variações Criadas ({variacoes.length})</h4>
            <Accordion type="single" collapsible className="space-y-2">
              {variacoes.map((variacao) => (
                <AccordionItem key={variacao.id} value={variacao.id} className="border rounded-lg">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">{variacao.nome}</span>
                        <span className="text-sm text-gray-500">SKU: {variacao.sku}</span>
                        <span className="text-sm text-gray-500">EAN: {variacao.ean}</span>
                        <span className="text-sm text-gray-500">Custo: R$ {variacao.precoCusto}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <Label>Foto de Capa</Label>
                          <div className="mt-2">
                            {variacao.imagem ? (
                              <div className="relative inline-block">
                                <img
                                  src={URL.createObjectURL(variacao.imagem)}
                                  alt={variacao.nome}
                                  className="w-16 h-16 object-cover rounded border"
                                />
                                <button
                                  onClick={() => onVariacoesChange(variacoes.map(v => 
                                    v.id === variacao.id ? { ...v, imagem: undefined } : v
                                  ))}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                >
                                  <X className="w-2 h-2" />
                                </button>
                              </div>
                            ) : (
                              <label className="inline-block">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleVariacaoImageUpload(variacao.id, e)}
                                  className="hidden"
                                />
                                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400">
                                  <Plus className="w-4 h-4 text-gray-400" />
                                </div>
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removerVariacao(variacao.id)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remover
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
}
