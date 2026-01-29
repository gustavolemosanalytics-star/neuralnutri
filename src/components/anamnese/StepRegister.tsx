'use client';

import { useState } from 'react';
import { useAnamneseStore } from '@/stores/anamneseStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function StepRegister() {
    const { data } = useAnamneseStore();
    const [name, setName] = useState(data.name || '');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    stats: {
                        peso: data.weight,
                        altura: data.height,
                        idade: data.age,
                        sexo: data.gender,
                        nivelAtividade: data.activityLevel,
                        objetivo: data.goal,
                    }
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Erro ao registrar');
            }

            // After register, sign in automatically
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                throw new Error('Conta criada, mas erro ao fazer login automático.');
            }

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-sm mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Salve seu progresso</h2>
                <p className="text-muted-foreground">Crie sua conta para acessar seu plano de qualquer lugar.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Como quer ser chamado?</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                        required
                        className="bg-card/50"
                    />
                </div>

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
                            className="pl-10 bg-card/50"
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
                            className="pl-10 bg-card/50"
                        />
                    </div>
                </div>

                {error && <p className="text-red-500 text-xs italic">{error}</p>}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-white text-black font-bold hover:bg-gray-200 mt-4 rounded-xl"
                >
                    {isLoading ? (
                        <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando... </>
                    ) : (
                        <> Concluir e Salvar <ArrowRight className="ml-2 w-4 h-4" /> </>
                    )}
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
                Já tem uma conta?{' '}
                <button
                    onClick={() => router.push('/login')}
                    className="text-neon-green font-semibold hover:underline bg-transparent border-none p-0"
                >
                    Entrar aqui
                </button>
            </p>
        </div>
    );
}
