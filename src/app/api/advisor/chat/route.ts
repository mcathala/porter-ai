import { NextRequest } from "next/server";
import { GameState } from "@/lib/types/game";
import { getAdvisorSystemPrompt } from "@/lib/agents/advisorPrompt";
import { createBaseLLM } from "@/lib/agents/llm";

// Define type locally to avoid context import issues
interface TurnHistoryEntry {
  turn: number;
  date: string;
  result: {
    turnSummary: string;
  };
  playerActions: string[];
}

interface AdvisorRequest {
  message: string;
  gameState: GameState;
  turnHistory: TurnHistoryEntry[];
  pendingActions: string[];
  conversationHistory: {
    role: "user" | "assistant";
    content: string;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    // Check for configured provider
    if (!process.env.LLM_PROVIDER && !process.env.GROQ_API_KEY && !process.env.OLLAMA_API_KEY && !process.env.OPENAI_API_KEY) {
      console.warn("No specific LLM provider or key configured. Using default behaviour, which may fail if unauthorized.");
    }

    const body: AdvisorRequest = await request.json();
    const {
      message,
      gameState,
      turnHistory,
      pendingActions,
      conversationHistory,
    } = body;

    if (!message || !gameState) {
      return new Response(
        JSON.stringify({ error: "message and gameState are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build system prompt with full context
    const systemPrompt = getAdvisorSystemPrompt(
      gameState,
      turnHistory || [],
      pendingActions || []
    );

    // Build messages array
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history (last 10 messages)
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    }

    // Add current user message
    messages.push({ role: "user", content: message });

    // Create LLM with streaming using the centralized factory
    const llm = createBaseLLM({ streaming: true });

    // Create streaming response
    const stream = await llm.stream(messages);

    // Create a ReadableStream for the response
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.content;
            if (typeof content === "string") {
              controller.enqueue(new TextEncoder().encode(content));
            }
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
    console.error("Advisor chat error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return new Response(
      JSON.stringify({
        error: "Failed to get advisor response",
        details: errorMessage,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
