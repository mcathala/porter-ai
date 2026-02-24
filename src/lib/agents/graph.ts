import { StateGraph, END, START, Annotation } from "@langchain/langgraph";
import { createBaseLLM } from "./llm";
import { jsonrepair } from "jsonrepair";
import { z } from "zod";
import {
  TurnInput,
  TurnResult,
  Turn0Result,
  PlayerCompany,
  Difficulty,
  COMPANY_CONFIGS,
} from "../types/game";
import {
  InternalAgentOutput,
  ExternalAgentOutput,
  GamemasterOutput,
  NarratorOutput,
  InternalAgentSchema,
  ExternalAgentSchema,
  GamemasterOutputSchema,
  NarratorOutputSchema,
  Turn0ResultSchema,
} from "./schemas";
import {
  getInternalAgentPrompt,
  getExternalAgentPrompt,
  getGamemasterPrompt,
  getNarratorPrompt,
  getTurn0GamemasterPrompt,
  getNewsCountForTimeAdvance,
} from "./prompts";

// =============================================================================
// GRAPH STATE ANNOTATION
// =============================================================================

const GraphState = Annotation.Root({
  turnInput: Annotation<TurnInput>,
  internalOutput: Annotation<InternalAgentOutput | undefined>,
  externalOutput: Annotation<ExternalAgentOutput | undefined>,
  gamemasterOutput: Annotation<GamemasterOutput | undefined>,
  narratorOutput: Annotation<NarratorOutput | undefined>,
  turnResult: Annotation<TurnResult | undefined>,
});

// =============================================================================
// LLM INITIALIZATION
// =============================================================================

// LLM Factory is imported from ./llm.ts

// Safe invoke wrapper: attempts structured output, falls back to raw LLM + jsonrepair on failure
async function safeInvoke<T>(
  schema: z.ZodType<T>,
  messages: Array<{ role: string; content: string }>,
  retries = 1,
  label = "unknown"
): Promise<T> {
  const invokeStart = performance.now();

  // First try: use structured output with JSON mode
  try {
    const llm = createBaseLLM().withStructuredOutput(schema, { method: "jsonMode" });
    const result = await llm.invoke(messages) as T;
    const elapsed = ((performance.now() - invokeStart) / 1000).toFixed(1);
    console.log(`[${label}] Structured output succeeded in ${elapsed}s`);
    return result;
  } catch (firstError) {
    const elapsed = ((performance.now() - invokeStart) / 1000).toFixed(1);
    console.warn(`[${label}] Structured output failed after ${elapsed}s, attempting jsonrepair fallback`);
  }

  // Fallback: raw LLM call + jsonrepair + Zod validation
  for (let attempt = 0; attempt <= retries; attempt++) {
    const attemptStart = performance.now();
    try {
      const rawLLM = createBaseLLM();

      const response = await rawLLM.invoke(messages, {
        response_format: { type: "json_object" },
      } as any);
      const rawText = typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

      const repairedJson = jsonrepair(rawText);
      const parsed = JSON.parse(repairedJson);
      const result = schema.parse(parsed) as T;
      const elapsed = ((performance.now() - attemptStart) / 1000).toFixed(1);
      const totalElapsed = ((performance.now() - invokeStart) / 1000).toFixed(1);
      console.log(`[${label}] Fallback attempt ${attempt + 1} succeeded in ${elapsed}s (total: ${totalElapsed}s)`);
      return result;
    } catch (retryError) {
      const elapsed = ((performance.now() - attemptStart) / 1000).toFixed(1);
      console.warn(`[${label}] Fallback attempt ${attempt + 1} failed after ${elapsed}s`);
      if (attempt === retries) throw retryError;
    }
  }

  throw new Error(`[${label}] All attempts exhausted`);
}

// =============================================================================
// LAYER 1: INTERNAL AGENT
// =============================================================================

