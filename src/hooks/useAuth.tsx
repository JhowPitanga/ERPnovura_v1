import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<{ error: any }>;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log('Auth state changed:', event, session?.user?.email);
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('Initial session:', session?.user?.email);
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string) => {
        try {
            const redirectUrl = `${window.location.origin}/`;

            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: redirectUrl
                }
            });

            if (error) {
                let message = 'Erro ao criar conta';
                if (error.message.includes('already registered')) {
                    message = 'Este email já está cadastrado. Tente fazer login.';
                } else if (error.message.includes('password')) {
                    message = 'A senha deve ter pelo menos 6 caracteres.';
                } else if (error.message.includes('email')) {
                    message = 'Por favor, insira um email válido.';
                }

                toast({
                    title: "Erro no cadastro",
                    description: message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Conta criada com sucesso!",
                    description: "Verifique sua caixa de entrada para confirmar seu email.",
                });
            }

            return { error };
        } catch (err) {
            console.error('SignUp error:', err);
            return { error: err };
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                let message = 'Erro ao fazer login';
                if (error.message.includes('Invalid login credentials')) {
                    message = 'Email ou senha incorretos.';
                } else if (error.message.includes('Email not confirmed')) {
                    message = 'Por favor, confirme seu email antes de fazer login.';
                }

                toast({
                    title: "Erro no login",
                    description: message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Login realizado com sucesso!",
                    description: "Bem-vindo de volta.",
                });
            }

            return { error };
        } catch (err) {
            console.error('SignIn error:', err);
            return { error: err };
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            toast({
                title: "Logout realizado",
                description: "Você foi desconectado com sucesso.",
            });
        } catch (err) {
            console.error('SignOut error:', err);
            toast({
                title: "Erro",
                description: "Erro ao fazer logout.",
                variant: "destructive",
            });
        }
    };

    const value = {
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}