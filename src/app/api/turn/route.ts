import { NextRequest, NextResponse } from "next/server";
import { executeTurn } from "@/lib/agents/graph";
import { TurnInput, TurnResult } from "@/lib/types/game";

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const turnInput: TurnInput = body;

    // Validate required fields
    if (!turnInput.gameState) {
      return NextResponse.json(
        { error: "gameState is required" },
        { status: 400 }
      );
    }

    if (!turnInput.timeAdvance) {
      return NextResponse.json(
        { error: "timeAdvance is required" },
        { status: 400 }
      );
    }

    // Ensure tasks array exists
    if (!turnInput.tasks) {
      turnInput.tasks = [];
    }

    // Validate game has been initialized
    if (!turnInput.gameState.competitors || turnInput.gameState.competitors.length === 0) {
      return NextResponse.json(
        { error: "Game must be initialized before processing turns" },
        { status: 400 }
      );
    }

    // Execute the turn through the agent graph
    const result: TurnResult = await executeTurn(turnInput);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Turn processing error:", error);

    // Return detailed error in development
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to process turn",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
