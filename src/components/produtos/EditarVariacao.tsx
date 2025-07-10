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
import { VariationForm } from "./criar/VariationForm";
import { VariationDimensionsForm } from "./criar/VariationDimensionsForm";
import { VariationTaxForm } from "./criar/VariationTaxForm";
import { FormData, Variacao, TipoVariacao } from "./criar/types";

export function EditarVariacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [variationEtapa, setVariationEtapa] = useState<"tipos" | "opcoes" | "configuracao">("configuracao");
  const [tiposVariacao, setTiposVariacao] = useState<TipoVariacao[]>([]);
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    tipo: "variacao",
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

  const fetchVariationProduct = async () => {
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
      // Fetch main product
      const { data: mainProduct, error: mainError } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .eq('id', id)
        .single();

      if (mainError) {
        console.error('Error fetching main product:', mainError);
        toast({
          title: "Erro",
          description: "Produto não encontrado",
          variant: "destructive",
        });
        navigate("/produtos");
        return;
      }

      // Fetch variations (products with same group ID)
      const { data: variations, error: variationsError } = await supabase
        .from('product_group_members')
        .select(`
          product_id,
          products (
            *,
            products_stock (
              current,
              in_transit,
              reserved,
              storage (
                id,
                name
              )
            )
          )
        `)
        .eq('product_group_id', mainProduct.id);

      if (variationsError) {
        console.error('Error fetching variations:', variationsError);
      }

      // Transform data
      const transformedFormData: FormData = {
        tipo: "variacao",
        nome: mainProduct.name,
        sku: "", // Not applicable for variation groups
        categoria: mainProduct.categories?.name || "",
        marca: "",
        descricao: mainProduct.description || "",
        precoCusto: mainProduct.cost_price?.toString() || "",
        precoVenda: mainProduct.sell_price?.toString() || "",
        estoque: "",
        armazem: "",
        altura: mainProduct.package_height?.toString() || "",
        largura: mainProduct.package_width?.toString() || "",
        comprimento: mainProduct.package_length?.toString() || "",
        peso: mainProduct.weight?.toString() || "",
        tipoUnidade: mainProduct.weight_type || "",
        codigoBarras: mainProduct.barcode?.toString() || "",
        ncm: mainProduct.ncm?.toString() || "",
        cest: mainProduct.cest?.toString() || "",
        origem: mainProduct.tax_origin_code?.toString() || "",
      };

      // Transform variations
      const transformedVariations: Variacao[] = variations?.map((v: any, index: number) => ({
        id: v.products.id,
        nome: v.products.name,
        sku: v.products.sku,
        ean: v.products.barcode?.toString() || "",
        precoCusto: v.products.cost_price?.toString() || "",
        imagens: [], // Initialize as empty File array - existing images would need to be converted
        cor: v.products.color || "",
        tamanho: v.products.size || "",
      })) || [];

      setFormData(transformedFormData);
      setVariacoes(transformedVariations);
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
    fetchVariationProduct();
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVoltar = () => {
    navigate("/produtos");
  };

  const handleSalvar = async () => {
    try {
      // Update main product
      const { error: mainError } = await supabase
        .from('products')
        .update({
          name: formData.nome,
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
        })
        .eq('id', id);

      if (mainError) {
        console.error('Error updating main product:', mainError);
        toast({
          title: "Erro",
          description: "Erro ao salvar produto principal",
          variant: "destructive",
        });
        return;
      }

      // Update variations
      for (const variacao of variacoes) {
        const { error: varError } = await supabase
          .from('products')
          .update({
            name: variacao.nome,
            sku: variacao.sku,
            cost_price: parseFloat(variacao.precoCusto) || 0,
            barcode: parseInt(variacao.ean) || 0,
            color: variacao.cor || null,
            size: variacao.tamanho || null,
            image_urls: [] // TODO: Handle File[] to string[] conversion for image uploads
          })
          .eq('id', variacao.id);

        if (varError) {
          console.error('Error updating variation:', varError);
        }
      }

      toast({
        title: "Sucesso",
        description: "Produto com variações atualizado com sucesso",
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
            <Skeleton className="h-8 w-64 mb-2" />
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
              {[...Array(6)].map((_, i) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Editar Produto com Variações</h1>
          <p className="text-gray-600">{formData.nome}</p>
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
                  includeSku={false} 
                />
              </AccordionContent>
            </AccordionItem>

            {/* Passo 2 - Configuração das Variações */}
            <AccordionItem value="variacoes">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">2</span>
                  <span className="font-medium">Configuração das Variações</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <VariationForm 
                  variacoes={variacoes} 
                  onVariacoesChange={setVariacoes}
                  etapaAtual={variationEtapa}
                  onEtapaChange={setVariationEtapa}
                  tiposVariacao={tiposVariacao}
                  onTiposVariacaoChange={setTiposVariacao}
                  editMode={true}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Passo 3 - Dimensões */}
            <AccordionItem value="dimensoes">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">3</span>
                  <span className="font-medium">Dimensões das Variações</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <VariationDimensionsForm 
                  variacoes={variacoes} 
                  onVariacoesChange={setVariacoes} 
                />
              </AccordionContent>
            </AccordionItem>

            {/* Passo 4 - Informações Fiscais */}
            <AccordionItem value="fiscais">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-novura-primary text-white rounded-full text-sm font-medium">4</span>
                  <span className="font-medium">Informações Fiscais das Variações</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <VariationTaxForm 
                  variacoes={variacoes} 
                  onVariacoesChange={setVariacoes} 
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}