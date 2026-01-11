'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Utensils, Dumbbell } from 'lucide-react';

interface CalorieCounterProps {
    targetKcal: number;
    exerciseKcal: number;
    eatenKcal: number;
}

export function CalorieCounter({ targetKcal, exerciseKcal, eatenKcal }: CalorieCounterProps) {
    const totalBudget = targetKcal + exerciseKcal;
    const remaining = totalBudget - eatenKcal;
    const percentageUsed = Math.min((eatenKcal / totalBudget) * 100, 100);
    const isOverBudget = remaining < 0;
    const isNearLimit = remaining > 0 && remaining < 200;

    return (
        <Card className="p-6 glass border-border/50">
            {/* Main calorie display */}
            <div className="text-center mb-6">
                <motion.div
                    className="relative inline-flex flex-col items-center"
                    key={remaining}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Calorias Disponíveis
                    </span>
                    <span
                        className={`text-5xl font-bold ${isOverBudget
                                ? 'text-destructive'
                                : isNearLimit
                                    ? 'text-neon-orange'
                                    : 'text-neon-green'
                            }`}
                    >
                        {Math.abs(remaining).toLocaleString()}
                    </span>
                    {isOverBudget && (
                        <span className="text-sm text-destructive mt-1">acima do orçamento</span>
                    )}
                </motion.div>
            </div>

            {/* Progress bar */}
            <div className="relative mb-6">
                <div className="h-4 rounded-full bg-muted overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={percentageUsed}
                            className={`h-full rounded-full ${isOverBudget
                                    ? 'bg-gradient-to-r from-destructive to-destructive/80'
                                    : isNearLimit
                                        ? 'bg-gradient-to-r from-neon-orange to-neon-orange/80'
                                        : 'bg-gradient-to-r from-neon-green to-neon-blue'
                                }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentageUsed}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                    </AnimatePresence>
                </div>

                {/* Target marker */}
                <div
                    className="absolute top-0 h-full w-0.5 bg-foreground/50"
                    style={{ left: `${(targetKcal / totalBudget) * 100}%` }}
                >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap">
                        Meta
                    </div>
                </div>
            </div>

            {/* Stats breakdown */}
            <div className="grid grid-cols-2 gap-4">
                {/* Eaten */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-neon-green/20 flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-neon-green" />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground block">Consumido</span>
                        <span className="text-lg font-semibold">{eatenKcal.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground ml-1">kcal</span>
                    </div>
                </div>

                {/* Exercise bonus */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-neon-blue" />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground block">Bônus Treino</span>
                        <span className="text-lg font-semibold text-neon-blue">+{exerciseKcal.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground ml-1">kcal</span>
                    </div>
                </div>
            </div>

            {/* Budget summary */}
            <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Orçamento total do dia</span>
                    <span className="font-semibold">{totalBudget.toLocaleString()} kcal</span>
                </div>
            </div>
        </Card>
    );
}

export default CalorieCounter;
