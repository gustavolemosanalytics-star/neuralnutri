'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface MacroRingsProps {
    protein: { current: number; target: number };
    carbs: { current: number; target: number };
    fat: { current: number; target: number };
}

interface RingProps {
    label: string;
    current: number;
    target: number;
    color: string;
    glowColor: string;
    unit?: string;
}

function MacroRing({ label, current, target, color, glowColor, unit = 'g' }: RingProps) {
    const percentage = Math.min((current / target) * 100, 100);
    const isOver = current > target;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
                {/* Background ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted"
                    />
                    {/* Progress ring */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={isOver ? 'var(--destructive)' : color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                            filter: `drop-shadow(0 0 6px ${isOver ? 'var(--destructive)' : glowColor})`,
                        }}
                    />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        className={`text-lg font-bold ${isOver ? 'text-destructive' : ''}`}
                        key={current}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                    >
                        {current}
                    </motion.span>
                    <span className="text-xs text-muted-foreground">/ {target}{unit}</span>
                </div>
            </div>

            <span className="mt-2 text-sm font-medium" style={{ color }}>
                {label}
            </span>

            {/* Progress text */}
            <span className={`text-xs ${isOver ? 'text-destructive' : 'text-muted-foreground'}`}>
                {isOver ? `+${current - target}${unit}` : `${target - current}${unit} restante`}
            </span>
        </div>
    );
}

export function MacroRings({ protein, carbs, fat }: MacroRingsProps) {
    return (
        <Card className="p-6 glass border-border/50">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center uppercase tracking-wider">
                Macronutrientes
            </h3>
            <div className="flex justify-around items-start gap-4">
                <MacroRing
                    label="Proteína"
                    current={protein.current}
                    target={protein.target}
                    color="oklch(0.7 0.2 25)"
                    glowColor="rgba(255, 100, 50, 0.5)"
                />
                <MacroRing
                    label="Carboidrato"
                    current={carbs.current}
                    target={carbs.target}
                    color="oklch(0.75 0.2 75)"
                    glowColor="rgba(255, 200, 50, 0.5)"
                />
                <MacroRing
                    label="Gordura"
                    current={fat.current}
                    target={fat.target}
                    color="oklch(0.7 0.18 300)"
                    glowColor="rgba(180, 100, 255, 0.5)"
                />
            </div>
        </Card>
    );
}

export default MacroRings;
