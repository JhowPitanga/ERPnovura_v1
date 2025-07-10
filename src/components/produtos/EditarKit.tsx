import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

// Import form components
import { ProductForm } from "./criar/ProductForm";
import { ImageUpload } from "./criar/ImageUpload";
import { KitForm } from "./criar/KitForm";
import { FormData, KitItem } from "./criar/types";

export function EditarKit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [kitEtapa, setKitEtapa] = useState<"info" | "produtos">("info");
  const [kitItems, setKitItems] = useState<KitItem[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    tipo: "kit",
    nome: "",
    sku: "",
    categoria: "",
    marca: "",
    descricao: "",
    precoCusto: "",
    precoVenda: "",
    estoque: "",
    armazem: "",
    altura: "",
    largura: "",
    comprimento: "",
    peso: "",
    tipoUnidade: "",
    codigoBarras: "",
    ncm: "",
    cest: "",
    origem: "",
  });

  const fetchKitProduct = async () => {
    if (!id) {
      toast({
        title: "Erro",
        description: "ID do produto não encontrado",
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
          title: "Erro",
          description: "Produto não encontrado",
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

      // Transform data
      const transformedFormData: FormData = {
        tipo: "kit",
        nome: kitProduct.name,
        sku: kitProduct.sku,
        categoria: kitProduct.categories?.name || "",
        marca: "",
        descricao: kitProduct.description || "",
        precoCusto: kitProduct.cost_price?.toString() || "",
        precoVenda: kitProduct.sell_price?.toString() || "",
        estoque: kitProduct.products_stock?.current?.toString() || "",
        armazem: kitProduct.products_stock?.[0]?.storage?.name || "Principal",
        altura: kitProduct.package_height?.toString() || "",
        largura: kitProduct.package_width?.toString() || "",
        comprimento: kitProduct.package_length?.toString() || "",
        peso: kitProduct.weight?.toString() || "",
        tipoUnidade: kitProduct.weight_type || "",
        codigoBarras: kitProduct.barcode?.toString() || "",
        ncm: kitProduct.ncm?.toString() || "",
        cest: kitProduct.cest?.toString() || "",
        origem: kitProduct.tax_origin_code?.toString() || "",
      };

      // Transform kit items
      const transformedKitItems: KitItem[] = kitMembers?.map((member: any) => ({
        id: member.products.id,
        name: member.products.name,
        sku: member.products.sku,
        quantidade: 1, // Default quantity, this should be stored in the junction table
        type: member.products.type === 'VARIANT' ? 'variacao' : 'unico'
      })) || [];

      setFormData(transformedFormData);
      setKitItems(transformedKitItems);
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Erro",
        description: "Erro ao carregar produto",
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
          name: formData.nome,
          sku: formData.sku,
          description: formData.descricao,
          cost_price: parseFloat(formData.precoCusto) || 0,
          sell_price: formData.precoVenda ? parseFloat(formData.precoVenda) : null,
          package_height: parseInt(formData.altura) || 0,
          package_width: parseInt(formData.largura) || 0,
          package_length: parseInt(formData.comprimento) || 0,
          weight: formData.peso ? parseFloat(formData.peso) : null,
          weight_type: formData.tipoUnidade || null,
          barcode: parseInt(formData.codigoBarras) || 0,
          ncm: parseInt(formData.ncm) || 0,
          cest: formData.cest ? parseInt(formData.cest) : null,
          tax_origin_code: parseInt(formData.origem) || 0,
          image_urls: [] // TODO: Handle image uploads
        })
        .eq('id', id);

      if (kitError) {
        console.error('Error updating kit product:', kitError);
        toast({
          title: "Erro",
          description: "Erro ao salvar produto",
          variant: "destructive",
        });
        return;
      }

      // TODO: Update kit members relationships
      // This would require updating the product_group_members table

      toast({
        title: "Sucesso",
        description: "Kit atualizado com sucesso",
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Erro",
        description: "Erro ao salvar produto",
        variant: "destructive",
      });
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Editar Kit</h1>
          <p className="text-gray-600">SKU: {formData.sku}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleVoltar}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={handleSalvar} className="bg-novura-primary hover:bg-novura-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Accordion Form */}
      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible defaultValue="informacoes-basicas" className="w-full">
            {/* Passo 1 - Informações Básicas */}
            <AccordionItem value="informacoes-basicas">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">1</span>
                  <span className="font-medium">Informações Básicas</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <ProductForm 
                  formData={formData} 
                  onInputChange={handleInputChange} 
                  includeSku={true} 
                />
              </AccordionContent>
            </AccordionItem>

            {/* Passo 2 - Fotos */}
            <AccordionItem value="fotos">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">2</span>
                  <span className="font-medium">Fotos do Kit</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <ImageUpload 
                  selectedImages={selectedImages} 
                  onImagesChange={setSelectedImages} 
                />
              </AccordionContent>
            </AccordionItem>

            {/* Passo 3 - Produtos do Kit */}
            <AccordionItem value="produtos-kit">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">3</span>
                  <span className="font-medium">Produtos do Kit</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <KitForm 
                  formData={formData} 
                  onInputChange={handleInputChange}
                  etapaAtual={kitEtapa}
                  onEtapaChange={setKitEtapa}
                  kitItems={kitItems}
                  onKitItemsChange={setKitItems}
                  editMode={true}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Passo 4 - Vincular Anúncios */}
            <AccordionItem value="vinculos">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">4</span>
                  <span className="font-medium">Vincular Anúncios</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Funcionalidade de vínculos em desenvolvimento</p>
                  <Button variant="outline" disabled>
                    Gerenciar Vínculos
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