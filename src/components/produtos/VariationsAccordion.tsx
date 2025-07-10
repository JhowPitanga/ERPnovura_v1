
import { MoreHorizontal, Edit, Copy, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface VariationsAccordionProps {
  products: any[];
}

export function VariationsAccordion({ products }: VariationsAccordionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <Accordion type="single" collapsible className="w-full">
          {products.map((produto) => (
            <AccordionItem key={produto.id} value={`item-${produto.id}`}>
              <AccordionTrigger>
                <div className="flex justify-between items-center w-full pr-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={produto.image}
                      alt={produto.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    />
                    <span className="font-medium">{produto.name}</span>
                  </div>
                  <Badge variant="outline">{produto.variacoes.length} variações</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Tamanho</TableHead>
                        <TableHead>Cor</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Estoque</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {produto.variacoes.map((variacao: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-sm">{variacao.sku}</TableCell>
                          <TableCell>{variacao.tamanho}</TableCell>
                          <TableCell>{variacao.cor}</TableCell>
                          <TableCell>R$ {variacao.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={variacao.stock < 10 ? "text-red-600 font-medium" : "text-gray-900"}>
                              {variacao.stock}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => window.location.href = `/produtos/editar-variacao/${produto.id}`}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Duplicar
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
