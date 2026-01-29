import { auth } from "@/auth";
import { processChat } from "@/lib/ai/orchestrator";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, chatId: existingChatId } = await req.json();

    if (!message) {
        return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const userId = session.user.id;

    // 1. Get or Create Chat
    let chat;
    if (existingChatId) {
        chat = await prisma.chat.findUnique({
            where: { id: existingChatId }
        });
    }

    if (!chat) {
        chat = await prisma.chat.create({
            data: {
                userId,
                title: message.substring(0, 30) + (message.length > 30 ? "..." : "")
            }
        });
    }

    const chatId = chat.id;

    // 2. Save User Message
    await prisma.message.create({
        data: {
            chatId,
            role: "user",
            content: message
        }
    });

    try {
        // 3. Process with AI Orchestrator
        const aiResponse = await processChat(userId, chatId, message);

        // 4. Save AI Message
        await prisma.message.create({
            data: {
                chatId,
                role: "assistant",
                content: aiResponse
            }
        });

        return NextResponse.json({
            chatId,
            message: aiResponse
        });
    } catch (error: any) {
        console.error("AI Chat Error:", error);
        return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
        return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: "asc" }
    });

    return NextResponse.json(messages);
}
