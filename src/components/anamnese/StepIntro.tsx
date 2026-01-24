'use client';

import { Button } from '@/components/ui/button';
import { useAnamneseStore } from '@/stores/anamneseStore';
import { Brain, Sparkles } from 'lucide-react';

export function StepIntro() {
    const nextStep = useAnamneseStore((state) => state.nextStep);

    return (
        <div className="text-center space-y-8">
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-neon-green/20 blur-xl rounded-full" />
                <div className="relative w-24 h-24 bg-card border border-neon-green/30 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-neon-green/10">
                    <Brain className="w-12 h-12 text-neon-green" />
                </div>
                <div className="absolute -top-2 -right-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neon-blue text-xs font-bold text-background animate-pulse">
                        AI
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
                    NeuroDiet <span className="text-neon-green">AI</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    Vou analisar seu metabolismo e criar uma estratégia nutricional perfeita para você.
                </p>
            </div>

            <div className="pt-4">
                <Button
                    onClick={nextStep}
                    size="lg"
                    className="w-full max-w-xs bg-neon-green hover:bg-neon-green/90 text-background font-bold h-14 rounded-xl shadow-lg shadow-neon-green/20 transition-all hover:scale-105"
                >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Começar Anamnese
                </Button>
            </div>
        </div>
    );
}