async function internalAgentNode(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  const { turnInput } = state;
  const { gameState, tasks } = turnInput;

  const systemPrompt = getInternalAgentPrompt(
    gameState.playerCompany,
    gameState.difficulty,
    gameState.customMarket || gameState.market
  );

  const userPrompt = `
## CURRENT GAME STATE
- Turn: ${gameState.turn}
- Current Date: ${gameState.currentDate}
- Cash: $${gameState.kpis.cash.toLocaleString()}
- Market Share: ${gameState.kpis.marketShare}%
- Customer Satisfaction: ${gameState.kpis.satisfaction}%

## PLAYER'S ACTIONS THIS TURN
${tasks.length > 0 ? tasks.map((t, i) => `${i + 1}. ${t}`).join("\n") : "No specific actions taken (routine operations)"}

## LAST TURN SUMMARY
${gameState.lastTurnSummary || "This is the first turn."}

## PENDING CONSEQUENCES
${gameState.pendingConsequences.length > 0
      ? gameState.pendingConsequences.map((c) => `- [${c.cause}] ${c.description}`).join("\n")
      : "None"
    }

Analyze the STRENGTHS and WEAKNESSES of these actions from the company's internal perspective.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const start = performance.now();
  const output = await safeInvoke(InternalAgentSchema, messages, 1, "InternalAgent");
  console.log(`[InternalAgent] Done in ${((performance.now() - start) / 1000).toFixed(1)}s`);
  return { internalOutput: output };
}

// =============================================================================
// LAYER 1: EXTERNAL AGENT
// =============================================================================

async function externalAgentNode(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  const { turnInput } = state;
  const { gameState, tasks } = turnInput;

  const systemPrompt = getExternalAgentPrompt(
    gameState.playerCompany,
    gameState.difficulty,
    gameState.customMarket || gameState.market
  );

  const competitorStatus = gameState.competitors
    .map(
      (c) =>
        `- ${c.name} (${c.archetype}): ${c.marketShare}% market share, momentum: ${c.momentum}`
    )
    .join("\n");

  const restOfMarketStatus = `- Rest of market: ${gameState.restOfMarket.marketShare}% share, fragmentation: ${gameState.restOfMarket.fragmentation}, dynamism: ${gameState.restOfMarket.dynamism}, latent pressure: ${gameState.restOfMarket.latentPressure}`;

  const userPrompt = `
## CURRENT MARKET STATE
- Industry: ${gameState.customMarket || gameState.market}
- Turn: ${gameState.turn}

## NAMED COMPETITORS
${competitorStatus || "No named competitors yet."}

## REST OF MARKET
${restOfMarketStatus}

## PLAYER'S ACTIONS THIS TURN
${tasks.length > 0 ? tasks.map((t, i) => `${i + 1}. ${t}`).join("\n") : "No specific actions taken (routine operations)"}

## PLAYER'S COMPANY
- Name: ${gameState.playerCompany.name}
- Type: ${COMPANY_CONFIGS[gameState.playerCompany.archetype].name}
- Market Share: ${gameState.kpis.marketShare}%

## PENDING CONSEQUENCES (external)
${gameState.pendingConsequences.length > 0
      ? gameState.pendingConsequences.map((c) => `- [${c.cause}] ${c.description}`).join("\n")
      : "None"
    }

## LAST TURN CONTEXT
${gameState.lastTurnSummary || "This is the first turn."}

Analyze the OPPORTUNITIES and THREATS of these actions, competitor reactions, and rest of market dynamics.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const start = performance.now();
  const output = await safeInvoke(ExternalAgentSchema, messages, 1, "ExternalAgent");
  console.log(`[ExternalAgent] Done in ${((performance.now() - start) / 1000).toFixed(1)}s`);
  return { externalOutput: output };
}

// =============================================================================
// LAYER 2: GAMEMASTER
// =============================================================================

