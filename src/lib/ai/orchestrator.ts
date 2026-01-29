import { OpenAI } from "openai";
import { getUserProfile, saveMealPlan, getActiveMealPlan, logMeal } from "./tools";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function processChat(userId: string, chatId: string, userMessage: string) {
    // 1. Get Conversation context (User stats, active plan, previous messages)
    const profile = await getUserProfile(userId);
    const activePlan = await getActiveMealPlan(userId);

    // 2. Build the System Prompt
    const systemPrompt = `
    Você é o NeuralNutri Agent, um nutricionista especialista em nutrição esportiva e emagrecimento.
    Seu objetivo é ajudar o usuário a atingir seus objetivos de forma saudável e motivadora.
    
    PERFIL DO USUÁRIO:
    ${JSON.stringify(profile, null, 2)}
    
    DIETA ATUAL:
    ${JSON.stringify(activePlan, null, 2)}
    
    DIRETRIZES:
    - Seja empático e profissional.
    - Se o usuário pedir para gerar uma dieta, use a ferramenta 'save_meal_plan'.
    - Se o usuário falar que comeu algo, use 'log_meal'.
    - Sempre valide se os dados do usuário (peso, altura, objetivo) estão completos antes de sugerir mudanças drásticas.
    - Se faltar informação, pergunte educadamente.
    - Suas respostas devem ser em Português do Brasil.
  `;

    // 3. Call OpenAI with tools
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
        ],
        tools: [
            {
                type: "function",
                function: {
                    name: "save_meal_plan",
                    description: "Salva uma nova dieta gerada para o usuário.",
                    parameters: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            description: { type: "string" },
                            targetKcal: { type: "integer" },
                            targetMacros: {
                                type: "object",
                                properties: {
                                    proteina: { type: "integer" },
                                    carboidrato: { type: "integer" },
                                    gordura: { type: "integer" }
                                }
                            },
                            meals: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        nome: { type: "string" },
                                        horario: { type: "string" },
                                        kcal: { type: "integer" },
                                        alimentos: { type: "array", items: { type: "string" } }
                                    }
                                }
                            }
                        },
                        required: ["targetKcal", "targetMacros", "meals"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "log_meal",
                    description: "Registra uma refeição que o usuário consumiu no dia de hoje.",
                    parameters: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            kcal: { type: "integer" },
                            macros: {
                                type: "object",
                                properties: {
                                    proteina: { type: "integer" },
                                    carboidrato: { type: "integer" },
                                    gordura: { type: "integer" }
                                }
                            },
                            items: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        nome: { type: "string" },
                                        quantidade: { type: "integer" },
                                        unidade: { type: "string" },
                                        kcal: { type: "integer" }
                                    }
                                }
                            }
                        },
                        required: ["name", "kcal"]
                    }
                }
            }
        ]
    });

    const message = response.choices[0].message;

    // 4. Handle tool calls
    if (message.tool_calls) {
        for (const toolCall of message.tool_calls) {
            const args = JSON.parse(toolCall.function.arguments);

            if (toolCall.function.name === "save_meal_plan") {
                await saveMealPlan(userId, args);
            } else if (toolCall.function.name === "log_meal") {
                await logMeal(userId, args);
            }
        }

        // Call AI again to summarize what was done
        const secondResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
                message,
                ...message.tool_calls.map(tc => ({
                    role: "tool" as const,
                    content: "Operação realizada com sucesso no banco de dados.",
                    tool_call_id: tc.id
                }))
            ]
        });

        return secondResponse.choices[0].message.content;
    }

    return message.content;
}
