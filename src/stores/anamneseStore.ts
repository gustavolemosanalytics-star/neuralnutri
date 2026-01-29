import { create } from 'zustand';

export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
export type Gender = 'male' | 'female';
export type Goal = 'lose_weight' | 'maintain' | 'gain_muscle';

interface AnamneseData {
    name: string;
    age: number;
    height: number; // cm
    weight: number; // kg
    gender: Gender;
    activityLevel: ActivityLevel;
    goal: Goal;
    dietaryRestrictions: string[];
    favoriteFoods: string[];
    dislikedFoods: string[];
}

interface AnamneseStore {
    currentStep: number;
    totalSteps: number;
    data: AnamneseData;
    isCalculating: boolean;

    // Actions
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateData: (partialData: Partial<AnamneseData>) => void;
    setIsCalculating: (isCalculating: boolean) => void;
    reset: () => void;
}

const INITIAL_DATA: AnamneseData = {
    name: '',
    age: 30,
    height: 170,
    weight: 70,
    gender: 'male',
    activityLevel: 'moderately_active',
    goal: 'lose_weight',
    dietaryRestrictions: [],
    favoriteFoods: [],
    dislikedFoods: [],
};

export const useAnamneseStore = create<AnamneseStore>((set) => ({
    currentStep: 0,
    totalSteps: 7, // 0 to 6 indices, 7 is the end
    data: INITIAL_DATA,
    isCalculating: false,

    setStep: (step) => set({ currentStep: step }),
    nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, state.totalSteps) })),
    prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),
    updateData: (partialData) => set((state) => ({ data: { ...state.data, ...partialData } })),
    setIsCalculating: (val) => set({ isCalculating: val }),
    reset: () => set({ currentStep: 0, data: INITIAL_DATA, isCalculating: false }),
}));
