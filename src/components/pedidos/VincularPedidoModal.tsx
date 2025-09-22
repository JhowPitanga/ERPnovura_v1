import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Check, Link, X, ArrowRight } from "lucide-react";
import { useBindableProducts } from '@/hooks/useProducts';
import { toast } from '@/components/ui/use-toast';

interface Product {
    id: string;
    name: string;
    sku: string;
    image_url?: string; // Adicionando a URL da imagem para a tipagem
}

interface AnuncioParaVincular {
    id: string;
    nome: string;
    quantidade: number;
    marketplace: string;
    produtoERPId?: string;
}

interface VincularPedidoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (vinculos: any) => void;
    pedidoId: string;
    anunciosParaVincular: AnuncioParaVincular[];
}

export function VincularPedidoModal({ isOpen, onClose, onSave, pedidoId, anunciosParaVincular }: VincularPedidoModalProps) {
    const { products, loading, error } = useBindableProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAnuncio, setSelectedAnuncio] = useState<string | null>(null);
    const [vinculacoes, setVinculacoes] = useState<{ [anuncioId: string]: string }>({});

    // Filtra os produtos com base no termo de busca
    const filteredProducts = products.filter(produto =>
        produto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleProductSelect = (productId: string) => {
        if (!selectedAnuncio) {
            toast({
                title: "Selecione um anúncio",
                description: "Por favor, clique em um anúncio à esquerda para vincular um produto.",
                variant: "destructive",
            });
            return;
        }
        setVinculacoes(prev => ({
            ...prev,
            [selectedAnuncio]: productId
        }));
        setSelectedAnuncio(null);
    };

    const handleSave = () => {
        // Envia as vinculações para a função onSave do componente pai
        onSave(vinculacoes);
        onClose();
        toast({
            title: "Vinculação salva!",
            description: "Os anúncios foram vinculados com sucesso. O pedido será movido para a próxima etapa.",
            variant: "success",
        });
    };

    const handleRemoveVinculo = (anuncioId: string) => {
        setVinculacoes(prev => {
            const newVinculacoes = { ...prev };
            delete newVinculacoes[anuncioId];
            return newVinculacoes;
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-5xl p-0">
                <div className="flex min-h-[600px]">
                    {/* Coluna da Esquerda: Anúncios do Pedido */}
                    <div className="w-1/2 p-6 border-r flex flex-col">
                        <DialogHeader className="mb-4">
                            <DialogTitle>Itens do Pedido ({pedidoId})</DialogTitle>
                            <DialogDescription>
                                <strong>1. Selecione um anúncio</strong> para vincular um produto.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto pr-2">
                            <ul className="space-y-4">
                                {anunciosParaVincular.length > 0 ? (
                                    anunciosParaVincular.map((anuncio) => {
                                        const isSelected = selectedAnuncio === anuncio.id;
                                        const produtoVinculado = vinculacoes[anuncio.id];

                                        return (
                                            <li
                                                key={anuncio.id}
                                                className={`p-4 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                                                    isSelected ? 'border-primary ring-2 ring-primary/50 bg-primary/10' : ''
                                                } ${
                                                    produtoVinculado ? 'bg-green-50' : 'hover:bg-gray-50'
                                                }`}
                                                onClick={() => setSelectedAnuncio(anuncio.id)}
                                            >
                                                <div>
                                                    <div className="font-semibold">{anuncio.nome}</div>
                                                    <div className="text-sm text-gray-500">Marketplace: {anuncio.marketplace}</div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="text-sm font-medium">Qtd: {anuncio.quantidade}</div>
                                                    {produtoVinculado && (
                                                        <Check className="w-5 h-5 text-green-600" />
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-gray-500">Nenhum anúncio para vincular.</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Coluna da Direita: Produtos do ERP */}
                    <div className="w-1/2 p-6 flex flex-col">
                        <DialogHeader className="mb-4">
                            <DialogTitle>Produtos Cadastrados</DialogTitle>
                            <DialogDescription>
                                <strong>2. Clique em 'Vincular'</strong> no produto desejado.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar produtos..."
                                className="h-10 w-full pl-10 pr-4 rounded-lg border"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2">
                            {loading && (
                                <div className="text-center text-gray-500">Carregando produtos...</div>
                            )}
                            {error && (
                                <div className="text-center text-red-500">Erro ao carregar produtos.</div>
                            )}
                            {!loading && !error && (
                                <ul className="space-y-4">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((produto) => {
                                            return (
                                                <li
                                                    key={produto.id}
                                                    className={`p-4 rounded-lg border flex items-center justify-between transition-colors hover:bg-gray-50`}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        {/* Imagem do produto */}
                                                        {produto.image_url ? (
                                                            <img src={produto.image_url} alt={produto.name} className="w-12 h-12 object-cover rounded-md" />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">Sem Foto</div>
                                                        )}
                                                        <div>
                                                            <div className="font-semibold">{produto.name}</div>
                                                            <div className="text-sm text-gray-500">SKU: {produto.sku}</div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        className="bg-primary text-white text-sm px-4 py-2 rounded-lg"
                                                        onClick={() => handleProductSelect(produto.id)}
                                                        disabled={!selectedAnuncio}
                                                    >
                                                        <Link className="h-4 w-4 mr-2" />
                                                        Vincular
                                                    </Button>
                                                </li>
                                            );
                                        })
                                    ) : (
                                        <p className="text-center text-gray-500">Nenhum produto encontrado.</p>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Seção de Confirmação de Vinculações */}
                {Object.keys(vinculacoes).length > 0 && (
                    <>
                        <div className="p-6 pt-0 border-t bg-gray-50">
                            <h3 className="text-lg font-semibold mb-2">3. Confirme as Vinculações</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {anunciosParaVincular
                                    .filter(anuncio => vinculacoes[anuncio.id])
                                    .map(anuncio => {
                                        const produtoVinculado = products.find(p => p.id === vinculacoes[anuncio.id]);
                                        return (
                                            <div key={anuncio.id} className="p-4 rounded-lg border bg-white flex flex-col justify-between">
                                                <div className="font-semibold text-sm mb-1">{anuncio.nome}</div>
                                                <div className="flex items-center text-xs text-gray-600">
                                                    <div className="flex items-center flex-1">
                                                        {/* Foto do produto vinculado */}
                                                        {produtoVinculado?.image_url ? (
                                                            <img src={produtoVinculado.image_url} alt={produtoVinculado.name} className="w-8 h-8 object-cover rounded-md mr-2" />
                                                        ) : (
                                                            <div className="w-8 h-8 bg-gray-200 rounded-md mr-2 flex items-center justify-center text-xs text-gray-500">?</div>
                                                        )}
                                                        <ArrowRight className="h-4 w-4 text-primary mr-2" />
                                                        <div className="flex-1 font-medium">{produtoVinculado?.name || 'Produto não encontrado'}</div>
                                                    </div>
                                                    <Button variant="ghost" className="p-0 h-6 w-6 ml-auto" onClick={() => handleRemoveVinculo(anuncio.id)}>
                                                        <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </>
                )}

                <DialogFooter className="bg-gray-100 p-4 border-t flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={Object.keys(vinculacoes).length === 0}
                    >
                        <Check className="h-4 w-4 mr-2" />
                        Salvar Alterações
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}