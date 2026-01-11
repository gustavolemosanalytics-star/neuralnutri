'use client';

import { useMemo } from 'react';
import { useDailyLogStore } from '@/stores/dailyLogStore';

interface CalorieBalance {
    targetKcal: number;
    exerciseKcal: number;
    eatenKcal: number;
    totalBudget: number;
    remaining: number;
    netCalories: number;
    percentageUsed: number;
    status: 'Perfect' | 'Good' | 'Moderate' | 'Warning' | 'Over';
    statusColor: string;
    statusMessage: string;
}

export function useCalorieBalance(): CalorieBalance {
    const currentLog = useDailyLogStore((state) => state.currentLog);

    return useMemo(() => {
        const { targetKcal, burnedKcal: exerciseKcal, eatenKcal } = currentLog;

        const totalBudget = targetKcal + exerciseKcal;
        const remaining = totalBudget - eatenKcal;
        const netCalories = eatenKcal - exerciseKcal;
        const percentageUsed = totalBudget > 0 ? (eatenKcal / totalBudget) * 100 : 0;

        // Determine status based on percentage used
        let status: CalorieBalance['status'];
        let statusColor: string;
        let statusMessage: string;

        if (percentageUsed === 0) {
            status = 'Perfect';
            statusColor = 'text-muted-foreground';
            statusMessage = 'Comece a registrar suas refeições!';
        } else if (percentageUsed >= 95 && percentageUsed <= 105) {
            status = 'Perfect';
            statusColor = 'text-neon-green';
            statusMessage = 'Perfeito! Você atingiu sua meta exatamente!';
        } else if (percentageUsed >= 85 && percentageUsed <= 115) {
            status = 'Good';
            statusColor = 'text-neon-green';
            statusMessage = 'Ótimo trabalho! Você está dentro do alvo.';
        } else if (percentageUsed >= 70 && percentageUsed < 85) {
            status = 'Moderate';
            statusColor = 'text-neon-blue';
            statusMessage = `Ainda pode comer ${remaining.toLocaleString()} kcal`;
        } else if (percentageUsed > 115 && percentageUsed <= 130) {
            status = 'Warning';
            statusColor = 'text-neon-orange';
            statusMessage = 'Um pouco acima da meta, mas controlável.';
        } else if (percentageUsed > 130) {
            status = 'Over';
            statusColor = 'text-destructive';
            statusMessage = `${Math.abs(remaining).toLocaleString()} kcal acima do orçamento`;
        } else {
            status = 'Moderate';
            statusColor = 'text-foreground';
            statusMessage = `${remaining.toLocaleString()} kcal disponíveis`;
        }

        return {
            targetKcal,
            exerciseKcal,
            eatenKcal,
            totalBudget,
            remaining,
            netCalories,
            percentageUsed,
            status,
            statusColor,
            statusMessage,
        };
    }, [currentLog]);
}

/**
 * Hook to calculate if a potential meal can be "afforded" with current or potential exercise
 */
export function useCanAffordMeal(mealKcal: number) {
    const balance = useCalorieBalance();

    return useMemo(() => {
        const afterMeal = balance.remaining - mealKcal;
        const canAfford = afterMeal >= 0;

        // Calculate exercise needed to "earn" this meal
        const exerciseNeededKcal = canAfford ? 0 : Math.abs(afterMeal);

        // Estimate running time (roughly 10 kcal per minute of moderate running)
        const runningMinutes = Math.ceil(exerciseNeededKcal / 10);

        return {
            canAfford,
            remaining: afterMeal,
            exerciseNeededKcal,
            runningMinutes,
            message: canAfford
                ? `Você pode comer! Sobrarão ${afterMeal.toLocaleString()} kcal`
                : `Faltam ${exerciseNeededKcal.toLocaleString()} kcal. ~${runningMinutes} min de corrida resolvem!`,
        };
    }, [balance.remaining, mealKcal]);
}

export default useCalorieBalance;
