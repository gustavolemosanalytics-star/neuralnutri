interface UserStats {
    peso: number;          // kg
    altura: number;        // cm
    idade: number;
    sexo: 'M' | 'F';
    nivelAtividade: 'sedentario' | 'leve' | 'moderado' | 'ativo' | 'muito_ativo';
    objetivo: 'perder' | 'manter' | 'ganhar';
}

interface TDEEResult {
    tmb: number;          // Taxa Metabólica Basal
    tdee: number;         // Total Daily Energy Expenditure
    targetKcal: number;   // After goal adjustment
    macros: {
        proteina: number;   // grams per day
        carboidrato: number;
        gordura: number;
    };
}

// Activity level multipliers
const ACTIVITY_MULTIPLIERS = {
    sedentario: 1.2,      // Little or no exercise
    leve: 1.375,          // Light exercise 1-3 days/week
    moderado: 1.55,       // Moderate exercise 3-5 days/week
    ativo: 1.725,         // Hard exercise 6-7 days/week
    muito_ativo: 1.9,     // Very hard exercise, physical job
};

// Goal calorie adjustments
const GOAL_ADJUSTMENTS = {
    perder: -500,         // 500 kcal deficit for ~0.5kg/week loss
    manter: 0,
    ganhar: 300,          // 300 kcal surplus for lean gains
};

/**
 * Calculate TMB using Mifflin-St Jeor equation (more accurate than Harris-Benedict)
 */
function calculateTMB(peso: number, altura: number, idade: number, sexo: 'M' | 'F'): number {
    // Mifflin-St Jeor Equation
    const base = 10 * peso + 6.25 * altura - 5 * idade;
    return Math.round(sexo === 'M' ? base + 5 : base - 161);
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
function calculateTDEE(tmb: number, nivelAtividade: UserStats['nivelAtividade']): number {
    return Math.round(tmb * ACTIVITY_MULTIPLIERS[nivelAtividade]);
}

/**
 * Calculate target calories based on goal
 */
function calculateTargetKcal(tdee: number, objetivo: UserStats['objetivo']): number {
    return Math.max(1200, tdee + GOAL_ADJUSTMENTS[objetivo]); // Never go below 1200 kcal
}

/**
 * Calculate macros based on target calories and goal
 * - Protein: Higher for muscle preservation/building
 * - Carbs: Main energy source
 * - Fat: Essential fats and hormone production
 */
function calculateMacros(
    targetKcal: number,
    peso: number,
    objetivo: UserStats['objetivo']
): TDEEResult['macros'] {
    // Protein: 1.6-2.2g per kg for active individuals
    let proteinMultiplier: number;
    switch (objetivo) {
        case 'perder':
            proteinMultiplier = 2.0; // Higher to preserve muscle
            break;
        case 'ganhar':
            proteinMultiplier = 2.2; // Maximum for muscle building
            break;
        default:
            proteinMultiplier = 1.6;
    }
    const proteina = Math.round(peso * proteinMultiplier);

    // Fat: 25-30% of calories (9 kcal/g)
    const fatPercentage = objetivo === 'perder' ? 0.25 : 0.28;
    const gordura = Math.round((targetKcal * fatPercentage) / 9);

    // Carbs: Remaining calories (4 kcal/g)
    const proteinKcal = proteina * 4;
    const fatKcal = gordura * 9;
    const remainingKcal = targetKcal - proteinKcal - fatKcal;
    const carboidrato = Math.round(Math.max(remainingKcal / 4, 50)); // Minimum 50g carbs

    return { proteina, carboidrato, gordura };
}

/**
 * Main hook to calculate all TDEE-related values
 */
export function useTDEE(stats: UserStats | null): TDEEResult | null {
    if (!stats) return null;

    const { peso, altura, idade, sexo, nivelAtividade, objetivo } = stats;

    const tmb = calculateTMB(peso, altura, idade, sexo);
    const tdee = calculateTDEE(tmb, nivelAtividade);
    const targetKcal = calculateTargetKcal(tdee, objetivo);
    const macros = calculateMacros(targetKcal, peso, objetivo);

    return {
        tmb,
        tdee,
        targetKcal,
        macros,
    };
}

/**
 * Estimate calories burned from exercise
 */
export function estimateExerciseCalories(
    type: string,
    durationMinutes: number,
    intensity: 'leve' | 'moderado' | 'intenso',
    pesoKg: number
): number {
    // MET values (Metabolic Equivalent of Task)
    const MET_VALUES: Record<string, Record<string, number>> = {
        corrida: { leve: 7, moderado: 10, intenso: 14 },
        caminhada: { leve: 2.5, moderado: 3.5, intenso: 5 },
        ciclismo: { leve: 4, moderado: 8, intenso: 12 },
        musculacao: { leve: 3, moderado: 5, intenso: 6 },
        natacao: { leve: 6, moderado: 8, intenso: 10 },
        hiit: { leve: 8, moderado: 12, intenso: 15 },
        yoga: { leve: 2, moderado: 3, intenso: 4 },
        danca: { leve: 4, moderado: 6, intenso: 8 },
        futebol: { leve: 5, moderado: 7, intenso: 10 },
        default: { leve: 3, moderado: 5, intenso: 7 },
    };

    const exerciseType = type.toLowerCase();
    const mets = MET_VALUES[exerciseType] || MET_VALUES.default;
    const met = mets[intensity];

    // Calories = MET × weight (kg) × duration (hours)
    const durationHours = durationMinutes / 60;
    return Math.round(met * pesoKg * durationHours);
}

export default useTDEE;
