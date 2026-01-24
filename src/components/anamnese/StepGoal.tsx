'use client';

import { useAnamneseStore, Goal } from '@/stores/anamneseStore';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, TrendingDown, Minus, TrendingUp } from 'lucide-react';

const GOAL_OPTIONS: { id: Goal; icon: React.ReactNode; title: string; desc: string; color: string }[] = [
    {
        id: 'lose_weight',
        icon: <TrendingDown className="w-8 h-8" />,
        title: 'Perder Peso',
        desc: 'Queimar gordura definindo o corpo.',
        color: 'text-neon-orange border-neon-orange bg-neon-orange/10',
    },
    {
        id: 'maintain',
        icon: <Minus className="w-8 h-8" />,
        title: 'Manter Peso',
        desc: 'Manter a forma atual com mais saúde.',
        color: 'text-neon-blue border-neon-blue bg-neon-blue/10',
    },
    {
        id: 'gain_muscle',
        icon: <TrendingUp className="w-8 h-8" />,
        title: 'Ganhar Massa',
        desc: 'Hipertrofia e ganho de força.',
        color: 'text-neon-purple border-neon-purple bg-neon-purple/10',
    },
];

export function StepGoal() {
    const { data, updateData, nextStep, prevStep } = useAnamneseStore();

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Qual seu objetivo principal?</h2>
                <p className="text-muted-foreground">Vamos ajustar seus macronutrientes para isso.</p>
            </div>

            <div className="grid gap-4">
                {GOAL_OPTIONS.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => updateData({ goal: option.id })}
                        className={`w-full p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] flex items-center gap-4 ${data.goal === option.id
                            ? option.color
                            : 'border-border/50 bg-card hover:border-gray-500'
                            }`}
                    >
                        <div className={`p-3 rounded-full bg-background/50 ${data.goal === option.id ? '' : 'text-muted-foreground'}`}>
                            {option.icon}
                        </div>
                        <div>
                            <div className="font-bold text-lg">{option.title}</div>
                            <div className={`text-sm ${data.goal === option.id ? 'opacity-90' : 'text-muted-foreground'}`}>
                                {option.desc}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="pt-8 flex gap-4">
                <Button variant="ghost" onClick={prevStep} className="flex-1">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
                </Button>
                <Button onClick={nextStep} className="flex-[2] bg-white text-black font-bold hover:bg-gray-200">
                    Continuar <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
