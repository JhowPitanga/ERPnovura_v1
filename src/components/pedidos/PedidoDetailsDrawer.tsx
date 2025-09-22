import { Pedido, Item } from "@/types/pedidos";
import { formatCurrency, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface PedidoDetailsDrawerProps {
    pedido: Pedido | null;
    onOpenChange: (open: boolean) => void;
    open: boolean;
}

export function PedidoDetailsDrawer({ pedido, onOpenChange, open }: PedidoDetailsDrawerProps) {
    if (!pedido) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pendente":
                return "bg-yellow-100 text-yellow-800";
            case "A vincular":
                return "bg-red-100 text-red-800";
            case "Emissao NF":
                return "bg-blue-100 text-blue-800";
            case "NF Emitida":
                return "bg-green-100 text-green-800";
            case "Aguardando Coleta":
                return "bg-purple-100 text-purple-800";
            case "Enviado":
                return "bg-teal-100 text-teal-800";
            case "Cancelado":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="w-full max-w-lg mx-auto p-4">
                <DrawerHeader>
                    <DrawerTitle>Detalhes do Pedido #{pedido.id}</DrawerTitle>
                    <DrawerDescription>Informações detalhadas sobre o pedido e seus itens.</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-semibold">Cliente:</p>
                            <p>{pedido.cliente}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Marketplace:</p>
                            <p>{pedido.marketplace}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Valor:</p>
                            <p>{pedido.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Status:</p>
                            <Badge className={getStatusColor(pedido.status)}>{pedido.status}</Badge>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Data:</p>
                            <p>{format(new Date(pedido.data), "dd/MM/yyyy", { locale: ptBR })}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">ID da Plataforma:</p>
                            <p>{pedido.idPlataforma}</p>
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-bold mt-4">Itens do Pedido</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Produto</TableHead>
                                <TableHead className="text-right">Qtd.</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pedido.itens.map((item: Item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.sku || "N/A"}</TableCell>
                                    <TableCell>{item.nome}</TableCell>
                                    <TableCell className="text-right">{item.quantidade}</TableCell>
                                    <TableCell className="text-right">{item.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline">Fechar</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}