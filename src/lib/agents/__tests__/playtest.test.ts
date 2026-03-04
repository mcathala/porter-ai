/**
 * Automated 3-turn playtest with full dev-panel output.
 * Initializes a game, plays 3 turns with a mix of actions/inactivity,
 * and prints every agent output for analysis — equivalent to the UI dev panel.
 *
 * Run: npx vitest run src/lib/agents/__tests__/playtest.test.ts
 */
import { describe, it, expect } from "vitest";
import { executeInitialization, executeTurn } from "../graph";
import {
  GameState,
  TurnInput,
  TurnResult,
  SIZE_EXPERIENCE_KPIS,
} from "../../types/game";

// ── Config ──────────────────────────────────────────────────────────────────
const PLAYER = {
  name: "Synwave Energy",
  mission: "Replace every coal plant with fusion before 2040",
  size: "large" as const,
  experience: "medium" as const,
};
const MARKET = "Energy";
const DIFFICULTY = "standard" as const;

const TURNS: { timeAdvance: "week" | "month" | "quarter"; tasks: string[] }[] = [
  { timeAdvance: "week", tasks: [] },                                          // Turn 1: idle week
  { timeAdvance: "month", tasks: ["Begin construction of a small-scale fusion prototype reactor at our Texas facility"] }, // Turn 2: bold action
  { timeAdvance: "month", tasks: [] },                                         // Turn 3: idle month (test post-action stability)
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function sep(label: string) {
  console.log(`\n${"═".repeat(80)}`);
  console.log(`  ${label}`);
  console.log(`${"═".repeat(80)}`);
}

function sub(label: string) {
  console.log(`\n  ${"─".repeat(40)}`);
  console.log(`  ${label}`);
  console.log(`  ${"─".repeat(40)}`);
}

function printKPIs(result: TurnResult) {
  sub("RESOLVED KPIs (Gamemaster final)");
  const { cash, marketShare, satisfaction } = result.kpiDeltas;
  console.log(`    Cash:         $${cash.value.toLocaleString()} (${cash.change >= 0 ? "+" : ""}${cash.change.toLocaleString()}, ${cash.changePercent >= 0 ? "+" : ""}${cash.changePercent}%)`);
  console.log(`      Reason: ${cash.reason}`);
  console.log(`    Market Share: ${marketShare.value}% (${marketShare.change >= 0 ? "+" : ""}${marketShare.change}%, ${marketShare.changePercent >= 0 ? "+" : ""}${marketShare.changePercent}%)`);
  console.log(`      Reason: ${marketShare.reason}`);
  console.log(`    Satisfaction: ${satisfaction.value}% (${satisfaction.change >= 0 ? "+" : ""}${satisfaction.change}%, ${satisfaction.changePercent >= 0 ? "+" : ""}${satisfaction.changePercent}%)`);
  console.log(`      Reason: ${satisfaction.reason}`);
}

function printPlayerAgent(result: TurnResult) {
  if (!result.playerCompanyAgentOutput) {
    console.log(`\n  [Player Company Agent: no output]`);
    return;
  }
  const p = result.playerCompanyAgentOutput;
  sub("PLAYER COMPANY AGENT");

  console.log(`\n    Strengths (${p.strengths.length}):`);
  for (const s of p.strengths) console.log(`      + ${s}`);

  console.log(`\n    Weaknesses (${p.weaknesses.length}):`);
  for (const w of p.weaknesses) console.log(`      - ${w}`);

  console.log(`\n    Opportunities (${p.opportunities.length}):`);
  for (const o of p.opportunities) console.log(`      > ${o}`);

  console.log(`\n    Threats (${p.threats.length}):`);
  for (const t of p.threats) console.log(`      ! ${t}`);

  console.log(`\n    Side Effects (${p.sideEffects.length}):`);
  for (const s of p.sideEffects) console.log(`      ~ ${s}`);

  console.log(`\n    Proposed KPI Impacts:`);
  console.log(`      Cash: ${p.proposedKPIImpacts.cash >= 0 ? "+" : ""}${p.proposedKPIImpacts.cash}`);
  console.log(`      Market Share: ${p.proposedKPIImpacts.marketShare >= 0 ? "+" : ""}${p.proposedKPIImpacts.marketShare}`);
  console.log(`      Satisfaction: ${p.proposedKPIImpacts.satisfaction >= 0 ? "+" : ""}${p.proposedKPIImpacts.satisfaction}`);
}

function printMarketAgent(result: TurnResult) {
  if (!result.marketAgentOutput) {
    console.log(`\n  [Market Agent: no output]`);
    return;
  }
  const m = result.marketAgentOutput;
  sub("MARKET AGENT");

  console.log(`\n    Competitor Moves (${m.competitorMoves.length}):`);
  for (const move of m.competitorMoves) {
    console.log(`      [${move.archetype}] ${move.competitorName}:`);
    console.log(`        Action: ${move.action}`);
    console.log(`        Impact: ${move.impact}`);
  }

  console.log(`\n    World Events (${m.worldEvents.length}):`);
  for (const e of m.worldEvents) {
    console.log(`      [${e.category}] [${e.sentiment}] ${e.headline}`);
    console.log(`        ${e.description}`);
  }

  console.log(`\n    Rest of Market Assessment:`);
  console.log(`      ${m.restOfMarketAssessment}`);
}

function printCompetitors(result: TurnResult) {
  sub("COMPETITORS (updated)");
  for (const c of result.updatedCompetitors) {
    console.log(`    ${c.name} (${c.archetype}) — ${c.marketShare}% share, ${c.momentum} momentum`);
  }
  const rom = result.updatedRestOfMarket;
  console.log(`    Rest of market — ${rom.marketShare}% share (frag: ${rom.fragmentation}, dyn: ${rom.dynamism}, pressure: ${rom.latentPressure})`);
  const total = result.kpiDeltas.marketShare.value
    + result.updatedCompetitors.reduce((s, c) => s + c.marketShare, 0)
    + rom.marketShare;
  console.log(`    TOTAL: ${total.toFixed(1)}%`);
}

function printNarratives(result: TurnResult) {
  sub("NARRATIVE ARCS");
  for (const n of result.updatedNarratives) {
    console.log(`    "${n.name}" — weight: ${n.weight}%, status: ${n.status}, created: T${n.createdAtTurn}, last amplified: T${n.lastAmplifiedAtTurn}`);
  }
  const totalWeight = result.updatedNarratives.reduce((s, n) => s + n.weight, 0);
  console.log(`    Weight sum: ${totalWeight}% (should be 100%)`);
}

function printNewsItems(result: TurnResult) {
  if (!result.newsItems || result.newsItems.length === 0) {
    console.log(`\n    [No news items]`);
    return;
  }
  sub("NEWS ITEMS");
  for (const n of result.newsItems) {
    console.log(`    [${n.category}] [${n.sentiment}] [${n.relevance}] ${n.headline}`);
    console.log(`      ${n.summary}`);
  }
}

function printTurnSummary(result: TurnResult) {
  sub("TURN SUMMARY (full)");
  console.log(`    ${result.turnSummary}`);
}

function printConsequences(result: TurnResult) {
  sub("CONSEQUENCES");
  if (result.newConsequences.length > 0) {
    console.log(`    New (${result.newConsequences.length}):`);
    for (const c of result.newConsequences) {
      console.log(`      [${c.id}] "${c.description}"`);
      console.log(`        Cause: ${c.cause}`);
      console.log(`        Effect: ${c.effect}`);
      if (c.kpiImpact) console.log(`        KPI Impact: ${JSON.stringify(c.kpiImpact)}`);
    }
  } else {
    console.log(`    New: none`);
  }
  if (result.triggeredConsequences.length > 0) {
    console.log(`    Triggered (${result.triggeredConsequences.length}):`);
    for (const c of result.triggeredConsequences) {
      console.log(`      [${c.id}] "${c.description}" — ${c.effect}`);
    }
  } else {
    console.log(`    Triggered: none`);
  }
}

function printTokenUsage(result: TurnResult) {
  if (!result.tokenUsage) return;
  const t = result.tokenUsage;
  console.log(`\n    Tokens: ${t.inputTokens.toLocaleString()} in / ${t.outputTokens.toLocaleString()} out / ${t.totalTokens.toLocaleString()} total`);
  if (result.llmInfo) {
    console.log(`    LLM: ${result.llmInfo.provider} / ${result.llmInfo.model}`);
  }
}

// ── Test ─────────────────────────────────────────────────────────────────────

describe("Automated Playtest (3 turns)", () => {
  it("plays 3 turns and prints full dev-panel output", async () => {
    // ── Initialize ──
    sep("INITIALIZATION");
    const startKpis = SIZE_EXPERIENCE_KPIS[PLAYER.size][PLAYER.experience];
    const init = await executeInitialization({
      difficulty: DIFFICULTY,
      market: MARKET,
      playerCompany: PLAYER,
    });

    console.log(`  Player: ${PLAYER.name} (${PLAYER.size}/${PLAYER.experience})`);
    console.log(`  Mission: ${PLAYER.mission}`);
    console.log(`  Market: ${MARKET} | Difficulty: ${DIFFICULTY}`);
    console.log(`  Starting KPIs: cash=$${startKpis.cash.toLocaleString()}, share=${startKpis.marketShare}%, sat=${startKpis.satisfaction}%`);
    console.log(`\n  Competitors (${init.competitors.length}):`);
    for (const c of init.competitors) {
      console.log(`    - ${c.name} (${c.archetype}) — ${c.marketShare}% share, ${c.momentum} momentum`);
    }
    const rom = init.restOfMarket;
    console.log(`  Rest of market: ${rom.marketShare}% (frag: ${rom.fragmentation}, dyn: ${rom.dynamism}, pressure: ${rom.latentPressure})`);
    console.log(`  Company culture: ${init.companyCulture}`);

    expect(init.competitors.length).toBeGreaterThanOrEqual(3);

    // ── Build initial game state ──
    let gameState: GameState = {
      difficulty: DIFFICULTY,
      market: "custom",
      customMarket: MARKET,
      playerCompany: PLAYER,
      turn: 1,
      currentDate: "2025-01-01",
      kpis: startKpis,
      companyCulture: init.companyCulture,
      competitors: init.competitors,
      restOfMarket: init.restOfMarket,
      narrativeArcs: [],
      lastTurnSummary: undefined,
      pendingConsequences: [],
    };

    // ── Play turns ──
    for (let i = 0; i < TURNS.length; i++) {
      const turn = TURNS[i];
      const turnNumber = i + 1;

      sep(`TURN ${turnNumber} — ${turn.timeAdvance} — ${turn.tasks.length > 0 ? turn.tasks[0].slice(0, 80) : "routine operations (no player action)"}`);

      const turnInput: TurnInput = {
        tasks: turn.tasks,
        gameState,
        timeAdvance: turn.timeAdvance,
      };

      const result: TurnResult = await executeTurn(turnInput);

      // ── Full dev-panel output ──
      printPlayerAgent(result);
      printMarketAgent(result);
      printKPIs(result);
      printCompetitors(result);
      printNarratives(result);
      printNewsItems(result);
      printConsequences(result);
      printTurnSummary(result);
      printTokenUsage(result);

      // ── Assertions ──
      expect(result.turnSummary).toBeTruthy();
      expect(result.updatedCompetitors.length).toBeGreaterThanOrEqual(3);
      expect(result.updatedNarratives.length).toBeGreaterThanOrEqual(1);

      // Market shares should roughly sum to 100
      const totalShare = result.kpiDeltas.marketShare.value
        + result.updatedCompetitors.reduce((s, c) => s + c.marketShare, 0)
        + result.updatedRestOfMarket.marketShare;
      console.log(`\n  Share sum check: ${totalShare.toFixed(1)}% (should be ~100%)`);
      expect(totalShare).toBeGreaterThan(90);
      expect(totalShare).toBeLessThan(110);

      // ── Advance game state for next turn ──
      gameState = {
        ...gameState,
        turn: turnNumber + 1,
        currentDate: result.newDate,
        kpis: {
          cash: result.kpiDeltas.cash.value,
          marketShare: result.kpiDeltas.marketShare.value,
          satisfaction: result.kpiDeltas.satisfaction.value,
        },
        companyCulture: result.companyCulture,
        competitors: result.updatedCompetitors,
        restOfMarket: result.updatedRestOfMarket,
        narrativeArcs: result.updatedNarratives,
        lastTurnSummary: result.turnSummary,
        pendingConsequences: [
          ...gameState.pendingConsequences.filter(
            (p) => !result.triggeredConsequences.some((t) => t.id === p.id)
          ),
          ...result.newConsequences,
        ],
      };
    }

    // ── Final summary ──
    sep("FINAL STATE");
    console.log(`  Cash: $${gameState.kpis.cash.toLocaleString()}`);
    console.log(`  Market Share: ${gameState.kpis.marketShare}%`);
    console.log(`  Satisfaction: ${gameState.kpis.satisfaction}%`);
    console.log(`  Pending consequences: ${gameState.pendingConsequences.length}`);
    for (const c of gameState.pendingConsequences) {
      console.log(`    [${c.id}] "${c.description}" — effect: ${c.effect}`);
    }
    console.log(`  Narrative arcs: ${gameState.narrativeArcs.length}`);
    for (const n of gameState.narrativeArcs) {
      console.log(`    "${n.name}" ${n.weight}% (${n.status})`);
    }
  });
});
