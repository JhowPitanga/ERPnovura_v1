import { useState } from "react";
import { ProductFormData, ProductVariation, VariationType, KitItem, ProductType, VariationStep, KitStep, CreateProductData } from "@/types/products";
import { useCreateProduct } from './useProducts';
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
      case 'variation':
        return 'VARIACAO_PAI';
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
      image_urls: [],
      custom_attributes: undefined,
        stock_current: undefined, // Esta propriedade será usada na tabela products_stock
        storage_id: undefined, // Esta propriedade será usada na tabela products_stock
      };

      if (baseProductData.type === 'UNICO') {
        baseProductData.image_urls = selectedImages.map(img => img.name);
      } else if (baseProductData.type === 'VARIACAO_PAI') {
        baseProductData.image_urls = selectedImages.map(img => img.name);
        baseProductData.variations = variations.map(v => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          costPrice: String(v.costPrice || ''),
          sellPrice: String(v.costPrice || ''),
          stock: String(v.stock || ''),
          warehouse: String(v.storage || ''),
          images: v.images.map(img => img.name || ''),
          color: v.color,
          size: v.size,
          voltage: v.voltage,
          customType: v.customType,
          customValue: v.customValue,
          ean: v.ean,
          height: v.height,
          width: v.width,
          length: v.length,
          weight: v.weight,
          unitType: v.unit,
          ncm: v.ncm,
          cest: v.cest,
          origin: v.origin,
        }));
      } else if (baseProductData.type === 'ITEM') {
        baseProductData.kitItems = kitItems.map(k => ({
          id: k.id,
          product_id: (k as any).product_id || k.id,
          quantity: k.quantity,
        }));
        baseProductData.image_urls = selectedImages.map(img => img.name);
      }

      const createdProduct = await createProduct(baseProductData);

      // Inserir o estoque na tabela 'products_stock'
      if (createdProduct && createdProduct.id) {
        const stockDataToInsert = {
          product_id: createdProduct.id,
          stock_current: formData.stock ? parseInt(formData.stock) : 0,
          storage_id: formData.warehouse || undefined,
        };

        const { error: stockError } = await supabase
          .from('products_stock')
          .insert([stockDataToInsert]);

        if (stockError) {
          throw stockError;
        }
      }

      setProductSaved(true);
      setCurrentStep(currentStep + 1);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error("Erro ao criar produto:", error);
      
      let errorMessage = "Erro desconhecido.";
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast({
        title: "Erro",
        description: `Falha ao criar produto: ${errorMessage}`,
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
        await handleCreateProduct();
      } else if (currentStep === 5 && !productSaved && productType === "variation") {
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
    
    setSelectedImages,
    setVariations,
    setVariationStep,
    setVariationTypes,
    setKitItems,
    
    nextStep,
    backStep,
    handleInputChange,
    handleProductTypeChange,
    handleCreateProduct,
    getMaxSteps,
  };
}