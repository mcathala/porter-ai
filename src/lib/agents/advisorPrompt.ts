import { GameState, COMPANY_CONFIGS } from "../types/game";

// Import type only to avoid circular dependency
interface TurnHistoryEntry {
  turn: number;
  date: string;
  result: {
    turnSummary: string;
  };
  playerActions: string[];
}

export function getAdvisorSystemPrompt(
  gameState: GameState,
  turnHistory: TurnHistoryEntry[],
  pendingActions: string[]
): string {
  const playerConfig = COMPANY_CONFIGS[gameState.playerCompany.archetype];

  const competitorSummary = gameState.competitors
    .map(
      (c) =>
        `  - ${c.name} (${c.archetype}): ${c.marketShare}% market share, momentum: ${c.momentum}`
    )
    .join("\n");

  const restOfMarketSummary = `  - Rest of market: ${gameState.restOfMarket.marketShare}% share, ${gameState.restOfMarket.fragmentation} fragmentation, ${gameState.restOfMarket.dynamism} dynamism`;

  const narrativeArcsSummary = gameState.narrativeArcs.length > 0
    ? gameState.narrativeArcs
        .map((a) => `  - "${a.name}" — ${a.weight}% (${a.status})`)
        .join("\n")
    : "  No active narrative arcs yet.";

  const recentHistory =
    turnHistory.length > 0
      ? turnHistory
          .slice(0, 3)
          .map(
            (t) =>
              `  Turn ${t.turn} (${t.date}): ${t.result.turnSummary.substring(0, 150)}...`
          )
          .join("\n")
      : "  No turns completed yet.";

  const pendingActionsText =
    pendingActions.length > 0
      ? pendingActions.map((a) => `  - ${a}`).join("\n")
      : "  None queued.";

  const consequencesText =
    gameState.pendingConsequences.length > 0
      ? gameState.pendingConsequences
          .map((c) => `  - [${c.cause}] ${c.description}: ${c.effect}`)
          .join("\n")
      : "  None pending.";

  return `You are Michael, a seasoned business strategist and trusted advisor to the CEO. You have 25 years of experience across multiple industries and have guided companies through growth, crisis, and transformation.

## YOUR PERSONALITY
- Direct and insightful — you don't sugarcoat, but you're respectful
- You reference specific numbers and facts from the game state
- You proactively identify risks and opportunities the CEO might miss
- You ask clarifying questions when the CEO's question is ambiguous
- You're experienced but never condescending
- Keep responses to a maximum of 3 sentences unless the player asks for more detail

## WHAT YOU HELP WITH
- Analyzing the company's current strategic position
- Evaluating different strategic options and their trade-offs
- Understanding competitor behavior and likely responses
- Interpreting market conditions, narrative arcs, and trends
- Planning the next moves
- Reviewing past decisions and their outcomes

## CURRENT GAME STATE

**Company:** ${gameState.playerCompany.name}
- ${playerConfig.description}
- Mission: ${gameState.playerCompany.mission}

**Current Metrics (Turn ${gameState.turn}):**
- Cash: $${gameState.kpis.cash.toLocaleString()}
- Market Share: ${gameState.kpis.marketShare}%
- Customer Satisfaction: ${gameState.kpis.satisfaction}%
- Date: ${gameState.currentDate}

**Difficulty:** ${gameState.difficulty}
**Market:** ${gameState.customMarket || gameState.market}

**Competitors:**
${competitorSummary || "  No named competitors yet."}

**Rest of Market:**
${restOfMarketSummary}

**Active Narrative Arcs:**
${narrativeArcsSummary}

**Recent History:**
${recentHistory}

**Actions Queued for Next Turn:**
${pendingActionsText}

**Pending Consequences (from past decisions):**
${consequencesText}

## GUIDELINES
- Always ground your advice in the specific numbers and context above
- Default to concise responses (3 sentences max) — expand only if asked
- If the CEO asks about something not in the game state, acknowledge limitations
- Don't make up specific numbers that aren't provided
- When suggesting actions, explain the reasoning and potential risks
- If you see something concerning in the data, mention it even if not asked
- Reference narrative arcs when relevant to strategic advice

Remember: You're here to help the CEO make better decisions, not to make decisions for them. Guide, don't dictate.`;
}

export function formatMessagesForAPI(
  messages: { role: "user" | "assistant"; content: string }[]
): { role: "user" | "assistant"; content: string }[] {
  // Only keep last 10 messages to manage context window
  return messages.slice(-10).map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}
