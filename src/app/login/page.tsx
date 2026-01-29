'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Brain, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError('E-mail ou senha incorretos');
                setIsLoading(false);
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError('Erro ao fazer login');
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-neon-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neon-green/20 shadow-[0_0_20px_rgba(57,255,20,0.2)]">
                        <Brain className="w-8 h-8 text-neon-green" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                        Bem-vindo de volta
                    </h1>
                    <p className="text-muted-foreground mt-2">Entre para ver seu progresso neural.</p>
                </div>

                <Card className="p-8 glass border-white/5 shadow-2xl rounded-3xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    required
                                    className="pl-10 bg-white/5"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="pl-10 bg-white/5"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-xs italic">{error}</p>}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-white text-black font-bold hover:bg-gray-200 mt-4 rounded-xl"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    Não tem uma conta?{' '}
                    <Link href="/anamnese" className="text-neon-green font-semibold hover:underline">
                        Comece por aqui
                    </Link>
                </p>
            </motion.div>
        </main>
    );
}
