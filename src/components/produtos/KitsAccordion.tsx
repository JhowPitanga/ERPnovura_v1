
import { MoreHorizontal, Edit, Copy, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface KitsAccordionProps {
  kits: any[];
}

export function KitsAccordion({ kits }: KitsAccordionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <Accordion type="single" collapsible className="w-full">
          {kits.map((kit) => (
            <AccordionItem key={kit.id} value={`kit-${kit.id}`}>
              <AccordionTrigger>
                <div className="flex justify-between items-center w-full pr-4">
                  <div className="flex items-center space-x-4 text-left">
                    <img
                      src={kit.image}
                      alt={kit.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    />
                    <div>
                      <span className="font-medium block">{kit.name}</span>
                      <span className="text-sm text-gray-500">SKU: {kit.sku}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">R$ {kit.price.toFixed(2)}</span>
                    <Badge variant="outline" className="ml-2">{kit.produtos.length} itens</Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {kit.produtos.map((produto: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{produto.name}</TableCell>
                          <TableCell className="font-mono text-sm">{produto.sku}</TableCell>
                          <TableCell>{produto.quantidade}x</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => window.location.href = `/produtos/editar-kit/${kit.id}`}>
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
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Estoque disponível:</span>
                      <span className={kit.stock < 10 ? "text-red-600 font-medium" : "text-gray-900 font-medium"}>
                        {kit.stock} kits
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
