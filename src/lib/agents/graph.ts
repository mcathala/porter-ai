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
  TokenUsage,
  SIZE_EXPERIENCE_KPIS,
  computeInitialFinancials,
} from "../types/game";
import {
  PlayerCompanyAgentOutput,
  MarketAgentOutput,
  GamemasterOutput,
  PlayerCompanyAgentSchema,
  MarketAgentSchema,
  GamemasterOutputSchema,
  Turn0ResultSchema,
} from "./schemas";
import {
  getPlayerCompanyAgentPrompt,
  getMarketAgentPrompt,
  getGamemasterPrompt,
  getTurn0GamemasterPrompt,
} from "./prompts";

// =============================================================================
// GRAPH STATE ANNOTATION
// =============================================================================

const ZERO_USAGE: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };

const GraphState = Annotation.Root({
  turnInput: Annotation<TurnInput>,
  playerCompanyOutput: Annotation<PlayerCompanyAgentOutput | undefined>,
  marketOutput: Annotation<MarketAgentOutput | undefined>,
  gamemasterOutput: Annotation<GamemasterOutput | undefined>,
  turnResult: Annotation<TurnResult | undefined>,
  tokenUsage: Annotation<TokenUsage>({
    reducer: (a, b) => ({
      inputTokens: a.inputTokens + b.inputTokens,
      outputTokens: a.outputTokens + b.outputTokens,
      totalTokens: a.totalTokens + b.totalTokens,
    }),
    default: () => ({ ...ZERO_USAGE }),
  }),
});

// =============================================================================
// LLM INITIALIZATION
// =============================================================================

// LLM Factory is imported from ./llm.ts

// Extract token usage from LLM response metadata
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractUsage(response: any): TokenUsage {
  const meta = response?.usage_metadata;
  if (meta) {
    return {
      inputTokens: meta.input_tokens || 0,
      outputTokens: meta.output_tokens || 0,
      totalTokens: meta.total_tokens || (meta.input_tokens || 0) + (meta.output_tokens || 0),
    };
  }
  return { ...ZERO_USAGE };
}

interface SafeInvokeResult<T> {
  result: T;
  usage: TokenUsage;
}

// Safe invoke wrapper: attempts structured output, falls back to raw LLM + jsonrepair on failure
async function safeInvoke<T>(
  schema: z.ZodType<T>,
  messages: Array<{ role: string; content: string }>,
  retries = 1,
  label = "unknown"
): Promise<SafeInvokeResult<T>> {
  const invokeStart = performance.now();

  // First try: use structured output with JSON mode + includeRaw for token tracking
  try {
    const llm = createBaseLLM().withStructuredOutput(schema, {
      method: "jsonMode",
      includeRaw: true,
    });
    const response = await llm.invoke(messages) as { raw: unknown; parsed: T };
    if (response.parsed == null) {
      throw new Error("Structured output returned null parsed result");
    }
    const usage = extractUsage(response.raw);
    const elapsed = ((performance.now() - invokeStart) / 1000).toFixed(1);
    console.log(`[${label}] Structured output succeeded in ${elapsed}s (tokens: ${usage.totalTokens})`);
    return { result: response.parsed, usage };
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
      const usage = extractUsage(response);
      const rawText = typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

      const repairedJson = jsonrepair(rawText);
      const parsed = JSON.parse(repairedJson);
      const result = schema.parse(parsed) as T;
      const elapsed = ((performance.now() - attemptStart) / 1000).toFixed(1);
      const totalElapsed = ((performance.now() - invokeStart) / 1000).toFixed(1);
      console.log(`[${label}] Fallback attempt ${attempt + 1} succeeded in ${elapsed}s (total: ${totalElapsed}s, tokens: ${usage.totalTokens})`);
      return { result, usage };
    } catch (retryError) {
      const elapsed = ((performance.now() - attemptStart) / 1000).toFixed(1);
      console.warn(`[${label}] Fallback attempt ${attempt + 1} failed after ${elapsed}s`);
      if (attempt === retries) throw retryError;
    }
  }

  throw new Error(`[${label}] All attempts exhausted`);
}

// =============================================================================
// LAYER 1: PLAYER COMPANY AGENT
// =============================================================================

