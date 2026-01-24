
import { FoodItem, Macros, Meal } from "@/stores/dailyLogStore";

export interface AIAnalysisResult {
    type: 'meal_log' | 'question' | 'rebalance';
    message: string;
    mealData?: Omit<Meal, 'id'>;
}

const MOCK_NUTRITION_DB: Record<string, { kcal: number, macros: Macros }> = {
    "maçã": { kcal: 52, macros: { proteina: 0, carboidrato: 14, gordura: 0 } },
    "banana": { kcal: 89, macros: { proteina: 1, carboidrato: 23, gordura: 0 } },
    "frango": { kcal: 165, macros: { proteina: 31, carboidrato: 0, gordura: 3.6 } },
    "arroz": { kcal: 130, macros: { proteina: 2.7, carboidrato: 28, gordura: 0.3 } },
    "ovo": { kcal: 155, macros: { proteina: 13, carboidrato: 1.1, gordura: 11 } },
};

export async function analyzeUserQuery(query: string): Promise<AIAnalysisResult> {
    const lowerQuery = query.toLowerCase();

    // Simple mock logic for "I ate XYZ"
    if (lowerQuery.includes("comi") || lowerQuery.includes("almocei") || lowerQuery.includes("jantei")) {
        const words = lowerQuery.split(" ");
        const detectedFoods: (Omit<FoodItem, 'id'>)[] = [];

        Object.keys(MOCK_NUTRITION_DB).forEach(food => {
            if (lowerQuery.includes(food)) {
                detectedFoods.push({
                    nome: food.charAt(0).toUpperCase() + food.slice(1),
                    quantidade: 100,
                    unidade: "g",
                    kcal: MOCK_NUTRITION_DB[food].kcal,
                    macros: MOCK_NUTRITION_DB[food].macros
                });
            }
        });

        if (detectedFoods.length > 0) {
            const totalKcal = detectedFoods.reduce((acc, f) => acc + f.kcal, 0);
            const totalMacros = detectedFoods.reduce((acc, f) => ({
                proteina: acc.proteina + f.macros.proteina,
                carboidrato: acc.carboidrato + f.macros.carboidrato,
                gordura: acc.gordura + f.macros.gordura,
            }), { proteina: 0, carboidrato: 0, gordura: 0 });

            return {
                type: 'meal_log',
                message: `Identifiquei ${detectedFoods.length} itens. Registrando no seu log diário!`,
                mealData: {
                    nome: "Refeição via IA",
                    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    items: detectedFoods as any, // Cast because items in store expects IDs, which store will add
                    totalKcal,
                    totalMacros
                }
            };
        }
    }

    if (lowerQuery.includes("quanto resta") || lowerQuery.includes("balanço")) {
        return {
            type: 'rebalance',
            message: "Analisando seu balanço de hoje... Você ainda tem 850kcal disponíveis. Recomendo focar em proteínas no jantar."
        };
    }

    return {
        type: 'question',
        message: "Interessante! Posso te ajudar a registrar isso ou tirar alguma dúvida sobre nutrição."
    };
}