async function gamemasterNode(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  const { turnInput, internalOutput, externalOutput } = state;
  const { gameState, timeAdvance } = turnInput;

  const systemPrompt = getGamemasterPrompt(
    gameState.playerCompany,
    gameState.difficulty,
    timeAdvance
  );

  const narrativeArcsStatus = gameState.narrativeArcs.length > 0
    ? gameState.narrativeArcs.map((a) => `- "${a.name}" — ${a.weight}% (${a.status})`).join("\n")
    : "No narrative arcs yet (this is early in the game — create initial arcs based on the player's action).";

  const userPrompt = `
## RESOLVE THIS TURN

### Player Actions
${turnInput.tasks.length > 0 ? turnInput.tasks.map((t, i) => `${i + 1}. ${t}`).join("\n") : "Routine operations only"}

### Current State
- Turn: ${gameState.turn}
- Current Date: ${gameState.currentDate}
- Cash: $${gameState.kpis.cash.toLocaleString()}
- Market Share: ${gameState.kpis.marketShare}%
- Satisfaction: ${gameState.kpis.satisfaction}%

### Internal Agent Analysis (Strengths / Weaknesses)
${JSON.stringify(internalOutput, null, 2)}

### External Agent Analysis (Opportunities / Threats)
${JSON.stringify(externalOutput, null, 2)}

### Current Named Competitors
${gameState.competitors.length > 0
      ? JSON.stringify(gameState.competitors, null, 2)
      : "No named competitors yet."
    }

### Current Rest of Market
${JSON.stringify(gameState.restOfMarket, null, 2)}

### Current Narrative Arcs
${narrativeArcsStatus}

### Pending Consequences to Evaluate
${gameState.pendingConsequences.length > 0
      ? JSON.stringify(gameState.pendingConsequences, null, 2)
      : "None"
    }

### Time Advance
${timeAdvance}

Resolve KPIs, update narratives (weights must sum to 100), manage competitors, and handle consequences.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const start = performance.now();
  const output = await safeInvoke(GamemasterOutputSchema, messages, 2, "Gamemaster");

  // Fallback: use current state values if the LLM omitted fields
  if (!output.updatedCompetitors || output.updatedCompetitors.length === 0) {
    console.warn("[gamemasterNode] LLM omitted updatedCompetitors, using current state");
    output.updatedCompetitors = gameState.competitors;
  }
  if (!output.updatedRestOfMarket || output.updatedRestOfMarket.marketShare === 0) {
    console.warn("[gamemasterNode] LLM omitted updatedRestOfMarket, using current state");
    output.updatedRestOfMarket = gameState.restOfMarket;
  }
  if (!output.updatedNarratives || output.updatedNarratives.length === 0) {
    console.warn("[gamemasterNode] LLM omitted updatedNarratives, using current state");
    output.updatedNarratives = gameState.narrativeArcs.length > 0
      ? gameState.narrativeArcs
      : [{
        id: "arc-initial",
        name: "Market Entry",
        weight: 100,
        createdAtTurn: gameState.turn,
        lastAmplifiedAtTurn: gameState.turn,
        status: "dominant" as const,
      }];
  }

  // Fallback: compute newDate if the LLM omitted it
  if (!output.newDate) {
    const base = new Date(gameState.currentDate);
    const advanceDays: Record<string, number> = {
      event: 1, week: 7, month: 30, quarter: 90, year: 365,
    };
    base.setDate(base.getDate() + (advanceDays[timeAdvance] ?? 7));
    output.newDate = base.toISOString().split("T")[0];
  }

  console.log(`[Gamemaster] Done in ${((performance.now() - start) / 1000).toFixed(1)}s`);
  return { gamemasterOutput: output };
}

// =============================================================================
// LAYER 3: NARRATOR
// =============================================================================

async function narratorNode(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  const { turnInput, gamemasterOutput, externalOutput } = state;
  const { gameState, timeAdvance } = turnInput;

  const newsCount = getNewsCountForTimeAdvance(timeAdvance);

  const systemPrompt = getNarratorPrompt(
    gameState.customMarket || gameState.market,
    gameState.difficulty,
    timeAdvance,
    newsCount
  );

  const narrativeContext = gamemasterOutput?.updatedNarratives
    ?.map((a) => `- "${a.name}" — ${a.weight}% (${a.status})`)
    .join("\n") || "No narrative arcs.";

  const userPrompt = `
## WRITE THE TURN NARRATIVE

### Gamemaster Context
${gamemasterOutput?.narratorContext || "No context provided."}

### Player Actions
${turnInput.tasks.length > 0 ? turnInput.tasks.map((t, i) => `${i + 1}. ${t}`).join("\n") : "Routine operations"}

### KPI Changes
- Cash: ${gamemasterOutput?.kpiDeltas.cash.reason || "No change"}
- Market Share: ${gamemasterOutput?.kpiDeltas.marketShare.reason || "No change"}
- Satisfaction: ${gamemasterOutput?.kpiDeltas.satisfaction.reason || "No change"}

### Competitor Activity
${externalOutput?.competitorReactions
      ?.map((m) => `- ${m.competitorName} (${m.archetype}): ${m.action}`)
      .join("\n") || "No significant competitor activity"
    }

### Active Narrative Arcs (flavor your writing with these)
${narrativeContext}

### New Consequences Created
${gamemasterOutput?.newConsequences
      ?.map((c) => `- ${c.description}`)
      .join("\n") || "None"
    }

### Triggered Consequences
${gamemasterOutput?.triggeredConsequences
      ?.map((c) => `- ${c.description}: ${c.effect}`)
      .join("\n") || "None"
    }

### Time Period
${timeAdvance} — Generate exactly ${newsCount} news items.

Write an engaging turn summary and news items.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const start = performance.now();
  const output = await safeInvoke(NarratorOutputSchema, messages, 1, "Narrator");
  console.log(`[Narrator] Done in ${((performance.now() - start) / 1000).toFixed(1)}s`);
  return { narratorOutput: output };
}

