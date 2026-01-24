'use client';

import { useAnamneseStore } from '@/stores/anamneseStore';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Ban, Utensils, Heart } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const RESTRICTIONS = ['Lactose', 'Glúten', 'Amendoim', 'Soja', 'Ovos', 'Peixe'];
const DIETS = ['Vegano', 'Vegetariano', 'Pescetariano', 'Paleo', 'Keto'];

export function StepPreferences() {
    const { data, updateData, nextStep, prevStep } = useAnamneseStore();
    const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(data.dietaryRestrictions || []);

    const toggleRestriction = (item: string) => {
        const updated = selectedRestrictions.includes(item)
            ? selectedRestrictions.filter((i) => i !== item)
            : [...selectedRestrictions, item];
        setSelectedRestrictions(updated);
        updateData({ dietaryRestrictions: updated });
    };

    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Preferências e Restrições</h2>
                <p className="text-muted-foreground">Isso ajuda a IA a sugerir os melhores alimentos para você.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-4 block flex items-center gap-2">
                        <Ban className="w-4 h-4 text-neon-orange" /> Restrições ou Alergias
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {RESTRICTIONS.map((item) => (
                            <motion.button
                                key={item}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleRestriction(item)}
                                className={`px-4 py-2 rounded-full border transition-all ${selectedRestrictions.includes(item)
                                    ? 'bg-neon-orange/20 border-neon-orange text-neon-orange'
                                    : 'bg-card border-border hover:border-gray-500'
                                    }`}
                            >
                                {item}
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-4 block flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-neon-blue" /> Preferência de Dieta
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {DIETS.map((item) => (
                            <motion.button
                                key={item}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    const current = data.dietaryRestrictions || [];
                                    const isSelected = current.includes(item);
                                    const updated = isSelected
                                        ? current.filter(i => i !== item)
                                        : [...current.filter(i => !DIETS.includes(i)), item];
                                    updateData({ dietaryRestrictions: updated });
                                    setSelectedRestrictions(updated);
                                }}
                                className={`px-4 py-2 rounded-full border transition-all ${data.dietaryRestrictions?.includes(item)
                                    ? 'bg-neon-blue/20 border-neon-blue text-neon-blue'
                                    : 'bg-card border-border hover:border-gray-500'
                                    }`}
                            >
                                {item}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-8 flex gap-4">
                <Button variant="ghost" onClick={prevStep} className="flex-1">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
                </Button>
                <Button onClick={nextStep} className="flex-[2] bg-white text-black font-bold hover:bg-gray-200">
                    Gerar Meu Plano <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
