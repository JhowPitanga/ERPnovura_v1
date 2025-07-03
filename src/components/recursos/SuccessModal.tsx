
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuccessModal({ open, onOpenChange }: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md text-center">
        <div className="flex flex-col items-center space-y-4 py-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Parabéns pela compra!</h2>
          <p className="text-gray-600">Seu pedido foi realizado com sucesso.</p>
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full bg-novura-primary hover:bg-novura-primary/90"
          >
            Continuar Comprando
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
