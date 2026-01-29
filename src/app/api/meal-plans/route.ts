import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const mealPlans = await prisma.mealPlan.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(mealPlans);
}