async function playerCompanyAgentNode(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  const { turnInput } = state;
  const { gameState, tasks, timeAdvance } = turnInput;

  const systemPrompt = getPlayerCompanyAgentPrompt(
    gameState.playerCompany,
    gameState.difficulty,
    gameState.customMarket || gameState.market,
    gameState.companyCulture,
    timeAdvance
  );

  const userPrompt = `
## CURRENT GAME STATE
- Turn: ${gameState.turn}
- Current Date: ${gameState.currentDate}
- Cash: $${gameState.kpis.cash.toLocaleString()}
- Market Share: ${gameState.kpis.marketShare}%
- Customer Satisfaction: ${gameState.kpis.satisfaction}%
- Brand Awareness: ${gameState.kpis.brandAwareness}%
- Time advance: ${timeAdvance}

## PLAYER'S ACTIONS THIS TURN
${tasks.length > 0 ? tasks.map((t, i) => `${i + 1}. ${t}`).join("\n") : "No specific actions — the company continues routine operations (business as usual)."}

## LAST TURN SUMMARY
${gameState.lastTurnSummary || "This is the first turn."}

## PENDING CONSEQUENCES
${gameState.pendingConsequences.length > 0
      ? gameState.pendingConsequences.map((c) => `- [${c.cause}] ${c.description}`).join("\n")
      : "None"
    }

Perform a full SWOT analysis of the player's current situation and actions. Scale proposed KPI impacts to the ${timeAdvance} time period.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const start = performance.now();
  const { result: output, usage } = await safeInvoke(PlayerCompanyAgentSchema, messages, 1, "PlayerCompanyAgent");
  console.log(`[PlayerCompanyAgent] Done in ${((performance.now() - start) / 1000).toFixed(1)}s`);
  return { playerCompanyOutput: output, tokenUsage: usage };
}

// =============================================================================
// LAYER 1: MARKET AGENT (blind to player action)
// =============================================================================

async function marketAgentNode(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  const { turnInput } = state;
  const { gameState, timeAdvance } = turnInput;

  const playerName = gameState.playerCompany.name;
  const systemPrompt = getMarketAgentPrompt(
    gameState.difficulty,
    gameState.customMarket || gameState.market,
    timeAdvance,
    playerName
  );

  const competitorStatus = gameState.competitors
    .map(
      (c) =>
        `- ${c.name} (${c.archetype}): ${c.marketShare}% market share, momentum: ${c.momentum}`
    )
    .join("\n");

  const restOfMarketStatus = `- Rest of market: ${gameState.restOfMarket.marketShare}% share, fragmentation: ${gameState.restOfMarket.fragmentation}, dynamism: ${gameState.restOfMarket.dynamism}, latent pressure: ${gameState.restOfMarket.latentPressure}`;

  // Randomized event count hint to break the LLM's tendency to always generate 2
  const eventCountHints: Record<string, number[]> = {
    week: [0, 0, 0, 1, 1],       // mostly 0, sometimes 1
    month: [0, 1, 1, 1, 2],      // mostly 1, sometimes 0 or 2
    quarter: [1, 1, 2, 2, 3],    // mostly 1-2, sometimes 3
    year: [2, 2, 3, 3, 4],       // mostly 2-3, sometimes 4
    event: [0, 1, 1, 1, 2],      // same as month
  };
  const hints = eventCountHints[timeAdvance] || eventCountHints.month;
  const suggestedEventCount = hints[Math.floor(Math.random() * hints.length)];

  // NOTE: No player action, no player company name, no player KPIs
  const lastTurnContext = gameState.lastTurnSummary
    ? `\n## PREVIOUS TURN CONTEXT\n${gameState.lastTurnSummary}\n\nUse this to vary your world event categories — avoid repeating the same types of events as last turn.`
    : "";

  const userPrompt = `
## MARKET STATE
- Industry: ${gameState.customMarket || gameState.market}
- Turn: ${gameState.turn}
- Time advance: ${timeAdvance}

## NAMED COMPETITORS
${competitorStatus || "No named competitors yet."}

## REST OF MARKET
${restOfMarketStatus}
${lastTurnContext}

Simulate what each competitor does this turn and what world events occur in this industry during this ${timeAdvance}. Remember: you have NO knowledge of what any specific player is doing. Only generate world events that would genuinely happen in this time window.

**Event count this turn: generate exactly ${suggestedEventCount} world event${suggestedEventCount !== 1 ? "s" : ""}.**`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const start = performance.now();
  const { result: output, usage } = await safeInvoke(MarketAgentSchema, messages, 1, "MarketAgent");
  console.log(`[MarketAgent] Done in ${((performance.now() - start) / 1000).toFixed(1)}s`);

  // Safety net: strip any competitor move that references the player's own company
  if (output && playerName) {
    const playerNameLower = playerName.toLowerCase();
    const before = output.competitorMoves.length;
    output.competitorMoves = output.competitorMoves.filter(
      (cm) => !cm.competitorName.toLowerCase().includes(playerNameLower)
    );
    if (output.competitorMoves.length < before) {
      console.warn(`[MarketAgent] Filtered ${before - output.competitorMoves.length} self-referencing competitor move(s) for "${playerName}"`);
    }
  }

  return { marketOutput: output, tokenUsage: usage };
}

