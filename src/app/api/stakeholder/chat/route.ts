import { NextRequest } from "next/server";
import { Contact, GameState } from "@/lib/types/game";
import { getStakeholderSystemPrompt } from "@/lib/agents/stakeholderPrompt";
import { createBaseLLM } from "@/lib/agents/llm";

interface StakeholderChatRequest {
  contact: Contact;
  message: string;
  gameState: GameState;
  conversationHistory: {
    role: "user" | "assistant";
    content: string;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    const body: StakeholderChatRequest = await request.json();
    const { contact, message, gameState, conversationHistory } = body;

    if (!contact || !message || !gameState) {
      return new Response(
        JSON.stringify({ error: "contact, message and gameState are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = getStakeholderSystemPrompt(contact, gameState);

    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add recent conversation history (last 10 exchanges)
    if (conversationHistory && conversationHistory.length > 0) {
      for (const msg of conversationHistory.slice(-10)) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: "user", content: message });

    const llm = createBaseLLM({ streaming: true });
    const stream = await llm.stream(messages);

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          let inputTokens = 0;
          let outputTokens = 0;

          for await (const chunk of stream) {
            const content = chunk.content;
            if (typeof content === "string") {
              controller.enqueue(new TextEncoder().encode(content));
            }
            const meta = (chunk as unknown as Record<string, unknown>).usage_metadata as
              | { input_tokens?: number; output_tokens?: number }
              | undefined;
            if (meta) {
              if (meta.input_tokens) inputTokens = meta.input_tokens;
              if (meta.output_tokens) outputTokens = meta.output_tokens;
            }
          }

          const totalTokens = inputTokens + outputTokens;
          if (totalTokens > 0) {
            const usageData = JSON.stringify({ inputTokens, outputTokens, totalTokens });
            controller.enqueue(new TextEncoder().encode(`\n__TOKEN_USAGE__:${usageData}`));
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Stakeholder chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: "Failed to get stakeholder response", details: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
