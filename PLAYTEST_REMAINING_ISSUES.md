# Playtest Remaining Issues — Post-KPI Rebalance

**Date:** 2026-03-11
**Games tested:** `default` (medium/standard, EV), `fashion` (small/easy, luxury streetwear)
**Context:** After rewriting the Gamemaster KPI resolution guide, competitor momentum rules, and news editorial system.

---

## Issue 1: Market Share Sum Exceeds 100%

**Severity: P0 — Breaks game logic**
**Observed in:** Both games. Default hit **119%** on turns 2-5. Fashion hit **103.8%** on turns 4-5.

The Gamemaster prompt says "player + all competitors + rest of market MUST equal 100%" but the LLM consistently ignores this constraint. It updates the player's share and competitors independently without redistributing.

**Root cause:** This is a math constraint that LLMs are unreliable at enforcing. The prompt instruction alone is insufficient.

**Proposed fix — Code-level normalization in `gamemasterNode` (graph.ts):**
After the Gamemaster returns `updatedCompetitors`, `updatedRestOfMarket`, and the player's new `marketShare`, normalize all shares proportionally so they sum to exactly 100%:

```typescript
// After GM output, normalize market shares to sum to 100%
const playerShare = output.kpiDeltas.marketShare.value;
const competitorShares = output.updatedCompetitors.map(c => c.marketShare);
const restShare = output.updatedRestOfMarket.marketShare;
const total = playerShare + competitorShares.reduce((a, b) => a + b, 0) + restShare;

if (Math.abs(total - 100) > 0.5) {
  const ratio = 100 / total;
  output.kpiDeltas.marketShare.value = +(playerShare * ratio).toFixed(1);
  output.kpiDeltas.marketShare.change = +(output.kpiDeltas.marketShare.value - previousShare).toFixed(1);
  output.updatedCompetitors.forEach(c => { c.marketShare = +(c.marketShare * ratio).toFixed(1); });
  output.updatedRestOfMarket.marketShare = +(restShare * ratio).toFixed(1);
}
```

This preserves the GM's relative distribution while enforcing the hard constraint.

---

## Issue 2: Cash Never Positive (Revenue Model Not Working)

**Severity: P0 — Core gameplay broken**
**Observed in:** Both games. **0/10 turns** had positive cash across both playtests.

The GM mentions revenue in its reasons (e.g., "Revenue from existing market share partially offset...") but still resolves a net negative every single turn. The prompt says "Cash = previous cash + REVENUE - COSTS" but the LLM treats revenue as a reduction in costs rather than as actual income.

**Root cause:** The revenue model in the prompt is descriptive but not concrete enough. The LLM has no anchor for what revenue looks like in dollar terms. It defaults to "actions cost money" because that's easier to reason about.

**Proposed fix — Add revenue anchoring to the Gamemaster prompt:**
Add a concrete formula that gives the LLM a ballpark:

```
**REVENUE ANCHOR:** As a rough baseline, a company generates monthly revenue proportional to its
market share and size. For reference:
- A small company with 5% share might earn $50k-200k/month
- A medium company with 18% share might earn $1-3M/month
- A large company with 30% share might earn $5-15M/month
These are baselines — actual revenue depends on the industry, product mix, and pricing strategy.
The player's actions (product launches, price changes, market share gains) should visibly affect revenue.

When a player takes NO actions (routine operations), cash should be SLIGHTLY POSITIVE or flat —
the company's existing revenue covers its operating costs. Cash should only decline during routine
operations if the company is pre-revenue, burning through runway, or facing a specific cost crisis.
```

**Alternative/complementary fix — Inject computed revenue into the user prompt:**
Calculate a baseline revenue number in code and pass it to the GM as context:

```typescript
// In gamemasterNode, before constructing the user prompt
const baselineMonthlyRevenue = estimateRevenue(gameState.kpis.marketShare, gameState.playerCompany.size);
// Then in the user prompt:
// "Estimated baseline monthly revenue: $X (based on current market share and company size)"
```

This gives the LLM a concrete number to work with rather than asking it to invent one.

---

