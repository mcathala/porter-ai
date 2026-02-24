import { NextRequest, NextResponse } from "next/server";
import { executeInitialization } from "@/lib/agents/graph";
import { PlayerCompany, Difficulty } from "@/lib/types/game";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { difficulty, market, playerCompany } = body as {
      difficulty: Difficulty;
      market: string;
      playerCompany: PlayerCompany;
    };

    if (!difficulty || !market || !playerCompany) {
      return NextResponse.json(
        { error: "difficulty, market, and playerCompany are required" },
        { status: 400 }
      );
    }

    const result = await executeInitialization({
      difficulty,
      market,
      playerCompany,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Initialization error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to initialize game",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
