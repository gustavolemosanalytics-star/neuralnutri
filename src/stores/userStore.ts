import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStats {
    peso: number;          // kg
    altura: number;        // cm
    idade: number;
    sexo: 'M' | 'F';
    nivelAtividade: 'sedentario' | 'leve' | 'moderado' | 'ativo' | 'muito_ativo';
    objetivo: 'perder' | 'manter' | 'ganhar';
    tmb: number;           // Taxa Metabólica Basal
    tdee: number;          // Total Daily Energy Expenditure
}

interface UserProfile {
    id: string | null;
    name: string;
    email: string;
    mode: 'AI_AUTO' | 'NUTRI_PRO';
    stats: UserStats | null;
    level: number;
    currentXP: number;
    streakDays: number;
    lastActiveDate: string | null;
    coins: number;
}

interface UserStore {
    user: UserProfile;
    isLoading: boolean;

    // Actions
    setUser: (user: Partial<UserProfile>) => void;
    updateStats: (stats: Partial<UserStats>) => void;
    addXP: (amount: number) => number; // Returns new total XP
    levelUp: () => void;
    updateStreak: () => void;
    resetUser: () => void;
}

// XP needed per level (exponential growth)
export function calculateXPForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1));
}

const initialUser: UserProfile = {
    id: null,
    name: '',
    email: '',
    mode: 'AI_AUTO',
    stats: null,
    level: 1,
    currentXP: 0,
    streakDays: 0,
    lastActiveDate: null,
    coins: 0,
};

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            user: initialUser,
            isLoading: true,

            setUser: (userData) => {
                set((state) => ({
                    user: { ...state.user, ...userData },
                    isLoading: false,
                }));
            },

            updateStats: (stats) => {
                set((state) => ({
                    user: {
                        ...state.user,
                        stats: state.user.stats
                            ? { ...state.user.stats, ...stats }
                            : (stats as UserStats),
                    },
                }));
            },

            addXP: (amount) => {
                const { user } = get();
                let newXP = user.currentXP + amount;
                let newLevel = user.level;
                let xpNeeded = calculateXPForLevel(newLevel);

                // Check for level up(s)
                while (newXP >= xpNeeded) {
                    newXP -= xpNeeded;
                    newLevel++;
                    xpNeeded = calculateXPForLevel(newLevel);
                }

                set((state) => ({
                    user: {
                        ...state.user,
                        currentXP: newXP,
                        level: newLevel,
                    },
                }));

                return newXP;
            },

            levelUp: () => {
                set((state) => ({
                    user: {
                        ...state.user,
                        level: state.user.level + 1,
                        currentXP: 0,
                    },
                }));
            },

            updateStreak: () => {
                const { user } = get();
                const today = new Date().toISOString().split('T')[0];
                const lastActive = user.lastActiveDate;

                if (!lastActive) {
                    // First activity
                    set((state) => ({
                        user: {
                            ...state.user,
                            streakDays: 1,
                            lastActiveDate: today,
                        },
                    }));
                    return;
                }

                const lastDate = new Date(lastActive);
                const todayDate = new Date(today);
                const diffDays = Math.floor(
                    (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
                );

                if (diffDays === 0) {
                    // Same day, no change
                    return;
                } else if (diffDays === 1) {
                    // Consecutive day
                    set((state) => ({
                        user: {
                            ...state.user,
                            streakDays: state.user.streakDays + 1,
                            lastActiveDate: today,
                        },
                    }));
                } else {
                    // Streak broken
                    set((state) => ({
                        user: {
                            ...state.user,
                            streakDays: 1,
                            lastActiveDate: today,
                        },
                    }));
                }
            },

            resetUser: () => {
                set({ user: initialUser, isLoading: false });
            },
        }),
        {
            name: 'neurodiet-user',
        }
    )
);

export default useUserStore;
