'use client';

import { useAnamneseStore, ActivityLevel } from '@/stores/anamneseStore';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const ACTIVITY_OPTIONS: { id: ActivityLevel; emoji: string; title: string; desc: string }[] = [
    {
        id: 'sedentary',
        emoji: '🛋️',
        title: 'Sedentário',
        desc: 'Trabalho de escritório, pouco ou nenhum exercício.',
    },
    {
        id: 'lightly_active',
        emoji: '🚶',
        title: 'Levemente Ativo',
        desc: 'Exercício leve 1-3 dias/semana.',
    },
    {
        id: 'moderately_active',
        emoji: '🏃',
        title: 'Moderado',
        desc: 'Exercício moderado 3-5 dias/semana.',
    },
    {
        id: 'very_active',
        emoji: '🏋️',
        title: 'Muito Ativo',
        desc: 'Exercício pesado 6-7 dias/semana.',
    },
    {
        id: 'extra_active',
        emoji: '🔥',
        title: 'Atleta',
        desc: 'Treino muito pesado 2x por dia ou trabalho físico.',
    },
];

export function StepRoutine() {
    const { data, updateData, nextStep, prevStep } = useAnamneseStore();

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Como é sua rotina?</h2>
                <p className="text-muted-foreground">Seja honesto! Isso afeta muito o cálculo.</p>
            </div>

            <div className="space-y-3">
                {ACTIVITY_OPTIONS.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => updateData({ activityLevel: option.id })}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] flex items-center gap-4 ${data.activityLevel === option.id
                            ? 'border-neon-green bg-neon-green/10 shadow-lg shadow-neon-green/10'
                            : 'border-border/50 bg-card hover:border-neon-green/50'
                            }`}
                    >
                        <div className="text-3xl">{option.emoji}</div>
                        <div>
                            <div className={`font-bold ${data.activityLevel === option.id ? 'text-neon-green' : ''}`}>
                                {option.title}
                            </div>
                            <div className="text-sm text-muted-foreground">{option.desc}</div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="pt-4 flex gap-4">
                <Button variant="ghost" onClick={prevStep} className="flex-1">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
                </Button>
                <Button onClick={nextStep} className="flex-[2] bg-white text-black font-bold hover:bg-gray-200">
                    Próximo <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