// =============================================================================
// FINAL ASSEMBLY NODE
// =============================================================================

function assembleResultNode(
  state: typeof GraphState.State
): Partial<typeof GraphState.State> {
  const { gamemasterOutput, narratorOutput, externalOutput } = state;

  if (!gamemasterOutput) {
    throw new Error("Gamemaster output is missing");
  }
  if (!narratorOutput) {
    throw new Error("Narrator output is missing");
  }

  const turnResult: TurnResult = {
    kpiDeltas: gamemasterOutput.kpiDeltas,
    turnSummary: narratorOutput.turnSummary,
    newsItems: narratorOutput.newsItems,
    competitorMoves: externalOutput?.competitorReactions || [],
    updatedCompetitors: gamemasterOutput.updatedCompetitors,
    updatedRestOfMarket: gamemasterOutput.updatedRestOfMarket,
    updatedNarratives: gamemasterOutput.updatedNarratives,
    newConsequences: gamemasterOutput.newConsequences,
    triggeredConsequences: gamemasterOutput.triggeredConsequences,
    newDate: gamemasterOutput.newDate,
    nextTurnContext: narratorOutput.nextTurnContext,
  };

  return { turnResult };
}

// =============================================================================
// BUILD THE GRAPH
// =============================================================================

export function buildTurnGraph() {
  const graph = new StateGraph(GraphState)
    // Layer 1 nodes (run in parallel)
    .addNode("internalAgent", internalAgentNode)
    .addNode("externalAgent", externalAgentNode)
    // Layer 2
    .addNode("gamemaster", gamemasterNode)
    // Layer 3
    .addNode("narrator", narratorNode)
    // Final assembly
    .addNode("assembleResult", assembleResultNode)

    // Edges from START — Layer 1 runs in parallel
    .addEdge(START, "internalAgent")
    .addEdge(START, "externalAgent")

    // Layer 1 → Layer 2 (both must complete before Gamemaster)
    .addEdge("internalAgent", "gamemaster")
    .addEdge("externalAgent", "gamemaster")

    // Layer 2 → Layer 3
    .addEdge("gamemaster", "narrator")

    // Layer 3 → Assembly
    .addEdge("narrator", "assembleResult")

    // Assembly → END
    .addEdge("assembleResult", END);

  return graph.compile();
}

// =============================================================================
// EXECUTE TURN
// =============================================================================

export async function executeTurn(turnInput: TurnInput): Promise<TurnResult> {
  const pipelineStart = performance.now();
  console.log(`[Pipeline] Starting turn ${turnInput.gameState.turn} execution...`);

  const graph = buildTurnGraph();

  const initialState: typeof GraphState.State = {
    turnInput,
    internalOutput: undefined,
    externalOutput: undefined,
    gamemasterOutput: undefined,
    narratorOutput: undefined,
    turnResult: undefined,
  };

  const result = await graph.invoke(initialState);

  if (!result.turnResult) {
    throw new Error("Turn execution failed - no result produced");
  }

  const totalElapsed = ((performance.now() - pipelineStart) / 1000).toFixed(1);
  console.log(`[Pipeline] Turn ${turnInput.gameState.turn} completed in ${totalElapsed}s`);

  return result.turnResult;
}

// =============================================================================
// EXECUTE INITIALIZATION (Turn 0)
// =============================================================================

export async function executeInitialization(config: {
  difficulty: Difficulty;
  market: string;
  playerCompany: PlayerCompany;
}): Promise<Turn0Result> {
  const systemPrompt = getTurn0GamemasterPrompt(
    config.playerCompany,
    config.difficulty,
    config.market
  );

  const userPrompt = `Generate the initial market landscape for this new game. Remember: all market shares (player at ${COMPANY_CONFIGS[config.playerCompany.archetype].startingMarketShare}% + competitors + rest of market) must sum to 100%.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const start = performance.now();
  console.log(`[Pipeline] Starting initialization...`);
  const result = await safeInvoke(Turn0ResultSchema, messages, 2, "Initialization");
  console.log(`[Pipeline] Initialization completed in ${((performance.now() - start) / 1000).toFixed(1)}s`);
  return result;
}
