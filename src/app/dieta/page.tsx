'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, User, Calendar, Clock, Utensils } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MealPlan {
    id: string;
    name: string;
    description: string;
    targetKcal: number;
    targetMacros: { proteina: number; carboidrato: number; gordura: number };
    meals: any[];
    source: 'AI' | 'NUTRI';
    isActive: boolean;
    createdAt: string;
}

export default function DietPage() {
    const [plans, setPlans] = useState<MealPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ai' | 'nutri'>('ai');

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await fetch('/api/meal-plans');
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const aiPlan = plans.find(p => p.source === 'AI' && p.isActive);
    const nutriPlan = plans.find(p => p.source === 'NUTRI' && p.isActive);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground animate-pulse">Sincronizando sua dieta...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto bg-background">
            <header className="mb-8">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    Meu Plano Nutricional
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Gerencie suas dietas da IA e do seu nutricionista.
                </p>
            </header>

            <div className="w-full">
                {/* Custom Tabs List */}
                <div className="grid w-full grid-cols-2 bg-muted/20 p-1 rounded-2xl border border-white/5 relative">
                    <button
                        onClick={() => setActiveTab('ai')}
                        className={`relative z-10 py-2 rounded-xl text-sm font-medium flex items-center justify-center transition-colors ${activeTab === 'ai' ? 'text-neon-green' : 'text-muted-foreground hover:text-white'}`}
                    >
                        <Brain className="w-4 h-4 mr-2" />
                        IA Neural
                        {activeTab === 'ai' && (
                            <motion.div
                                layoutId="active-tab"
                                className="absolute inset-0 bg-neon-green/10 border border-neon-green/20 rounded-xl -z-10"
                            />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('nutri')}
                        className={`relative z-10 py-2 rounded-xl text-sm font-medium flex items-center justify-center transition-colors ${activeTab === 'nutri' ? 'text-neon-blue' : 'text-muted-foreground hover:text-white'}`}
                    >
                        <User className="w-4 h-4 mr-2" />
                        Nutricionista
                        {activeTab === 'nutri' && (
                            <motion.div
                                layoutId="active-tab"
                                className="absolute inset-0 bg-neon-blue/10 border border-neon-blue/20 rounded-xl -z-10"
                            />
                        )}
                    </button>
                </div>

                <div className="mt-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'ai' ? (
                            <motion.div
                                key="ai-content"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <PlanCard plan={aiPlan} source="AI" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="nutri-content"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <PlanCard plan={nutriPlan} source="NUTRI" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}

function PlanCard({ plan, source }: { plan?: MealPlan, source: 'AI' | 'NUTRI' }) {
    if (!plan) {
        return (
            <Card className="p-12 border-dashed border-white/10 glass flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${source === 'AI' ? 'bg-neon-green/10 text-neon-green' : 'bg-neon-blue/10 text-neon-blue'}`}>
                    {source === 'AI' ? <Brain className="w-8 h-8" /> : <User className="w-8 h-8" />}
                </div>
                <h3 className="font-semibold text-lg">Nenhum plano ativo</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-[200px]">
                    {source === 'AI'
                        ? "Peça para o Copiloto Neural gerar uma dieta personalizada para você!"
                        : "Suba o CSV da sua dieta no portal do nutricionista."}
                </p>
                {source === 'AI' && (
                    <Button variant="outline" className="mt-6 border-neon-green/30 hover:bg-neon-green/10 rounded-xl">
                        Falar com a IA
                    </Button>
                )}
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center justify-between">
                <div>
                    <Badge className={source === 'AI' ? 'bg-neon-green/10 text-neon-green' : 'bg-neon-blue/10 text-neon-blue'}>
                        {source === 'AI' ? 'INTELIGÊNCIA ARTIFICIAL' : 'NUTRICIONISTA PRO'}
                    </Badge>
                    <h2 className="text-xl font-bold mt-2">{plan.name}</h2>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-neon-green">{plan.targetKcal}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">KCAL DIÁRIAS</div>
                </div>
            </div>

            {/* Macros Grid */}
            <div className="grid grid-cols-3 gap-3">
                <MacroCard label="Proteínas" value={plan.targetMacros.proteina} color="neon-green" />
                <MacroCard label="Carbos" value={plan.targetMacros.carboidrato} color="neon-blue" />
                <MacroCard label="Gorduras" value={plan.targetMacros.gordura} color="neon-purple" />
            </div>

            {/* Meals List */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Estrutura de Refeições
                </h3>

                <div className="space-y-3">
                    {plan.meals.map((meal: any, idx: number) => (
                        <Card key={idx} className="p-4 glass group hover:border-white/20 transition-all border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-white/5">
                                        <Clock className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">{meal.horario || '--:--'}</div>
                                        <div className="font-semibold text-sm">{meal.nome}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold">{meal.kcal} kcal</div>
                                </div>
                            </div>

                            {meal.alimentos && meal.alimentos.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                                    {meal.alimentos.map((food: string, fIdx: number) => (
                                        <Badge key={fIdx} variant="secondary" className="bg-white/5 text-[10px] font-normal">
                                            {food}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MacroCard({ label, value, color }: { label: string, value: number, color: string }) {
    const colorMap: any = {
        'neon-green': 'text-neon-green border-neon-green/20 bg-neon-green/5',
        'neon-blue': 'text-neon-blue border-neon-blue/20 bg-neon-blue/5',
        'neon-purple': 'text-neon-purple border-neon-purple/20 bg-neon-purple/5',
    };

    return (
        <Card className={`p-4 border text-center ${colorMap[color]}`}>
            <div className="text-lg font-bold">{value}g</div>
            <div className="text-[10px] uppercase opacity-60 tracking-tighter">{label}</div>
        </Card>
    );
}
