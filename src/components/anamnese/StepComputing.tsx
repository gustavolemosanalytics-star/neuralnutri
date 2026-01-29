'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnamneseStore } from '@/stores/anamneseStore';
import { useUserStore } from '@/stores/userStore';
import { useDailyLogStore } from '@/stores/dailyLogStore';
import { useTDEE } from '@/hooks/useTDEE';
import { Brain, CheckCircle, Database, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateMockDiet } from '@/services/dietGenerator';

// Mapping helpers
const mapGender = (g: string): 'M' | 'F' => (g === 'male' ? 'M' : 'F');
const mapActivity = (a: string): any => {
    switch (a) {
        case 'sedentary': return 'sedentario';
        case 'lightly_active': return 'leve';
        case 'moderately_active': return 'moderado';
        case 'very_active': return 'ativo';
        case 'extra_active': return 'muito_ativo';
        default: return 'moderado';
    }
};
const mapGoal = (g: string): any => {
    switch (g) {
        case 'lose_weight': return 'perder';
        case 'maintain': return 'manter';
        case 'gain_muscle': return 'ganhar';
        default: return 'manter';
    }
};

const LOADING_STEPS = [
    { text: 'Analisando metabolismo basal...', icon: Activity },
    { text: 'Calculando gasto calórico diário...', icon: Brain },
    { text: 'Otimizando distribuição de macros...', icon: Database },
    { text: 'Finalizando seu plano...', icon: CheckCircle },
];

export function StepComputing() {
    const router = useRouter();
    const { data, nextStep } = useAnamneseStore();
    const { setUser } = useUserStore();
    const { initializeDayLog } = useDailyLogStore();
    const [loadingStep, setLoadingStep] = useState(0);

    // Prepare stats for TDEE hook
    const stats = {
        peso: data.weight,
        altura: data.height,
        idade: data.age,
        sexo: mapGender(data.gender),
        nivelAtividade: mapActivity(data.activityLevel),
        objetivo: mapGoal(data.goal),
        tmb: 0, // Placeholder, calculated by hook
        tdee: 0 // Placeholder
    };

    // Use the hook logic to get the numbers
    // Note: useTDEE will recalculate whenever stats changes.
    // In this component stats is constant after mount effectively.
    // We pass TMB=0 initially but the hook calculates the real value.
    const result = useTDEE(stats);

    useEffect(() => {
        // Animation sequence
        const interval = setInterval(() => {
            setLoadingStep((prev) => {
                if (prev < LOADING_STEPS.length - 1) return prev + 1;
                return prev;
            });
        }, 1500); // 1.5s per step

        // Finalize after all steps
        const timeout = setTimeout(() => {
            if (result) {
                // 1. Save Profile to UserStore
                setUser({
                    name: data.name,
                    stats: {
                        ...stats,
                        tmb: result.tmb,
                        tdee: result.tdee,
                    },
                    mode: 'AI_AUTO',
                });

                // 2. Generate Mock Meals based on results
                const initialMeals = generateMockDiet(result.targetKcal, result.macros);

                // 3. Initialize Daily Log with targets and initial meals
                initializeDayLog(
                    result.targetKcal,
                    result.macros,
                    initialMeals
                );

                // 4. Go to Registration instead of Dashboard
                nextStep();
            }
        }, LOADING_STEPS.length * 1500 + 500);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [result, data, stats, setUser, initializeDayLog, router]);

    return (
        <div className="text-center space-y-12">
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-neon-green/20 blur-xl rounded-full animate-pulse" />
                <div className="relative w-32 h-32 bg-card border border-neon-green rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    >
                        <Brain className="w-16 h-16 text-neon-green" />
                    </motion.div>
                </div>
            </div>

            <div className="h-24 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={loadingStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col items-center gap-4"
                    >
                        {LOADING_STEPS[loadingStep] && (
                            <>
                                {(() => {
                                    const Icon = LOADING_STEPS[loadingStep].icon;
                                    return <Icon className="w-8 h-8 text-neon-blue" />;
                                })()}
                                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-neon-blue">
                                    {LOADING_STEPS[loadingStep].text}
                                </h2>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="w-full max-w-sm mx-auto bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                    className="h-full bg-neon-green"
                    initial={{ width: 0 }}
                    animate={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    );
}
