
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Variacao } from "./types";

interface BulkTaxFormProps {
  variacoes: Variacao[];
  onVariacoesChange: (variacoes: Variacao[]) => void;
}

export function BulkTaxForm({ variacoes, onVariacoesChange }: BulkTaxFormProps) {
  const [bulkData, setBulkData] = useState({
    ncm: "",
    cest: "",
    unidade: "",
    origem: ""
  });

  const handleBulkInputChange = (field: string, value: string) => {
    setBulkData(prev => ({ ...prev, [field]: value }));
  };

  const applyBulkData = () => {
    const updatedVariacoes = variacoes.map(variacao => ({
      ...variacao,
      ...(bulkData.ncm && { ncm: bulkData.ncm }),
      ...(bulkData.cest && { cest: bulkData.cest }),
      ...(bulkData.unidade && { unidade: bulkData.unidade }),
      ...(bulkData.origem && { origem: bulkData.origem })
    }));
    
    onVariacoesChange(updatedVariacoes);
  };

  const clearBulkData = () => {
    setBulkData({
      ncm: "",
      cest: "",
      unidade: "",
      origem: ""
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg">Aplicar Dados em Massa</CardTitle>
        <CardDescription>
          Preencha os campos abaixo para aplicar as mesmas informações fiscais a todas as variações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="bulk-ncm">NCM</Label>
            <Input
              id="bulk-ncm"
              value={bulkData.ncm}
              onChange={(e) => handleBulkInputChange("ncm", e.target.value)}
              placeholder="00000000"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="bulk-cest">CEST</Label>
            <Input
              id="bulk-cest"
              value={bulkData.cest}
              onChange={(e) => handleBulkInputChange("cest", e.target.value)}
              placeholder="0000000"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="bulk-unidade">Unidade de Medida</Label>
            <Select
              value={bulkData.unidade}
              onValueChange={(value) => handleBulkInputChange("unidade", value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione a unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UN">Unidade (UN)</SelectItem>
                <SelectItem value="PC">Peça (PC)</SelectItem>
                <SelectItem value="KG">Quilograma (KG)</SelectItem>
                <SelectItem value="LT">Litro (LT)</SelectItem>
                <SelectItem value="MT">Metro (MT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="bulk-origem">Origem</Label>
            <Select
              value={bulkData.origem}
              onValueChange={(value) => handleBulkInputChange("origem", value)}
            >
              <SelectTrigger className="mt-2">
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

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={applyBulkData}
            className="bg-novura-primary hover:bg-novura-primary/90"
          >
            Aplicar a Todas as Variações
          </Button>
          <Button variant="outline" onClick={clearBulkData}>
            Limpar Campos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
