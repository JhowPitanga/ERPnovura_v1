
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ArrowLeft, ArrowRight, Repeat } from "lucide-react";
import { CheckoutSteps } from "./CheckoutSteps";

interface CartItem {
  id: number;
  nome: string;
  preco: number;
  image: string;
  quantidade: number;
  categoria?: string;
}

interface Address {
  id: string;
  tipo: string;
  endereco: string;
  cidade: string;
}

interface PaymentMethod {
  id: string;
  nome: string;
  ativo: boolean;
}

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  currentStep: number;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  selectedAddress: string;
  selectedPayment: string;
  onStepChange: (step: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onAddressChange: (addressId: string) => void;
  onPaymentChange: (paymentId: string) => void;
  onFinalizePurchase: () => void;
  hasEtiquetas?: boolean;
  onOpenRecurringModal?: () => void;
}

export function CartDrawer({
  open,
  onOpenChange,
  cartItems,
  currentStep,
  addresses,
  paymentMethods,
  selectedAddress,
  selectedPayment,
  onStepChange,
  onUpdateQuantity,
  onAddressChange,
  onPaymentChange,
  onFinalizePurchase,
  hasEtiquetas = false,
  onOpenRecurringModal
}: CartDrawerProps) {
  const steps = ["Produtos", "Endereço", "Pagamento"];
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-[500px] fixed right-0">
        <DrawerHeader className="border-b">
          <DrawerTitle className="flex items-center justify-between">
            <span>Carrinho de Compras</span>
            <div className="flex items-center space-x-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={() => onStepChange(currentStep - 1)}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div className="flex space-x-2">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === currentStep 
                        ? "bg-novura-primary text-white" 
                        : index < currentStep 
                          ? "bg-green-500 text-white" 
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 p-6 overflow-y-auto">
          <CheckoutSteps
            step={currentStep}
            cartItems={cartItems}
            addresses={addresses}
            paymentMethods={paymentMethods}
            selectedAddress={selectedAddress}
            selectedPayment={selectedPayment}
            totalAmount={totalAmount}
            onUpdateQuantity={onUpdateQuantity}
            onAddressChange={onAddressChange}
            onPaymentChange={onPaymentChange}
          />
        </div>

        <div className="border-t p-6 space-y-3">
          {/* Recurring Purchase Suggestion */}
          {hasEtiquetas && currentStep === 2 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Repeat className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900">Compra Recorrente</h4>
                  <p className="text-sm text-blue-700">
                    Configure compras automáticas para etiquetas quando o estoque estiver baixo
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onOpenRecurringModal}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  Configurar
                </Button>
              </div>
            </div>
          )}

          {currentStep < 2 ? (
            <Button 
              onClick={() => onStepChange(currentStep + 1)}
              className="w-full bg-novura-primary hover:bg-novura-primary/90"
              disabled={cartItems.length === 0}
            >
              Continuar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={onFinalizePurchase}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Finalizar Compra
            </Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
