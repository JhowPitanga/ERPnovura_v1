
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

  const getProductTypeForDB = (type: string): 'UNICO' | 'VARIANT' | 'ITEM' => {
    switch (type) {
      case 'single':
        return 'UNICO';
      case 'variation':
        return 'VARIANT';
      case 'kit':
        return 'ITEM';
      default:
        return 'UNICO';
    }
  };

  const handleCreateProduct = async () => {
    try {
      if (!formData.name || !formData.sku || !formData.costPrice || !formData.ncm || !formData.origin) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const productData: CreateProductData = {
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
        image_urls: [],
        custom_attributes: undefined,
        stock_current: formData.stock ? parseInt(formData.stock) : undefined,
        storage_id: formData.warehouse || undefined,
      };

      await createProduct(productData);
      setProductSaved(true);
      setCurrentStep(currentStep + 1);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating product:", error);
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
      } else if (currentStep === 5 && !productSaved && productType !== "kit") {
        await handleCreateProduct();
      } else {
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
    handleCreateProduct,
    getMaxSteps,
  };
}
