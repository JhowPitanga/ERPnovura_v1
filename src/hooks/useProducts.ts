import { useState, useEffect } from "react";
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "@/components/ui/use-toast";

interface Product {
    id: string;
    name: string;
    sku: string;
}

// Hook para buscar produtos que podem ser vinculados
export function useBindableProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchBindableProducts = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('products')
                    .select('id, name, sku')
                    .eq('user_id', user.id)
                    .not('sku', 'is', null)
                    .order('name', { ascending: true });

                if (error) {
                    throw error;
                }

                setProducts(data as Product[]);
            } catch (err: any) {
                console.error("Erro ao carregar produtos para vincular:", err);
                setError(err.message);
                toast({
                    title: "Erro",
                    description: "Erro ao carregar produtos para vincular.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBindableProducts();
    }, [user]);

    return { products, loading, error };
}

// ---

// Hook para criar um produto
export function useCreateProduct() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createProduct = async (productData: any) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('products')
                .insert([productData])
                .select();

            if (error) {
                throw error;
            }
            console.log('Produto criado com sucesso:', data);
            return data;
        } catch (err: any) {
            setError(err.message);
            console.error("Erro na criação do produto:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createProduct, loading, error };
}