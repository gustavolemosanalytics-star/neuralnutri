import { create } from 'zustand';

interface Macros {
    proteina: number;
    carboidrato: number;
    gordura: number;
}

interface Exercise {
    id: string;
    nome: string;
    tipo: string;
    duracao: number;     // minutos
    intensidade: 'leve' | 'moderado' | 'intenso';
    kcal: number;
    registeredAt: string;
}

interface FoodItem {
    id: string;
    nome: string;
    quantidade: number;
    unidade: string;
    kcal: number;
    macros: Macros;
}

interface Meal {
    id: string;
    nome: string;
    time: string;
    items: FoodItem[];
    totalKcal: number;
    totalMacros: Macros;
}

interface DailyLog {
    date: string;         // ISO date

    // Targets (from meal plan)
    targetKcal: number;
    targetMacros: Macros;

    // Eaten
    eatenKcal: number;
    eatenMacros: Macros;
    meals: Meal[];

    // Exercise
    burnedKcal: number;
    exercises: Exercise[];

    // Status
    netCalories: number;
    deficitStatus: 'Perfect' | 'Good' | 'Moderate' | 'Fail' | 'Pending';
    dailyXP_earned: number;
    isCompleted: boolean;

    // Extras
    waterMl: number;
}

interface DailyLogStore {
    currentLog: DailyLog;
    isLoading: boolean;

    // Actions
    initializeDayLog: (targetKcal: number, targetMacros: Macros) => void;
    addMeal: (meal: Omit<Meal, 'id'>) => void;
    removeMeal: (mealId: string) => void;
    addExercise: (exercise: Omit<Exercise, 'id' | 'registeredAt'>) => void;
    removeExercise: (exerciseId: string) => void;
    addWater: (ml: number) => void;
    updateDeficitStatus: () => void;
    completeDay: () => number; // Returns XP earned
    resetLog: () => void;
}

const createEmptyMacros = (): Macros => ({
    proteina: 0,
    carboidrato: 0,
    gordura: 0,
});

const createEmptyLog = (): DailyLog => ({
    date: new Date().toISOString().split('T')[0],
    targetKcal: 2000,
    targetMacros: { proteina: 150, carboidrato: 200, gordura: 65 },
    eatenKcal: 0,
    eatenMacros: createEmptyMacros(),
    meals: [],
    burnedKcal: 0,
    exercises: [],
    netCalories: 0,
    deficitStatus: 'Pending',
    dailyXP_earned: 0,
    isCompleted: false,
    waterMl: 0,
});

function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

