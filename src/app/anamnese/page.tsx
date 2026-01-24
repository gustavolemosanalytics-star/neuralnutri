'use client';

import { useAnamneseStore } from '@/stores/anamneseStore';
import { StepIntro } from '@/components/anamnese/StepIntro';
import { StepBiometrics } from '@/components/anamnese/StepBiometrics';
import { StepRoutine } from '@/components/anamnese/StepRoutine';
import { StepGoal } from '@/components/anamnese/StepGoal';
import { StepPreferences } from '@/components/anamnese/StepPreferences';
import { StepComputing } from '@/components/anamnese/StepComputing';
import { AnimatePresence, motion } from 'framer-motion';

export default function AnamnesePage() {
    const currentStep = useAnamneseStore((state) => state.currentStep);

    // Render the correct step component
    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <StepIntro />;
            case 1:
                return <StepBiometrics />;
            case 2:
                return <StepRoutine />;
            case 3:
                return <StepGoal />;
            case 4:
                return <StepPreferences />;
            case 5:
                return <StepComputing />;
            default:
                return <StepIntro />;
        }
    };

    return (
        <div className="w-full">
            {/* Progress Bar (Optional, maybe for steps > 0) */}
            {currentStep > 0 && currentStep < 5 && (
                <div className="mb-8">
                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-neon-green"
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / 4) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2 uppercase tracking-wide">
                        <span>Biometria</span>
                        <span>Rotina</span>
                        <span>Objetivo</span>
                        <span>Restrições</span>
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
