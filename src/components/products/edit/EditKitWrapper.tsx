import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductFormData, KitItem } from "@/types/products";

// Import form components
import { ProductForm } from "@/components/produtos/criar/ProductForm";
import { ImageUpload } from "@/components/produtos/criar/ImageUpload";
import { KitForm } from "@/components/produtos/criar/KitForm";

export function EditKitWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [kitEtapa, setKitEtapa] = useState<"info" | "produtos">("info");
  const [kitItems, setKitItems] = useState<KitItem[]>([]);
  
  const [formData, setFormData] = useState<ProductFormData>({
    type: "kit",
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

  const fetchKitProduct = async () => {
    if (!id) {
      toast({
        title: "Error",
        description: "Product ID not found",
        variant: "destructive",
      });
      navigate("/produtos");
      return;
    }

    try {
      setLoading(true);
      // Fetch kit product
      const { data: kitProduct, error: kitError } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          ),
          products_stock (
            current,
            in_transit,
            reserved,
            storage (
              id,
              name
            )
          )
        `)
        .eq('id', id)
        .single();

      if (kitError) {
        console.error('Error fetching kit product:', kitError);
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        navigate("/produtos");
        return;
      }

      // Fetch kit items (products that are part of this kit)
      const { data: kitMembers, error: membersError } = await supabase
        .from('product_group_members')
        .select(`
          product_id,
          products (
            *
          )
        `)
        .eq('product_group_id', kitProduct.id);

      if (membersError) {
        console.error('Error fetching kit members:', membersError);
      }

      // Transform data to English format
      const transformedFormData: ProductFormData = {
        type: "kit",
        name: kitProduct.name,
        sku: kitProduct.sku,
        category: kitProduct.categories?.name || "",
        brand: "",
        description: kitProduct.description || "",
        costPrice: kitProduct.cost_price?.toString() || "",
        sellPrice: kitProduct.sell_price?.toString() || "",
        stock: kitProduct.products_stock?.current?.toString() || "",
        warehouse: kitProduct.products_stock?.[0]?.storage?.name || "Principal",
        height: kitProduct.package_height?.toString() || "",
        width: kitProduct.package_width?.toString() || "",
        length: kitProduct.package_length?.toString() || "",
        weight: kitProduct.weight?.toString() || "",
        unitType: kitProduct.weight_type || "",
        barcode: kitProduct.barcode?.toString() || "",
        ncm: kitProduct.ncm?.toString() || "",
        cest: kitProduct.cest?.toString() || "",
        origin: kitProduct.tax_origin_code?.toString() || "",
      };

      // Transform kit items
      const transformedKitItems: KitItem[] = kitMembers?.map((member: any) => ({
        id: member.products.id,
        name: member.products.name,
        sku: member.products.sku,
        quantity: 1, // Default quantity, this should be stored in the junction table
        type: member.products.type === 'VARIANT' ? 'variation' : 'single'
      })) || [];

      setFormData(transformedFormData);
      setKitItems(transformedKitItems);
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Error loading product",
        variant: "destructive",
      });
      navigate("/produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitProduct();
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVoltar = () => {
    navigate("/produtos");
  };

  const handleSalvar = async () => {
    try {
      // Update kit product
      const { error: kitError } = await supabase
        .from('products')
        .update({
          name: formData.name,
          sku: formData.sku,
          description: formData.description,
          cost_price: parseFloat(formData.costPrice) || 0,
          sell_price: formData.sellPrice ? parseFloat(formData.sellPrice) : null,
          package_height: parseInt(formData.height) || 0,
          package_width: parseInt(formData.width) || 0,
          package_length: parseInt(formData.length) || 0,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          weight_type: formData.unitType || null,
          barcode: parseInt(formData.barcode) || 0,
          ncm: parseInt(formData.ncm) || 0,
          cest: formData.cest ? parseInt(formData.cest) : null,
          tax_origin_code: parseInt(formData.origin) || 0,
          image_urls: [] // TODO: Handle image uploads
        })
        .eq('id', id);

      if (kitError) {
        console.error('Error updating kit product:', kitError);
        toast({
          title: "Error",
          description: "Error saving product",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Kit updated successfully",
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Error saving product",
        variant: "destructive",
      });
    }
  };

  const formDataPT = {
    tipo: formData.type,
    nome: formData.name,
    sku: formData.sku,
    categoria: formData.category,
    marca: formData.brand,
    descricao: formData.description,
    precoCusto: formData.costPrice,
    precoVenda: formData.sellPrice,
    estoque: formData.stock,
    armazem: formData.warehouse,
    altura: formData.height,
    largura: formData.width,
    comprimento: formData.length,
    peso: formData.weight,
    tipoUnidade: formData.unitType,
    codigoBarras: formData.barcode,
    ncm: formData.ncm,
    cest: formData.cest,
    origem: formData.origin,
  };

  const handleInputChangePT = (field: string, value: string) => {
    // Convert Portuguese field names to English
    const fieldMap: Record<string, string> = {
      nome: 'name',
      sku: 'sku',
      categoria: 'category',
      marca: 'brand',
      descricao: 'description',
      precoCusto: 'costPrice',
      precoVenda: 'sellPrice',
      estoque: 'stock',
      armazem: 'warehouse',
      altura: 'height',
      largura: 'width',
      comprimento: 'length',
      peso: 'weight',
      tipoUnidade: 'unitType',
      codigoBarras: 'barcode',
      ncm: 'ncm',
      cest: 'cest',
      origem: 'origin',
    };
    const englishField = fieldMap[field] || field;
    handleInputChange(englishField, value);
  };

  const kitItemsPT = kitItems.map(item => ({
    id: item.id,
    nome: item.name,
    sku: item.sku,
    tipo: item.type,
    quantidade: item.quantity,
    imagem: item.image
  }));

  const handleKitItemsChange = (items: any[]) => {
    // Convert back to English format
    const englishItems: KitItem[] = items.map(item => ({
      id: item.id,
      name: item.nome || item.name,
      sku: item.sku,
      type: item.tipo || item.type,
      quantity: item.quantidade || item.quantity,
      image: item.imagem || item.image
    }));
    setKitItems(englishItems);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Kit</h1>
          <p className="text-gray-600">SKU: {formData.sku}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleVoltar}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleSalvar} className="bg-novura-primary hover:bg-novura-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Accordion Form */}
      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible defaultValue="informacoes-basicas" className="w-full">
            {/* Step 1 - Basic Information */}
            <AccordionItem value="informacoes-basicas">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">1</span>
                  <span className="font-medium">Basic Information</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <ProductForm 
                  formData={formDataPT} 
                  onInputChange={handleInputChangePT} 
                  includeSku={true} 
                />
              </AccordionContent>
            </AccordionItem>

            {/* Step 2 - Photos */}
            <AccordionItem value="fotos">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">2</span>
                  <span className="font-medium">Kit Photos</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <ImageUpload 
                  selectedImages={selectedImages} 
                  onImagesChange={setSelectedImages} 
                />
              </AccordionContent>
            </AccordionItem>

            {/* Step 3 - Kit Products */}
            <AccordionItem value="produtos-kit">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">3</span>
                  <span className="font-medium">Kit Products</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <KitForm 
                  formData={formDataPT} 
                  onInputChange={handleInputChangePT}
                  etapaAtual={kitEtapa}
                  onEtapaChange={setKitEtapa}
                  kitItems={kitItemsPT}
                  onKitItemsChange={handleKitItemsChange}
                  editMode={true}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Step 4 - Link Ads */}
            <AccordionItem value="vinculos">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">4</span>
                  <span className="font-medium">Link Ads</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Link functionality in development</p>
                  <Button variant="outline" disabled>
                    Manage Links
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