export const useDailyLogStore = create<DailyLogStore>((set, get) => ({
    currentLog: createEmptyLog(),
    isLoading: false,

    initializeDayLog: (targetKcal, targetMacros) => {
        const today = new Date().toISOString().split('T')[0];
        const { currentLog } = get();

        if (currentLog.date !== today) {
            // New day, create fresh log
            set({
                currentLog: {
                    ...createEmptyLog(),
                    date: today,
                    targetKcal,
                    targetMacros,
                },
            });
        } else {
            // Same day, just update targets if needed
            set({
                currentLog: {
                    ...currentLog,
                    targetKcal,
                    targetMacros,
                },
            });
        }
    },

    addMeal: (mealData) => {
        const meal: Meal = {
            ...mealData,
            id: generateId(),
        };

        set((state) => {
            const newEatenKcal = state.currentLog.eatenKcal + meal.totalKcal;
            const newEatenMacros: Macros = {
                proteina: state.currentLog.eatenMacros.proteina + meal.totalMacros.proteina,
                carboidrato: state.currentLog.eatenMacros.carboidrato + meal.totalMacros.carboidrato,
                gordura: state.currentLog.eatenMacros.gordura + meal.totalMacros.gordura,
            };

            return {
                currentLog: {
                    ...state.currentLog,
                    meals: [...state.currentLog.meals, meal],
                    eatenKcal: newEatenKcal,
                    eatenMacros: newEatenMacros,
                    netCalories: newEatenKcal - state.currentLog.burnedKcal,
                },
            };
        });

        get().updateDeficitStatus();
    },

    removeMeal: (mealId) => {
        set((state) => {
            const meal = state.currentLog.meals.find((m) => m.id === mealId);
            if (!meal) return state;

            const newMeals = state.currentLog.meals.filter((m) => m.id !== mealId);
            const newEatenKcal = state.currentLog.eatenKcal - meal.totalKcal;
            const newEatenMacros: Macros = {
                proteina: state.currentLog.eatenMacros.proteina - meal.totalMacros.proteina,
                carboidrato: state.currentLog.eatenMacros.carboidrato - meal.totalMacros.carboidrato,
                gordura: state.currentLog.eatenMacros.gordura - meal.totalMacros.gordura,
            };

            return {
                currentLog: {
                    ...state.currentLog,
                    meals: newMeals,
                    eatenKcal: newEatenKcal,
                    eatenMacros: newEatenMacros,
                    netCalories: newEatenKcal - state.currentLog.burnedKcal,
                },
            };
        });

        get().updateDeficitStatus();
    },

    addExercise: (exerciseData) => {
        const exercise: Exercise = {
            ...exerciseData,
            id: generateId(),
            registeredAt: new Date().toISOString(),
        };

        set((state) => {
            const newBurnedKcal = state.currentLog.burnedKcal + exercise.kcal;

            return {
                currentLog: {
                    ...state.currentLog,
                    exercises: [...state.currentLog.exercises, exercise],
                    burnedKcal: newBurnedKcal,
                    netCalories: state.currentLog.eatenKcal - newBurnedKcal,
                },
            };
        });

        get().updateDeficitStatus();
    },

    removeExercise: (exerciseId) => {
        set((state) => {
            const exercise = state.currentLog.exercises.find((e) => e.id === exerciseId);
            if (!exercise) return state;

            const newExercises = state.currentLog.exercises.filter((e) => e.id !== exerciseId);
            const newBurnedKcal = state.currentLog.burnedKcal - exercise.kcal;

            return {
                currentLog: {
                    ...state.currentLog,
                    exercises: newExercises,
                    burnedKcal: newBurnedKcal,
                    netCalories: state.currentLog.eatenKcal - newBurnedKcal,
                },
            };
        });

        get().updateDeficitStatus();
    },

    addWater: (ml) => {
        set((state) => ({
            currentLog: {
                ...state.currentLog,
                waterMl: state.currentLog.waterMl + ml,
            },
        }));
    },

    updateDeficitStatus: () => {
        const { currentLog } = get();
        const totalBudget = currentLog.targetKcal + currentLog.burnedKcal;
        const remaining = totalBudget - currentLog.eatenKcal;
        const percentageUsed = (currentLog.eatenKcal / totalBudget) * 100;

        let status: DailyLog['deficitStatus'];

        if (currentLog.eatenKcal === 0) {
            status = 'Pending';
        } else if (percentageUsed >= 95 && percentageUsed <= 105) {
            status = 'Perfect';
        } else if (percentageUsed >= 85 && percentageUsed <= 115) {
            status = 'Good';
        } else if (percentageUsed >= 70 && percentageUsed <= 130) {
            status = 'Moderate';
        } else {
            status = 'Fail';
        }

        set((state) => ({
            currentLog: {
                ...state.currentLog,
                deficitStatus: status,
            },
        }));
    },

    completeDay: () => {
        const { currentLog } = get();

        // Calculate XP based on performance
        let xp = 10; // Base XP for logging

        switch (currentLog.deficitStatus) {
            case 'Perfect':
                xp += 50;
                break;
            case 'Good':
                xp += 30;
                break;
            case 'Moderate':
                xp += 15;
                break;
            default:
                xp += 5;
        }

        // Bonus XP for exercises
        xp += currentLog.exercises.length * 10;

        // Bonus for water intake (goal: 2000ml)
        if (currentLog.waterMl >= 2000) {
            xp += 15;
        }

        set((state) => ({
            currentLog: {
                ...state.currentLog,
                isCompleted: true,
                dailyXP_earned: xp,
            },
        }));

        return xp;
    },

    resetLog: () => {
        set({ currentLog: createEmptyLog() });
    },
}));

export default useDailyLogStore;
