import { prisma } from "@/lib/prisma";

/**
 * Retrieves the user's physical profile and goals
 */
export async function getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            stats: true,
            mode: true,
            level: true,
        }
    });
    return user;
}

/**
 * Saves a new AI-generated meal plan for the user
 */
export async function saveMealPlan(userId: string, planData: any) {
    // Deactivate previous AI plans
    await prisma.mealPlan.updateMany({
        where: { userId, source: "AI" },
        data: { isActive: false }
    });

    // Create new plan
    const plan = await prisma.mealPlan.create({
        data: {
            userId,
            name: planData.name || "Dieta Gerada pela IA",
            description: planData.description,
            targetKcal: planData.targetKcal,
            targetMacros: planData.targetMacros,
            meals: planData.meals,
            source: "AI",
            isActive: true,
        }
    });

    return plan;
}

/**
 * Gets the current active meal plan
 */
export async function getActiveMealPlan(userId: string) {
    return prisma.mealPlan.findFirst({
        where: { userId, isActive: true },
        orderBy: { createdAt: 'desc' }
    });
}

/**
 * Logs a meal into the daily log
 */
export async function logMeal(userId: string, mealData: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create daily log
    let dailyLog = await prisma.dailyLog.findUnique({
        where: {
            userId_date: {
                userId,
                date: today
            }
        }
    });

    if (!dailyLog) {
        // Get targets from active plan
        const activePlan = await getActiveMealPlan(userId);
        dailyLog = await prisma.dailyLog.create({
            data: {
                userId,
                date: today,
                targetKcal: activePlan?.targetKcal || 2000,
                targetMacros: activePlan?.targetMacros as any || { proteina: 0, carboidrato: 0, gordura: 0 }
            }
        });
    }

    // Create meal
    const meal = await prisma.meal.create({
        data: {
            userId,
            dailyLogId: dailyLog.id,
            name: mealData.name,
            kcal: mealData.kcal,
            macros: mealData.macros,
            items: mealData.items,
            source: "AI_CHAT"
        }
    });

    // Update daily log totals (simplified for now)
    const allMeals = await prisma.meal.findMany({
        where: { dailyLogId: dailyLog.id }
    });

    const totals = allMeals.reduce((acc, m) => ({
        kcal: acc.kcal + m.kcal,
        macros: {
            proteina: acc.macros.proteina + ((m.macros as any).proteina || 0),
            carboidrato: acc.macros.carboidrato + ((m.macros as any).carboidrato || 0),
            gordura: acc.macros.gordura + ((m.macros as any).gordura || 0),
        }
    }), { kcal: 0, macros: { proteina: 0, carboidrato: 0, gordura: 0 } });

    await prisma.dailyLog.update({
        where: { id: dailyLog.id },
        data: {
            eatenKcal: totals.kcal,
            eatenMacros: totals.macros,
            netCalories: totals.kcal - dailyLog.burnedKcal
        }
    });

    return meal;
}
