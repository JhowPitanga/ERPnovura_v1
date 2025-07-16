import { useState } from "react";
import { ProductFormData, ProductVariation, VariationType, KitItem, ProductType, VariationStep, KitStep } from "@/types/products";
import { useCreateProduct, CreateProductData } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";

interface UseProductFormProps {
  onSuccess?: () => void;
}

export function useProductForm({ onSuccess }: UseProductFormProps = {}) {
  const { createProduct, loading: createLoading } = useCreateProduct();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [productType, setProductType] = useState<ProductType | "">("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [productSaved, setProductSaved] = useState(false);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  
  // Variation form state
  const [variationStep, setVariationStep] = useState<VariationStep>("types");
  const [variationTypes, setVariationTypes] = useState<VariationType[]>([]);
  
  // Kit state
  const [kitStep, setKitStep] = useState<KitStep>("info");
  const [kitItems, setKitItems] = useState<KitItem[]>([]);
  
  const [formData, setFormData] = useState<ProductFormData>({
    type: "",
    name: "",
    sku: "",
    category: "",
    brand: "",
    description: "",
    costPrice: "",
    sellPrice: "",
    stock: "",
    warehouse: "",
    height: "",
    width: "",
    length: "",
    weight: "",
    unitType: "",
    barcode: "",
    ncm: "",
    cest: "",
    origin: "",
  });

  const getMaxSteps = () => {
    if (productType === "kit") return 4;
    return 6;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProductTypeChange = (type: ProductType) => {
    setProductType(type);
    handleInputChange("type", type);
  };

  const getProductTypeForDB = (type: string): 'UNICO' | 'VARIACAO_PAI' | 'VARIACAO_ITEM' | 'ITEM' => {
    switch (type) {
      case 'single':
        return 'UNICO';
      case 'variation': // Este será o tipo para o "pai" das variações
        return 'VARIACAO_PAI';
      case 'kit':
        return 'ITEM';
      default:
        return 'UNICO'; // Fallback
    }
  };

  const handleCreateProduct = async () => {
    try {
      // Validação base (pode precisar ser mais robusta por tipo de produto)
      if (!formData.name || !formData.sku || !formData.costPrice || !formData.ncm || !formData.origin) {
        toast({
          title: "Erro",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive",
        });
        return;
      }

      const baseProductData: CreateProductData = {
        name: formData.name,
        sku: formData.sku,
        type: getProductTypeForDB(productType as string),
        description: formData.description || undefined,
        cost_price: parseFloat(formData.costPrice),
        sell_price: formData.sellPrice ? parseFloat(formData.sellPrice) : undefined,
        barcode: parseInt(formData.barcode) || 0,
        ncm: parseInt(formData.ncm),
        cest: formData.cest ? parseInt(formData.cest) : undefined,
        package_height: parseInt(formData.height) || 0,
        package_width: parseInt(formData.width) || 0,
        package_length: parseInt(formData.length) || 0,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        weight_type: formData.unitType || undefined,
        tax_origin_code: parseInt(formData.origin),
        category_id: formData.category || undefined,
        brand_id: undefined,
        color: undefined,
        size: undefined,
        image_urls: [], // As imagens serão tratadas separadamente ou passadas aqui se forem do produto principal
        custom_attributes: undefined,
        stock_current: undefined, // Será definido abaixo para single/variation_item
        storage_id: undefined, // Será definido abaixo para single/variation_item
      };

      // Adiciona dados específicos por tipo de produto
      if (baseProductData.type === 'UNICO') {
        baseProductData.stock_current = formData.stock ? parseInt(formData.stock) : 0;
        baseProductData.storage_id = formData.warehouse || undefined;
        baseProductData.image_urls = selectedImages.map(img => img.name); // Exemplo: se as imagens são Files
      } else if (baseProductData.type === 'VARIACAO_PAI') {
        baseProductData.image_urls = selectedImages.map(img => img.name); // Imagens do produto pai
        // Para variações, 'variations' é um array de objetos que precisa ser mapeado para o formato esperado pelo createProduct
        baseProductData.variations = variations.map(v => ({
            ...v, // Copia os dados existentes da variação
            costPrice: String(v.costPrice), // Garante que é string para o useCreateProduct
            sellPrice: String(v.sellPrice),
            stock: String(v.stock),
        }));
      } else if (baseProductData.type === 'ITEM') {
        baseProductData.kitItems = kitItems;
        baseProductData.image_urls = selectedImages.map(img => img.name); // Imagens do kit
      }

      await createProduct(baseProductData); // Chama o useCreateProduct com os dados completos

      setProductSaved(true);
      setCurrentStep(currentStep + 1);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar produto: " + (error instanceof Error ? error.message : "Erro desconhecido"),
        variant: "destructive",
      });
    }
  };

  const nextStep = async () => {
    if (currentStep < getMaxSteps()) {
      if (productType === "kit" && currentStep === 3) {
        if (kitStep === "info") {
          setKitStep("products");
        } else if (kitStep === "products") {
          setCurrentStep(currentStep + 1);
        }
      } else if (currentStep === 5 && !productSaved && productType !== "kit" && productType !== "variation") {
        // Salva produto único
        await handleCreateProduct();
      } else if (currentStep === 5 && !productSaved && productType === "variation") {
        // Salva produto variação (pai e itens)
        await handleCreateProduct();
      }
      else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const backStep = () => {
    if (productType === "kit" && currentStep === 3 && kitStep === "products") {
      setKitStep("info");
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    // State
    currentStep,
    productType,
    selectedImages,
    productSaved,
    variations,
    variationStep,
    variationTypes,
    kitStep,
    kitItems,
    formData,
    createLoading,
    
    // Setters
    setSelectedImages,
    setVariations,
    setVariationStep,
    setVariationTypes,
    setKitItems,
    
    // Actions
    nextStep,
    backStep,
    handleInputChange,
    handleProductTypeChange,
    handleCreateProduct, // Exportar para que possa ser chamado diretamente no botão "Salvar"
    getMaxSteps,
  };
}