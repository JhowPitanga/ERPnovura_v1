
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TipoVariacao, Variacao } from "./types";

interface VariationOptionsFormProps {
  tiposVariacao: TipoVariacao[];
  onTiposChange: (tipos: TipoVariacao[]) => void;
  onVariacoesGenerate: (variacoes: Variacao[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function VariationOptionsForm({ 
  tiposVariacao, 
  onTiposChange, 
  onVariacoesGenerate, 
  onNext, 
  onBack 
}: VariationOptionsFormProps) {
  const [novaOpcao, setNovaOpcao] = useState<{ [key: string]: string }>({});

  const adicionarOpcao = (tipoId: string) => {
    const opcao = novaOpcao[tipoId]?.trim();
    if (!opcao) return;

    const tiposAtualizados = tiposVariacao.map(tipo => {
      if (tipo.id === tipoId) {
        return {
          ...tipo,
          opcoes: [...tipo.opcoes, opcao]
        };
      }
      return tipo;
    });

    onTiposChange(tiposAtualizados);
    setNovaOpcao({ ...novaOpcao, [tipoId]: "" });
  };

  const removerOpcao = (tipoId: string, opcaoIndex: number) => {
    const tiposAtualizados = tiposVariacao.map(tipo => {
      if (tipo.id === tipoId) {
        return {
          ...tipo,
          opcoes: tipo.opcoes.filter((_, index) => index !== opcaoIndex)
        };
      }
      return tipo;
    });

    onTiposChange(tiposAtualizados);
  };

  const gerarVariacoes = () => {
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

    onVariacoesGenerate(variacoes);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Definir opções das variações</h3>
      </div>

      <div className="space-y-6">
        {tiposVariacao.map((tipo) => {
          const IconComponent = typeof tipo.icon === 'string' ? 
            () => <span className="text-2xl">{tipo.icon}</span> : 
            tipo.icon;
          
          return (
            <Card key={tipo.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent />
                  {tipo.nome}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={novaOpcao[tipo.id] || ""}
                    onChange={(e) => setNovaOpcao({ ...novaOpcao, [tipo.id]: e.target.value })}
                    placeholder={`Digite uma opção de ${tipo.nome.toLowerCase()}`}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        adicionarOpcao(tipo.id);
                      }
                    }}
                  />
                  <Button
                    onClick={() => adicionarOpcao(tipo.id)}
                    disabled={!novaOpcao[tipo.id]?.trim()}
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {tipo.opcoes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tipo.opcoes.map((opcao, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                      >
                        {tipo.id === "cor" && (
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: opcao.toLowerCase() }}
                          />
                        )}
                        <span className="text-sm">{opcao}</span>
                        <button
                          onClick={() => removerOpcao(tipo.id, index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
