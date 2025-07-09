
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TipoVariacao } from "./types";
import { ArrowRight, Circle, Square, Zap, Plus } from "lucide-react";

interface VariationTypeSelectorProps {
  tiposSelecionados: TipoVariacao[];
  onTiposChange: (tipos: TipoVariacao[]) => void;
  onNext: () => void;
}

export function VariationTypeSelector({ 
  tiposSelecionados, 
  onTiposChange, 
  onNext 
}: VariationTypeSelectorProps) {
  const [customType, setCustomType] = useState("");
  const [showCustomDrawer, setShowCustomDrawer] = useState(false);

  const tiposDisponiveis = [
    { id: "cor", nome: "Cor", icon: Circle },
    { id: "tamanho", nome: "Tamanho", icon: Square },
    { id: "voltagem", nome: "Voltagem", icon: Zap },
  ];

  const toggleTipo = (tipo: { id: string; nome: string; icon: any }) => {
    const jaExiste = tiposSelecionados.find(t => t.id === tipo.id);
    
    if (jaExiste) {
      onTiposChange(tiposSelecionados.filter(t => t.id !== tipo.id));
    } else {
      onTiposChange([...tiposSelecionados, { 
        id: tipo.id, 
        nome: tipo.nome, 
        icon: tipo.icon,
        opcoes: [] 
      }]);
    }
  };

  const addCustomType = () => {
    if (!customType.trim()) return;
    
    const customId = `custom_${Date.now()}`;
    onTiposChange([...tiposSelecionados, {
      id: customId,
      nome: customType,
      icon: "⚙️",
      opcoes: []
    }]);
    
    setCustomType("");
    setShowCustomDrawer(false);
  };

  const removeCustomType = (id: string) => {
    onTiposChange(tiposSelecionados.filter(t => t.id !== id));
  };

  const canProceed = tiposSelecionados.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-2">Tipos de Variação</h3>
        <p className="text-gray-600">Selecione os tipos de variação do seu produto</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {tiposDisponiveis.map((tipo) => {
          const IconComponent = tipo.icon;
          const isSelected = tiposSelecionados.find(t => t.id === tipo.id);
          
          return (
            <Card
              key={tipo.id}
              className={`cursor-pointer transition-all border-2 ${
                isSelected 
                  ? "border-primary bg-primary/5" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => toggleTipo(tipo)}
            >
              <CardContent className="p-6 text-center">
                <IconComponent className={`w-12 h-12 mx-auto mb-4 ${
                  isSelected ? "text-primary" : "text-gray-400"
                }`} />
                <h4 className="font-medium text-gray-900">{tipo.nome}</h4>
              </CardContent>
            </Card>
          );
        })}

        {/* Card de Mais Opções */}
        <Drawer open={showCustomDrawer} onOpenChange={setShowCustomDrawer}>
          <DrawerTrigger asChild>
            <Card className="cursor-pointer transition-all border-2 border-dashed border-gray-300 hover:border-gray-400">
              <CardContent className="p-6 text-center">
                <Plus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h4 className="font-medium text-gray-900">Mais opções</h4>
              </CardContent>
            </Card>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Criar Tipo de Variação Personalizada</DrawerTitle>
            </DrawerHeader>
            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="custom-type">Nome do tipo de variação</Label>
                <Input
                  id="custom-type"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  placeholder="Ex: Material, Sabor, Modelo..."
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
                  onClick={addCustomType}
                  disabled={!customType.trim()}
                  className="flex-1"
                >
                  Adicionar
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Tipos personalizados selecionados */}
      {tiposSelecionados.filter(t => t.id.startsWith('custom_')).length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Tipos personalizados:</h4>
          <div className="flex flex-wrap gap-2">
            {tiposSelecionados
              .filter(t => t.id.startsWith('custom_'))
              .map((tipo) => (
                <div
                  key={tipo.id}
                  className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{tipo.nome}</span>
                  <button
                    onClick={() => removeCustomType(tipo.id)}
                    className="hover:text-primary/70"
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {canProceed && (
        <div className="flex justify-end">
          <Button onClick={onNext} size="lg">
            Continuar para definir opções
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
