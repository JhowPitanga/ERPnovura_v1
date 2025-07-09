
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Variacao } from "./types";

interface VariationImageUploadProps {
  variacao: Variacao;
  onImageUpload: (variacaoId: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (variacaoId: string, imageIndex: number) => void;
}

export function VariationImageUpload({ variacao, onImageUpload, onRemoveImage }: VariationImageUploadProps) {
  return (
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
              onClick={() => onRemoveImage(variacao.id, index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
            >
              <X className="w-3 h-3" />
            </button>
            {index === 0 && (
              <div className="absolute bottom-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded">
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
              onChange={(e) => onImageUpload(variacao.id, e)}
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
  );
}
