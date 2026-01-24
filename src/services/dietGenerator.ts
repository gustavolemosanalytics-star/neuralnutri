import { Meal, FoodItem, Macros } from '@/stores/dailyLogStore';

type MockFoodItem = Omit<FoodItem, 'id'>;
type MockMeal = Omit<Meal, 'id' | 'items'> & { items: MockFoodItem[] };

export function generateMockDiet(targetKcal: number, targetMacros: Macros): MockMeal[] {
    const distributions = [
        { name: 'Café da Manhã', time: '08:00', pct: 0.20 },
        { name: 'Almoço', time: '12:30', pct: 0.35 },
        { name: 'Lanche da Tarde', time: '16:00', pct: 0.15 },
        { name: 'Jantar', time: '20:00', pct: 0.30 },
    ];

    const mockFoods: Record<string, MockFoodItem[]> = {
        'Café da Manhã': [
            { nome: 'Ovos Mexidos', quantidade: 2, unidade: 'unid', kcal: 140, macros: { proteina: 12, carboidrato: 1, gordura: 10 } },
            { nome: 'Pão Integral', quantidade: 2, unidade: 'fatias', kcal: 120, macros: { proteina: 4, carboidrato: 22, gordura: 1 } },
            { nome: 'Café sem açúcar', quantidade: 1, unidade: 'xícara', kcal: 2, macros: { proteina: 0, carboidrato: 0, gordura: 0 } },
        ],
        'Almoço': [
            { nome: 'Peito de Frango Grelhado', quantidade: 150, unidade: 'g', kcal: 250, macros: { proteina: 45, carboidrato: 0, gordura: 5 } },
            { nome: 'Arroz Integral', quantidade: 100, unidade: 'g', kcal: 110, macros: { proteina: 3, carboidrato: 23, gordura: 1 } },
            { nome: 'Feijão Carioca', quantidade: 100, unidade: 'g', kcal: 76, macros: { proteina: 5, carboidrato: 14, gordura: 0 } },
            { nome: 'Salada Mix', quantidade: 1, unidade: 'prato', kcal: 30, macros: { proteina: 1, carboidrato: 5, gordura: 0 } },
        ],
        'Lanche da Tarde': [
            { nome: 'Iogurte Natural', quantidade: 170, unidade: 'g', kcal: 100, macros: { proteina: 6, carboidrato: 9, gordura: 4 } },
            { nome: 'Granola', quantidade: 30, unidade: 'g', kcal: 120, macros: { proteina: 3, carboidrato: 20, gordura: 4 } },
        ],
        'Jantar': [
            { nome: 'Filé de Tilápia', quantidade: 150, unidade: 'g', kcal: 190, macros: { proteina: 30, carboidrato: 0, gordura: 3 } },
            { nome: 'Batata Doce Cozida', quantidade: 100, unidade: 'g', kcal: 86, macros: { proteina: 2, carboidrato: 20, gordura: 0 } },
            { nome: 'Brócolis no Vapor', quantidade: 100, unidade: 'g', kcal: 35, macros: { proteina: 3, carboidrato: 7, gordura: 0 } },
        ]
    };

    return distributions.map(dist => {
        const mealKcal = Math.round(targetKcal * dist.pct);
        const mealProteina = Math.round(targetMacros.proteina * dist.pct);
        const mealCarbo = Math.round(targetMacros.carboidrato * dist.pct);
        const mealGordura = Math.round(targetMacros.gordura * dist.pct);

        return {
            nome: dist.name,
            time: dist.time,
            items: mockFoods[dist.name] || [],
            totalKcal: mealKcal,
            totalMacros: {
                proteina: mealProteina,
                carboidrato: mealCarbo,
                gordura: mealGordura
            }
        };
    });
}
