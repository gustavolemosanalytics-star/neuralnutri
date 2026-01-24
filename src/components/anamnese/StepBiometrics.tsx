'use client';

import { useAnamneseStore } from '@/stores/anamneseStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, User } from 'lucide-react';

export function StepBiometrics() {
    const { data, updateData, nextStep } = useAnamneseStore();

    const isFormValid = data.name && data.age > 0 && data.weight > 0 && data.height > 0;

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Quem é você?</h2>
                <p className="text-muted-foreground">Precisamos desses dados para calcular seu TDEE.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Seu Nome</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="name"
                            placeholder="Ex: Gustavo"
                            className="pl-9 h-12 bg-muted/50 border-border/50 focus:border-neon-green/50 transition-colors"
                            value={data.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ name: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="age">Idade</Label>
                        <Input
                            id="age"
                            type="number"
                            className="h-12 bg-muted/50 border-border/50 text-center text-lg"
                            value={data.age || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ age: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Gênero</Label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => updateData({ gender: 'male' })}
                                className={`flex-1 h-12 rounded-lg border-2 flex items-center justify-center transition-all ${data.gender === 'male'
                                    ? 'border-neon-blue bg-neon-blue/10 text-neon-blue font-bold'
                                    : 'border-border/50 text-muted-foreground hover:border-border'
                                    }`}
                            >
                                Homem
                            </button>
                            <button
                                onClick={() => updateData({ gender: 'female' })}
                                className={`flex-1 h-12 rounded-lg border-2 flex items-center justify-center transition-all ${data.gender === 'female'
                                    ? 'border-neon-purple bg-neon-purple/10 text-neon-purple font-bold'
                                    : 'border-border/50 text-muted-foreground hover:border-border'
                                    }`}
                            >
                                Mulher
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="weight">Peso (kg)</Label>
                        <div className="relative">
                            <Input
                                id="weight"
                                type="number"
                                className="h-12 bg-muted/50 border-border/50 text-center text-lg pr-8"
                                value={data.weight || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ weight: parseFloat(e.target.value) || 0 })}
                            />
                            <span className="absolute right-3 top-3.5 text-xs text-muted-foreground font-medium">KG</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="height">Altura (cm)</Label>
                        <div className="relative">
                            <Input
                                id="height"
                                type="number"
                                className="h-12 bg-muted/50 border-border/50 text-center text-lg pr-8"
                                value={data.height || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ height: parseInt(e.target.value) || 0 })}
                            />
                            <span className="absolute right-3 top-3.5 text-xs text-muted-foreground font-medium">CM</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <Button
                    onClick={nextStep}
                    disabled={!isFormValid}
                    className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-gray-200"
                >
                    Próximo <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
