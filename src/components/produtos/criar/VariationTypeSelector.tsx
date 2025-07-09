
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { TipoVariacao } from "./types";

interface VariationTypeSelectorProps {
  tiposSelecionados: TipoVariacao[];
  onTiposChange: (tipos: TipoVariacao[]) => void;
  onNext: () => void;
}

export function VariationTypeSelector({ tiposSelecionados, onTiposChange, onNext }: VariationTypeSelectorProps) {
  const [tipoPersonalizado, setTipoPersonalizado] = useState("");
  const [showCustomDrawer, setShowCustomDrawer] = useState(false);

  const tiposDisponiveis = [
    { id: "cor", nome: "Cor", icon: "🎨", opcoes: [] },
    { id: "tamanho", nome: "Tamanho", icon: "📏", opcoes: [] },
    { id: "material", nome: "Material", icon: "🔷", opcoes: [] },
    { id: "voltagem", nome: "Voltagem", icon: "⚡", opcoes: [] },
  ];

  const toggleTipo = (tipo: typeof tiposDisponiveis[0]) => {
    const jaExiste = tiposSelecionados.find(t => t.id === tipo.id);
    
    if (jaExiste) {
      onTiposChange(tiposSelecionados.filter(t => t.id !== tipo.id));
    } else {
      onTiposChange([...tiposSelecionados, { ...tipo, opcoes: [] }]);
    }
  };

  const adicionarTipoPersonalizado = () => {
    if (tipoPersonalizado.trim()) {
      const novoTipo: TipoVariacao = {
        id: `custom_${Date.now()}`,
        nome: tipoPersonalizado,
        icon: "➕",
        opcoes: []
      };
      onTiposChange([...tiposSelecionados, novoTipo]);
      setTipoPersonalizado("");
      setShowCustomDrawer(false);
    }
  };

  const podeProsseguir = tiposSelecionados.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-2">Selecione a variação</h3>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700 text-sm">
            ℹ️ Se precisar, você poderá incluir no máximo 3 variações diferentes.
          </p>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {tiposDisponiveis.map((tipo) => {
            const selecionado = tiposSelecionados.some(t => t.id === tipo.id);
            return (
              <Card
                key={tipo.id}
                className={`cursor-pointer transition-all ${
                  selecionado
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleTipo(tipo)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{tipo.icon}</div>
                  <h4 className="font-medium">{tipo.nome}</h4>
                  {selecionado && (
                    <div className="mt-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          <Drawer open={showCustomDrawer} onOpenChange={setShowCustomDrawer}>
            <DrawerTrigger asChild>
              <Card className="cursor-pointer border-gray-200 hover:border-gray-300 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <h4 className="font-medium">Mais Opções</h4>
                </CardContent>
              </Card>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Adicionar Tipo de Variação Personalizada</DrawerTitle>
              </DrawerHeader>
              <div className="p-6 space-y-4">
                <div>
                  <Label htmlFor="tipoPersonalizado">Nome do tipo de variação</Label>
                  <Input
                    id="tipoPersonalizado"
                    value={tipoPersonalizado}
                    onChange={(e) => setTipoPersonalizado(e.target.value)}
                    placeholder="Ex: Modelo, Estilo, etc."
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCustomDrawer(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={adicionarTipoPersonalizado}
                    disabled={!tipoPersonalizado.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Confirmar
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {tiposSelecionados.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Tipos selecionados:</h4>
            <div className="flex flex-wrap gap-2">
              {tiposSelecionados.map((tipo) => (
                <div
                  key={tipo.id}
                  className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  <span>{tipo.icon} {tipo.nome}</span>
                  <button
                    onClick={() => onTiposChange(tiposSelecionados.filter(t => t.id !== tipo.id))}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {podeProsseguir && (
          <div className="mt-8">
            <Button
              onClick={onNext}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Continuar para definir opções
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
