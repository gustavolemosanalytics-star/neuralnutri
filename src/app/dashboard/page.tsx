'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Plus, Dumbbell, Utensils, Droplets, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { DashboardHeader, calculateXPForLevel } from '@/components/dashboard/DashboardHeader';
import { MacroRings } from '@/components/dashboard/MacroRings';
import { CalorieCounter } from '@/components/dashboard/CalorieCounter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDailyLogStore } from '@/stores/dailyLogStore';
import { useUserStore } from '@/stores/userStore';
import { AICopilot } from '@/components/dashboard/AICopilot';

const DEMO_USER = {
    name: 'Atleta',
    level: 5,
    currentXP: 75,
    streakDays: 7,
};

const DEMO_LOG = {
    targetKcal: 2000,
    exerciseKcal: 350,
    eatenKcal: 1250,
    macros: {
        protein: { current: 95, target: 150 },
        carbs: { current: 120, target: 200 },
        fat: { current: 40, target: 65 },
    },
};

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);
    const currentLog = useDailyLogStore((state) => state.currentLog);
    const addWater = useDailyLogStore((state) => state.addWater);
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-neon-green">Carregando...</div>
            </div>
        );
    }

    const isDemo = !user.name;
    const displayUser = isDemo ? (DEMO_USER as any) : user;

    const targetKcal = isDemo ? DEMO_LOG.targetKcal : currentLog.targetKcal;
    const exerciseKcal = isDemo ? DEMO_LOG.exerciseKcal : currentLog.burnedKcal;
    const eatenKcal = isDemo ? DEMO_LOG.eatenKcal : currentLog.eatenKcal;
    const macros = isDemo ? DEMO_LOG.macros : {
        protein: { current: currentLog.eatenMacros.proteina, target: currentLog.targetMacros.proteina },
        carbs: { current: currentLog.eatenMacros.carboidrato, target: currentLog.targetMacros.carboidrato },
        fat: { current: currentLog.eatenMacros.gordura, target: currentLog.targetMacros.gordura },
    };

    return (
        <main className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <DashboardHeader
                    level={displayUser.level}
                    currentXP={displayUser.currentXP}
                    xpToNextLevel={calculateXPForLevel(displayUser.level)}
                    streakDays={displayUser.streakDays}
                    targetKcal={targetKcal}
                    exerciseKcal={exerciseKcal}
                    eatenKcal={eatenKcal}
                    userName={displayUser.name}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6"
            >
                <MacroRings
                    protein={macros.protein}
                    carbs={macros.carbs}
                    fat={macros.fat}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6"
            >
                <CalorieCounter
                    targetKcal={targetKcal}
                    exerciseKcal={exerciseKcal}
                    eatenKcal={eatenKcal}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6"
            >
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                    Ações Rápidas
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    <Link href="/vision-ai" className="contents">
                        <QuickActionButton
                            icon={<Utensils className="w-5 h-5" />}
                            label="Visão Neural"
                            color="neon-green"
                        />
                    </Link>
                    <QuickActionButton
                        icon={<Dumbbell className="w-5 h-5" />}
                        label="Registrar Treino"
                        color="neon-blue"
                        onClick={() => { }}
                    />
                    <QuickActionButton
                        icon={<Droplets className="w-5 h-5" />}
                        label="Beber Água"
                        color="neon-purple"
                        onClick={() => addWater(250)}
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-6"
            >
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Refeições de Hoje
                    </h3>
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                        Ver todas <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>

                <Card className="divide-y divide-border/50 glass border-border/50">
                    {currentLog.meals.length > 0 ? (
                        currentLog.meals.map((meal) => (
                            <MealItem
                                key={meal.id}
                                name={meal.nome}
                                time={meal.time}
                                kcal={meal.totalKcal}
                                items={meal.items.map(i => i.nome).join(', ')}
                            />
                        ))
                    ) : (
                        <div className="p-8 text-center text-muted-foreground text-sm italic">
                            Nenhuma refeição registrada hoje.
                        </div>
                    )}
                </Card>
            </motion.div>

            <AICopilot />
        </main>
    );
}

interface QuickActionButtonProps {
    icon: React.ReactNode;
    label: string;
    color: 'neon-green' | 'neon-blue' | 'neon-purple';
    onClick?: () => void;
}

function QuickActionButton({ icon, label, color, onClick }: QuickActionButtonProps) {
    const colorClasses = {
        'neon-green': 'bg-neon-green/10 text-neon-green border-neon-green/20 hover:bg-neon-green/20',
        'neon-blue': 'bg-neon-blue/10 text-neon-blue border-neon-blue/20 hover:bg-neon-blue/20',
        'neon-purple': 'bg-neon-purple/10 text-neon-purple border-neon-purple/20 hover:bg-neon-purple/20',
    };

    return (
        <motion.button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border ${colorClasses[color]} transition-colors`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {icon}
            <span className="text-xs mt-2 text-center leading-tight">{label}</span>
        </motion.button>
    );
}

interface MealItemProps {
    name: string;
    time: string;
    kcal: number;
    items: string;
}

function MealItem({ name, time, kcal, items }: MealItemProps) {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neon-green/10 flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-neon-green" />
                </div>
                <div>
                    <div className="font-medium text-sm">{name}</div>
                    <div className="text-xs text-muted-foreground">{items}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="font-semibold text-sm">{kcal} kcal</div>
                <div className="text-xs text-muted-foreground">{time}</div>
            </div>
        </div>
    );
}