// =============================================================================
// LAYER 2: GAMEMASTER
// =============================================================================

async function gamemasterNode(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  const { turnInput, playerCompanyOutput, marketOutput } = state;
  const { gameState, timeAdvance } = turnInput;

  const systemPrompt = getGamemasterPrompt(
    gameState.playerCompany,
    gameState.difficulty,
    timeAdvance,
    gameState.companyCulture
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
- Brand Awareness: ${gameState.kpis.brandAwareness}%
- Estimated Monthly Revenue: $${gameState.estimatedMonthlyRevenue.toLocaleString()}
- Estimated Monthly Costs: $${gameState.estimatedMonthlyCosts.toLocaleString()}

### Player Company Agent Analysis (SWOT of player's action)
${JSON.stringify(playerCompanyOutput, null, 2)}

### Market Agent Analysis (Independent market activity)
${JSON.stringify(marketOutput, null, 2)}

### Current Named Competitors
${gameState.competitors.length > 0
      ? JSON.stringify(gameState.competitors, null, 2)
      : "No named competitors yet."
    }

### Current Rest of Market
${JSON.stringify(gameState.restOfMarket, null, 2)}

### Current Narrative Arcs (player-only storylines)
${narrativeArcsStatus}

### Pending Consequences to Evaluate
${gameState.pendingConsequences.length > 0
      ? JSON.stringify(gameState.pendingConsequences, null, 2)
      : "None"
    }

### Current Company Culture
${gameState.companyCulture}

### Time Advance
${timeAdvance}

Synthesize the Player Company Agent's SWOT with the Market Agent's independent market activity. Resolve KPIs, update narratives (player-only, weights must sum to 100), manage competitors, handle consequences, and write the player-facing narrative.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const start = performance.now();
  let { result: output, usage } = await safeInvoke(GamemasterOutputSchema, messages, 2, "Gamemaster");

  // If the LLM returned null/undefined, create a minimal fallback
  if (!output) {
    console.error("[gamemasterNode] LLM returned null output, using full fallback");
    output = {
      kpiDeltas: {
        cash: { value: gameState.kpis.cash, change: 0, changePercent: 0, reason: "No changes this turn." },
        marketShare: { value: gameState.kpis.marketShare, change: 0, changePercent: 0, reason: "No changes this turn." },
        satisfaction: { value: gameState.kpis.satisfaction, change: 0, changePercent: 0, reason: "No changes this turn." },
        brandAwareness: { value: gameState.kpis.brandAwareness, change: 0, changePercent: 0, reason: "No changes this turn." },
      },
      updatedCompetitors: gameState.competitors,
      updatedRestOfMarket: gameState.restOfMarket,
      updatedNarratives: gameState.narrativeArcs.length > 0
        ? gameState.narrativeArcs
        : [{ id: "arc-initial", name: "Market Entry", weight: 100, createdAtTurn: gameState.turn, lastAmplifiedAtTurn: gameState.turn, status: "dominant" as const }],
      newConsequences: [],
      triggeredConsequences: [],
      newDate: "",
      turnSummary: "The turn proceeded without major incident.",
      newsItems: [],
      nextTurnContext: "The game continues.",
      companyCulture: gameState.companyCulture,
      estimatedMonthlyRevenue: gameState.estimatedMonthlyRevenue,
      estimatedMonthlyCosts: gameState.estimatedMonthlyCosts,
    };
  }

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

  // Fallback: ensure narrative fields are present
  if (!output.turnSummary) {
    console.warn("[gamemasterNode] LLM omitted turnSummary, using default");
    output.turnSummary = "The turn proceeded without major incident.";
  }
  if (!output.newsItems || output.newsItems.length === 0) {
    console.warn("[gamemasterNode] LLM omitted newsItems, using empty array");
    output.newsItems = [];
  }
  if (!output.nextTurnContext) {
    console.warn("[gamemasterNode] LLM omitted nextTurnContext, using default");
    output.nextTurnContext = "The game continues.";
  }

  // Fallback: use current culture if the LLM omitted it
  if (!output.companyCulture) {
    console.warn("[gamemasterNode] LLM omitted companyCulture, using current state");
    output.companyCulture = gameState.companyCulture;
  }

  // Fallback: use current financial estimates if the LLM omitted them
  if (!output.estimatedMonthlyRevenue) {
    console.warn("[gamemasterNode] LLM omitted estimatedMonthlyRevenue, using current state");
    output.estimatedMonthlyRevenue = gameState.estimatedMonthlyRevenue;
  }
  if (!output.estimatedMonthlyCosts) {
    console.warn("[gamemasterNode] LLM omitted estimatedMonthlyCosts, using current state");
    output.estimatedMonthlyCosts = gameState.estimatedMonthlyCosts;
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

  // Filter player company from updatedCompetitors (GM sometimes includes it)
  const playerNameLower = gameState.playerCompany.name.toLowerCase();
  const competitorsBefore = output.updatedCompetitors.length;
  output.updatedCompetitors = output.updatedCompetitors.filter(
    (c) => !c.name.toLowerCase().includes(playerNameLower)
  );
  if (output.updatedCompetitors.length < competitorsBefore) {
    console.warn(`[Gamemaster] Filtered ${competitorsBefore - output.updatedCompetitors.length} self-referencing competitor(s) for "${gameState.playerCompany.name}"`);
  }

  // Normalize market shares so they sum to exactly 100%
  const playerShare = output.kpiDeltas.marketShare.value;
  const competitorShares = output.updatedCompetitors.map((c) => c.marketShare);
  const restShare = output.updatedRestOfMarket.marketShare;
  const total = playerShare + competitorShares.reduce((a, b) => a + b, 0) + restShare;

  if (Math.abs(total - 100) > 0.5) {
    const ratio = 100 / total;
    const previousShare = gameState.kpis.marketShare;
    output.kpiDeltas.marketShare.value = +(playerShare * ratio).toFixed(1);
    output.kpiDeltas.marketShare.change = +(output.kpiDeltas.marketShare.value - previousShare).toFixed(1);
    output.kpiDeltas.marketShare.changePercent = previousShare > 0
      ? +((output.kpiDeltas.marketShare.change / previousShare) * 100).toFixed(1)
      : 0;
    output.updatedCompetitors.forEach((c) => {
      c.marketShare = +(c.marketShare * ratio).toFixed(1);
    });
    output.updatedRestOfMarket.marketShare = +(restShare * ratio).toFixed(1);
    console.warn(`[Gamemaster] Market share normalized: ${total.toFixed(1)}% → 100% (ratio: ${ratio.toFixed(3)})`);
  }

  console.log(`[Gamemaster] Done in ${((performance.now() - start) / 1000).toFixed(1)}s`);
  return { gamemasterOutput: output, tokenUsage: usage };
}

// =============================================================================
// FINAL ASSEMBLY NODE
// =============================================================================

function assembleResultNode(
  state: typeof GraphState.State
): Partial<typeof GraphState.State> {
  const { gamemasterOutput, marketOutput, playerCompanyOutput, tokenUsage } = state;

  if (!gamemasterOutput) {
    throw new Error("Gamemaster output is missing");
  }

  const turnResult: TurnResult = {
    kpiDeltas: gamemasterOutput.kpiDeltas,
    turnSummary: gamemasterOutput.turnSummary,
    newsItems: gamemasterOutput.newsItems,
    competitorMoves: marketOutput?.competitorMoves || [],
    updatedCompetitors: gamemasterOutput.updatedCompetitors,
    updatedRestOfMarket: gamemasterOutput.updatedRestOfMarket,
    updatedNarratives: gamemasterOutput.updatedNarratives,
    newConsequences: gamemasterOutput.newConsequences,
    triggeredConsequences: gamemasterOutput.triggeredConsequences,
    newDate: gamemasterOutput.newDate,
    nextTurnContext: gamemasterOutput.nextTurnContext,
    companyCulture: gamemasterOutput.companyCulture,
    estimatedMonthlyRevenue: gamemasterOutput.estimatedMonthlyRevenue,
    estimatedMonthlyCosts: gamemasterOutput.estimatedMonthlyCosts,
    tokenUsage,
    llmInfo: {
      provider: process.env.LLM_PROVIDER?.toLowerCase() || "groq",
      model:
        (process.env.LLM_PROVIDER?.toLowerCase() === "ollama"
          ? process.env.OLLAMA_MODEL
          : process.env.GROQ_MODEL) ||
        (process.env.LLM_PROVIDER?.toLowerCase() === "ollama"
          ? "gpt-oss:120b-cloud"
          : "openai/gpt-oss-20b"),
    },
    playerCompanyAgentOutput: playerCompanyOutput
      ? {
          strengths: playerCompanyOutput.strengths,
          weaknesses: playerCompanyOutput.weaknesses,
          opportunities: playerCompanyOutput.opportunities,
          threats: playerCompanyOutput.threats,
          proposedKPIImpacts: playerCompanyOutput.proposedKPIImpacts,
          sideEffects: playerCompanyOutput.sideEffects,
        }
      : undefined,
    marketAgentOutput: marketOutput
      ? {
          competitorMoves: marketOutput.competitorMoves,
          worldEvents: marketOutput.worldEvents,
          restOfMarketAssessment: marketOutput.restOfMarketAssessment,
        }
      : undefined,
  };

  console.log(`[TokenUsage] Turn total — input: ${tokenUsage.inputTokens}, output: ${tokenUsage.outputTokens}, total: ${tokenUsage.totalTokens}`);

  return { turnResult };
}

// =============================================================================
// BUILD THE GRAPH
// =============================================================================

export function buildTurnGraph() {
  const graph = new StateGraph(GraphState)
    // Layer 1 nodes (run in parallel)
    .addNode("playerCompanyAgent", playerCompanyAgentNode)
    .addNode("marketAgent", marketAgentNode)
    // Layer 2 (Gamemaster synthesizes both agents)
    .addNode("gamemaster", gamemasterNode)
    // Final assembly
    .addNode("assembleResult", assembleResultNode)

    // Edges from START — Layer 1 runs in parallel
    .addEdge(START, "playerCompanyAgent")
    .addEdge(START, "marketAgent")

    // Layer 1 → Layer 2 (both must complete before Gamemaster)
    .addEdge("playerCompanyAgent", "gamemaster")
    .addEdge("marketAgent", "gamemaster")

    // Layer 2 → Assembly
    .addEdge("gamemaster", "assembleResult")

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
    playerCompanyOutput: undefined,
    marketOutput: undefined,
    gamemasterOutput: undefined,
    turnResult: undefined,
    tokenUsage: { ...ZERO_USAGE },
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

  const startingKpis = SIZE_EXPERIENCE_KPIS[config.playerCompany.size][config.playerCompany.experience];
  const userPrompt = `Generate the initial market landscape for this new game. Remember: all market shares (player at ${startingKpis.marketShare}% + competitors + rest of market) must sum to 100%. Also generate an initial companyCulture description based on the player's mission and company characteristics.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const start = performance.now();
  console.log(`[Pipeline] Starting initialization...`);
  const { result, usage } = await safeInvoke(Turn0ResultSchema, messages, 2, "Initialization");
  console.log(`[Pipeline] Initialization completed in ${((performance.now() - start) / 1000).toFixed(1)}s (tokens: ${usage.totalTokens})`);

  // Compute initial financial estimates based on size + market share
  const financials = computeInitialFinancials(
    config.playerCompany.size,
    config.playerCompany.experience,
    startingKpis.marketShare
  );

  return {
    ...result,
    estimatedMonthlyRevenue: financials.estimatedMonthlyRevenue,
    estimatedMonthlyCosts: financials.estimatedMonthlyCosts,
    tokenUsage: usage,
  };
}