## Issue 3: Player Appears in Competitor List (Gamemaster Self-Reference)

**Severity: P1 — Confusing output**
**Observed in:** Both games at final summary. `VoltDrive` appeared as a "follower" competitor. `Maison Rêve` appeared as a "follower" competitor.

The Market Agent self-reference filter works (in `marketAgentNode`), but the **Gamemaster** independently adds the player company to `updatedCompetitors`. The filter only runs on Market Agent output, not on Gamemaster output.

**Root cause:** The Gamemaster prompt says "Max 3-5 named actors" for competitors but doesn't explicitly say "the player is NOT a competitor." The GM sometimes includes the player in the competitor list.

**Proposed fix — Two layers:**

1. **Prompt:** Add to the Gamemaster's Competitor Management section:
   ```
   CRITICAL: The player's company ("${playerCompany.name}") is NOT a competitor.
   NEVER include the player in the updatedCompetitors array.
   ```

2. **Code safety net:** Add a filter in `gamemasterNode` after the GM returns, similar to the Market Agent filter:
   ```typescript
   // Filter player company from updatedCompetitors (GM sometimes includes it)
   const playerNameLower = gameState.playerCompany.name.toLowerCase();
   output.updatedCompetitors = output.updatedCompetitors.filter(
     (c) => !c.name.toLowerCase().includes(playerNameLower)
   );
   ```

---

## Issue 4: Events Always Exactly 2 Per Turn

**Severity: P2 — Monotonous feel**
**Observed in:** Both games. Every single turn across both games had exactly 2 world events, regardless of time period (week, month, quarter).

The Market Agent prompt says "0-3 events" and the Gamemaster now has editorial discretion, but neither produces variation.

**Root cause:** The Market Agent consistently generates exactly 2 because the prompt examples and ranges center on 2. The Gamemaster editorial filter doesn't drop any because it passes through all events as news items.

**Proposed fix — Strengthen the Market Agent prompt:**
Replace the current event count guidance with stronger variance language:

```
IMPORTANT: Vary the number of events. Do NOT default to always generating 2.
- Some turns should have 0 events (quiet period, nothing newsworthy happened)
- Some turns should have 1 event
- Rarely, a turbulent period might have 3 events
- The number should feel RANDOM and realistic, not formulaic
```

Also consider injecting a random hint in the user prompt: `"Event count hint: generate ${randomInt(0, 3)} events this turn"` — this breaks the LLM's pattern-matching tendency without being deterministic.

---

## Issue 5: All Competitors Active Every Turn

**Severity: P2 — Unrealistic**
**Observed in:** Both games. Active competitors per turn: `[4, 4, 4, 4, 4]` (fashion) and `[3, 3, 4, 4, 4]` (default).

Despite the Market Agent prompt saying "NOT EVERY COMPETITOR NEEDS A HEADLINE-WORTHY MOVE," every competitor still gets a substantive action entry every turn.

**Root cause:** The Market Agent generates one entry per competitor in its `competitorMoves` array. Even "quiet" competitors get a paragraph. The schema requires an entry for each competitor — there's no way to skip.

**Proposed fix — Schema + prompt change:**
The `competitorMoves` array doesn't need an entry for every competitor. Update the Market Agent prompt:

```
You do NOT need to generate a move for every competitor. If a competitor is having a quiet turn
(neutral momentum, no strategic trigger), simply OMIT them from the competitorMoves array.
Only include competitors who are doing something noteworthy this turn.
At least 1 competitor should be omitted per turn to reflect realistic market pacing.
```

---

## Summary

| # | Issue | Severity | Fix Type | Status |
|---|-------|----------|----------|--------|
| 1 | Market share sum > 100% | P0 | Code (normalization) | Fixed |
| 2 | Cash never positive | P0 | Prompt (revenue anchoring) + code (revenue/cost model) | Fixed |
| 3 | Player in competitor list (GM) | P1 | Prompt + code (filter) | |
| 4 | Events always 2 | P2 | Prompt (variance language) | |
| 5 | All competitors active | P2 | Prompt (allow omission) | Fixed |
