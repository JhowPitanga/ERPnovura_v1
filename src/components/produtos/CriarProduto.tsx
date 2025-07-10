
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductTypeSelector } from "./criar/ProductTypeSelector";

export function CriarProduto() {
  const navigate = useNavigate();
  const [productType, setProductType] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const backStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProductTypeChange = (type: string) => {
    setProductType(type);
    
    // Redirect to specific creation flows
    if (type === "kit") {
      navigate('/produtos/kits/criar');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Produto</h1>
            <p className="text-gray-600 text-lg">
              Crie um novo produto para sua loja
            </p>
          </div>
        </div>

        {/* Product Type Selection - Only show in step 1 */}
        {currentStep === 1 && (
          <Card className="shadow-lg">
            <CardContent className="p-10">
              <ProductTypeSelector
                productType={productType}
                onProductTypeChange={handleProductTypeChange}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
