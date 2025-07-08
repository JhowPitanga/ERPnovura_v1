import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Package, Layers, Package2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const steps = [
  { id: 1, title: "Tipo de Produto", description: "Escolha o tipo de produto" },
  { id: 2, title: "Informações Principais", description: "Dados básicos do produto" },
  { id: 3, title: "Preços e Estoque", description: "Definições comerciais" },
  { id: 4, title: "Detalhes Técnicos", description: "Dimensões e classificações" },
];

export function CriarProduto() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [productType, setProductType] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    tipo: "",
    nome: "",
    sku: "",
    categoria: "",
    marca: "",
    descricao: "",
    precoVenda: "",
    precoCusto: "",
    estoque: "",
    armazem: "",
    altura: "",
    largura: "",
    comprimento: "",
    peso: "",
    ncm: "",
    cest: "",
    unidade: "",
    origem: "",
  });

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const remainingSlots = 8 - selectedImages.length;
    const filesToAdd = files.slice(0, remainingSlots);
    
    setSelectedImages(prev => [...prev, ...filesToAdd]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Salvar produto e voltar para a lista
    navigate('/produtos');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/produtos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Criar Novo Produto</h1>
            <p className="text-gray-600">Siga os passos para cadastrar seu produto</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.id
                      ? "bg-novura-primary border-novura-primary text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-gray-900">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.id ? "bg-novura-primary" : "bg-gray-300"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Selecione o tipo de produto</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        productType === "unico"
                          ? "border-novura-primary bg-novura-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        setProductType("unico");
                        handleInputChange("tipo", "unico");
                      }}
                    >
                      <Package className="w-8 h-8 text-novura-primary mb-3" />
                      <h4 className="font-semibold mb-2">Produto Único</h4>
                      <p className="text-sm text-gray-600">
                        Produto simples sem variações
                      </p>
                    </div>

                    <div
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        productType === "variacao"
                          ? "border-novura-primary bg-novura-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        setProductType("variacao");
                        handleInputChange("tipo", "variacao");
                      }}
                    >
                      <Layers className="w-8 h-8 text-novura-primary mb-3" />
                      <h4 className="font-semibold mb-2">Com Variações</h4>
                      <p className="text-sm text-gray-600">
                        Produto com cores, tamanhos, etc.
                      </p>
                    </div>

                    <div
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        productType === "kit"
                          ? "border-novura-primary bg-novura-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        setProductType("kit");
                        handleInputChange("tipo", "kit");
                      }}
                    >
                      <Package2 className="w-8 h-8 text-novura-primary mb-3" />
                      <h4 className="font-semibold mb-2">Kit</h4>
                      <p className="text-sm text-gray-600">
                        Conjunto de produtos vendidos juntos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informações Principais</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome do Produto *</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => handleInputChange("nome", e.target.value)}
                        placeholder="Digite o nome do produto"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU *</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => handleInputChange("sku", e.target.value)}
                        placeholder="Código único do produto"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoria">Categoria</Label>
                      <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                          <SelectItem value="roupas">Roupas</SelectItem>
                          <SelectItem value="casa">Casa e Decoração</SelectItem>
                          <SelectItem value="esporte">Esporte e Lazer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="marca">Marca</Label>
                      <Input
                        id="marca"
                        value={formData.marca}
                        onChange={(e) => handleInputChange("marca", e.target.value)}
                        placeholder="Marca do produto"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) => handleInputChange("descricao", e.target.value)}
                      placeholder="Descreva o produto detalhadamente"
                      rows={4}
                    />
                  </div>
                  <div className="mt-4">
                    <Label>Imagens do Produto (até 8 fotos)</Label>
                    <div className="grid grid-cols-4 gap-4 mt-2">
                      {/* Imagens selecionadas */}
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative">
                          <div className="aspect-square border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Imagem ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      
                      {/* Quadros para adicionar novas imagens */}
                      {Array.from({ length: 8 - selectedImages.length }).map((_, index) => (
                        <div key={`empty-${index}`} className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            id={`image-upload-${index}`}
                          />
                          <label
                            htmlFor={`image-upload-${index}`}
                            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
                          >
                            <Plus className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500 text-center">
                              Adicionar foto
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB por imagem.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Preços e Estoque</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="precoVenda">Preço de Venda *</Label>
                      <Input
                        id="precoVenda"
                        type="number"
                        step="0.01"
                        value={formData.precoVenda}
                        onChange={(e) => handleInputChange("precoVenda", e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="precoCusto">Preço de Custo</Label>
                      <Input
                        id="precoCusto"
                        type="number"
                        step="0.01"
                        value={formData.precoCusto}
                        onChange={(e) => handleInputChange("precoCusto", e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="estoque">Quantidade em Estoque</Label>
                      <Input
                        id="estoque"
                        type="number"
                        value={formData.estoque}
                        onChange={(e) => handleInputChange("estoque", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="armazem">Armazém</Label>
                      <Select value={formData.armazem} onValueChange={(value) => handleInputChange("armazem", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o armazém" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="principal">Armazém Principal</SelectItem>
                          <SelectItem value="secundario">Armazém Secundário</SelectItem>
                          <SelectItem value="externo">Armazém Externo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Detalhes Técnicos</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="altura">Altura (cm)</Label>
                      <Input
                        id="altura"
                        type="number"
                        step="0.1"
                        value={formData.altura}
                        onChange={(e) => handleInputChange("altura", e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="largura">Largura (cm)</Label>
                      <Input
                        id="largura"
                        type="number"
                        step="0.1"
                        value={formData.largura}
                        onChange={(e) => handleInputChange("largura", e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="comprimento">Comprimento (cm)</Label>
                      <Input
                        id="comprimento"
                        type="number"
                        step="0.1"
                        value={formData.comprimento}
                        onChange={(e) => handleInputChange("comprimento", e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="peso">Peso (kg)</Label>
                      <Input
                        id="peso"
                        type="number"
                        step="0.001"
                        value={formData.peso}
                        onChange={(e) => handleInputChange("peso", e.target.value)}
                        placeholder="0.000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ncm">NCM *</Label>
                      <Input
                        id="ncm"
                        value={formData.ncm}
                        onChange={(e) => handleInputChange("ncm", e.target.value)}
                        placeholder="00000000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cest">CEST (Opcional)</Label>
                      <Input
                        id="cest"
                        value={formData.cest}
                        onChange={(e) => handleInputChange("cest", e.target.value)}
                        placeholder="0000000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unidade">Unidade</Label>
                      <Select value={formData.unidade} onValueChange={(value) => handleInputChange("unidade", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="un">Unidade</SelectItem>
                          <SelectItem value="kg">Quilograma</SelectItem>
                          <SelectItem value="g">Grama</SelectItem>
                          <SelectItem value="l">Litro</SelectItem>
                          <SelectItem value="ml">Mililitro</SelectItem>
                          <SelectItem value="m">Metro</SelectItem>
                          <SelectItem value="cm">Centímetro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="origem">Origem</Label>
                      <Select value={formData.origem} onValueChange={(value) => handleInputChange("origem", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a origem" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - Nacional</SelectItem>
                          <SelectItem value="1">1 - Estrangeira - Importação direta</SelectItem>
                          <SelectItem value="2">2 - Estrangeira - Adquirida no mercado interno</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <div className="flex space-x-2">
            {currentStep < 4 ? (
              <Button onClick={nextStep} className="bg-novura-primary hover:bg-novura-primary/90">
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-2" />
                Salvar Produto
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
