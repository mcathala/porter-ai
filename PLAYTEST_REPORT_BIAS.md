# Porter AI — Playtest Bias & Improvement Report

**Date:** 2026-03-10
**Presets tested:** `default` (EV/medium), `crypto` (small/hard), `healthcare` (large/easy), `fooddelivery` (medium/standard)
**Turns per game:** 5

---

## Critical Bugs Found

### 1. Self-Reference Bug — Player Company Appears as Competitor
**Severity: HIGH**
In the `fooddelivery` playtest, **BiteBringer appeared in its own competitor moves list** on turns 3, 4, and 5. The market agent generated actions for the player's own company as if it were a competitor:
- Turn 3: `BiteBringer (follower): Implements incremental cost‑saving measures...`
- Turn 4: `BiteBringer (follower): Rolling out a sustainability‑focused marketing campaign...`
- Turn 5: `BiteBringer (follower): Implemented a cost‑cutting program...`

**Impact:** The AI treats the player as both protagonist AND competitor, creating contradictory narratives. The player's archetype was even reassigned to "follower."

**Fix:** The market agent prompt must explicitly exclude the player company name from competitor move generation. Add a hard filter in `api/turn` that strips any competitor move where `competitorName` matches the player company.

### 2. Market Share Sum Exceeds 100%
**Severity: HIGH**
In the `fooddelivery` game, total market share consistently exceeded 100%:
- Turn 2: **108.6%**
- Turn 3: **108.7%**
- Turn 4: **108.6%**
- Turn 5: **108.4%**

**Impact:** Breaks the fundamental zero-sum constraint of market share. The game loses economic realism.

**Fix:** The gamemaster agent must enforce a normalization step that ensures `playerShare + sum(competitorShares) + restOfMarket == 100%`. Consider clamping in the API response handler.

### 3. Player Agent Cash Proposal Scaling Bug
**Severity: MEDIUM**
In the `healthcare` turn 1, the player agent proposed `cash: -4` instead of `cash: -4,000,000`. The gamemaster then resolved `-4,000,000`, creating a dampening ratio of `1,000,000x`.

**Impact:** The player agent sometimes returns values in the wrong unit scale, making dampening analysis unreliable and potentially causing incorrect gamemaster reasoning.

**Fix:** Add validation in the player agent output parser to detect implausibly small absolute cash values relative to the company's cash reserves (e.g., `|proposed_cash| < 100` when cash > $1M should trigger a retry or scaling correction).

---

## Bias Analysis

### 4. Market Share Is Almost Impossible to Gain
**Severity: HIGH — Core gameplay issue**

Across all 4 games (20 total turns), market share changes were minimal:

| Game | Start Share | End Share | Net Change | Turns |
|------|-----------|---------|-----------|-------|
| Default (EV) | 18.0% | 18.5% | **+0.5%** | 5 |
| Crypto | 2.0% | 2.3% | **+0.3%** | 5 |
| Healthcare | 45.0% | 45.1% | **+0.1%** | 5 |
| Food Delivery | 8.0% | 8.4% | **+0.4%** | 5 |

The gamemaster consistently dampens market share proposals by **50-75%**. Even with aggressive multi-action turns, share barely moves. This makes the game feel unrewarding — players can't meaningfully change their competitive position.

**Dampening ratios for market share (proposed → resolved):**
- 0.50x, 0.53x, 0.25x, 0.40x, 0.50x (typical range)

**Recommendation:**
- Reduce market share dampening, especially for aggressive/costly actions
- Allow share swings of 1-3% per turn for impactful actions
- Create "breakthrough" moments where share can jump significantly (e.g., acquisition completion, viral product launch)
- Make difficulty affect dampening: easy mode should allow bigger swings

### 5. Cash Always Decreases — No Positive Revenue Turns
**Severity: HIGH — Core gameplay issue**

Cash was positive in only **3 out of 20 turns** across all games, and 2 of those were due to the GM inventing bridge financing (sign-flipping a negative proposal to positive).

| Game | Start Cash | End Cash | Change | Positive Turns |
|------|-----------|---------|--------|---------------|
| Default | $15M | $8.9M | -$6.1M | 0/5 |
| Crypto | $500K | $210K | -$290K | 1/5 (sign flip) |
| Healthcare | $150M | $139M | -$11M | 0/5 |
| Food Delivery | $5M | -$3.5M | -$8.5M | 2/5 (sign flips) |

**Impact:** Players never feel like their actions generate revenue. Cash is a one-way drain. This undermines the business simulation aspect — successful product launches should generate income.

**Recommendation:**
- Model revenue explicitly: successful product launches, price increases, and market share gains should generate positive cash flow
- Add a "revenue per turn" mechanic based on market share and product portfolio
- Reserve cash drains for R&D, marketing, and expansion costs
- Allow players to become profitable through smart decisions

### 6. Brand Awareness Only Goes Up
**Severity: MEDIUM**

Brand awareness increased in **19 out of 20 turns**. Even during inaction turns and crises, brand never meaningfully declined. The only negative turn was `-0.4%` in the food delivery desperate pivot.

**Recommendation:**
- Inaction should cause brand decay (people forget)
- Negative events (layoffs, pivots, quality issues) should meaningfully hurt brand
- Brand should be harder to build and easier to lose, creating real strategic tension

### 7. Satisfaction Has a Downward Bias
**Severity: MEDIUM**

Satisfaction declined in the majority of turns, even when players took positive actions:

| Game | Start Sat | End Sat | Change |
|------|----------|--------|--------|
| Default | 75.0% | 76.5% | +1.5% |
| Crypto | 90.0% | 88.4% | -1.6% |
| Healthcare | 60.0% | 58.6% | -1.4% |
| Food Delivery | 85.0% | 81.4% | -3.6% |

3 out of 4 games saw satisfaction decline. The gamemaster frequently dampens positive satisfaction proposals and amplifies negative ones.

**Recommendation:**
- Rebalance so that customer-facing actions (product launches, service improvements) reliably boost satisfaction
- Only penalize satisfaction for genuinely negative actions (layoffs affecting service, quality cuts)

---

## World Simulation Biases

### 8. World Events Are Monotonous — Only Regulatory & Technology
**Severity: MEDIUM**

Event category distribution across all games:

| Category | Count | Percentage |
|----------|-------|-----------|
| Regulatory | 20 | **51%** |
| Technology | 18 | **46%** |
| Macro | 1 | 3% |
| Other (social, cultural, economic) | 0 | 0% |

**Impact:** The world feels one-dimensional. No economic crises, social movements, cultural shifts, pandemics, supply chain disruptions, or consumer trend changes.

**Recommendation:**
- Diversify event categories: add `economic`, `social`, `cultural`, `environmental`, `geopolitical`, `consumer_trend`
- Ensure no category exceeds 40% of total events
- Add market-specific events (e.g., for food delivery: weather impacts, restaurant closures, food safety scares)
- Add cross-market macro events that affect all players differently

### 9. All Competitors Always Active — No Strategic Variation
**Severity: MEDIUM**

Every competitor made a significant move on every single turn in all 4 games. The "quiet" counter was almost always 0.

**Recommendation:**
- Some competitors should skip turns or make minor moves
- Follower archetypes should sometimes wait and copy rather than always innovating
- Dominant players should sometimes rest on their laurels
- Create competitor "fatigue" after aggressive turns

### 10. Competitors Always Have Positive Momentum
**Severity: MEDIUM**

At game end, almost all competitors had "positive" momentum regardless of their actions. Only EcoRide (default game) had "negative" and BiteBringer (self-reference bug) had "negative."

**Recommendation:**
- Competitors should be able to decline, fail, or exit the market
- Bad competitor decisions should lead to negative momentum
- Market disruptions should create winners AND losers among competitors

### 11. Event Count is Static (Always 2 Per Turn)
**Severity: LOW**

Almost every turn produced exactly 2 world events, regardless of time advance (week, month, quarter).

**Recommendation:**
- Scale events by time advance: weeks get 1, months get 2-3, quarters get 3-5
- Allow "calm" periods with 0-1 events and "turbulent" periods with 4-5
- Time advance should meaningfully affect the volume of market change

---

## Dampening System Issues

### 12. Sign Flips Are Too Common
**Severity: HIGH**

Across all games, there were **8 sign flips** (gamemaster reversed the direction of the player agent's proposal). This means the gamemaster sometimes decides an action that should help actually hurts, or vice versa, with no clear justification.

Notable examples:
- Healthcare T1: Agent proposed `marketShare +0.5` → GM resolved `-0.5` (FDA filing somehow lost share?)
- Crypto T2: Agent proposed `cash -2,000,000` → GM resolved `+400,000` (invented financing)
- Food Delivery T4: Agent proposed `marketShare +0.05` → GM resolved `-0.1` (inaction somehow lost share — actually reasonable)

**Recommendation:**
- Sign flips should be rare and reserved for clearly justified situations (e.g., action backfires due to market conditions)
- Add a "sign flip justification" requirement in the gamemaster prompt
- Cap sign flips to max 1 per game on non-zero actions

### 13. Dampening Ratios Are Inconsistent
The gamemaster dampening varies wildly between turns and KPIs with no clear pattern:
- Sometimes 0.25x (heavy dampening)
- Sometimes 1.67x (amplification)
- Sometimes 1,000,000x (bug)

**Recommendation:**
- Establish dampening bands per difficulty level:
  - Easy: 0.7x - 1.3x
  - Standard: 0.5x - 1.2x
  - Hard: 0.3x - 1.0x
- The gamemaster should explain why it dampened or amplified each KPI

---

## Gameplay Design Recommendations

### 14. Inaction Should Have Clearer Consequences
When players chose to "do nothing," the impact was minimal and inconsistent. In some games, market share barely moved; in others, it was unaffected.

**Recommendation:**
- Inaction should cause measurable decay in competitive position
- Market share should erode 0.5-1% per inaction turn as competitors advance
- Brand should decay by 1-2% per quarter of inaction
- Make the cost of inaction proportional to time advance

### 15. Contradictory Actions Are Not Penalized
In the crypto game, the player simultaneously slashed fees to zero AND increased premium prices by 50%. The game treated these as separate valid actions instead of recognizing the contradiction.

**Recommendation:**
- Add a contradiction detection layer that identifies conflicting actions
- Contradictory actions should cause confusion penalties (satisfaction -2-3%, brand -1-2%)
- The narrative should explicitly call out the mixed messaging

### 16. Time Advance Has No Impact on KPI Magnitude
Whether the player advanced by a week, month, or quarter, KPI changes were roughly the same magnitude.

**Recommendation:**
- Quarter advances should produce 3x the impact of month advances
- Week advances should produce ~0.25x the impact of month advances
- Compound effects should accumulate over longer time periods

---

## Summary of Priority Fixes

| Priority | Issue | Type | Done |
|----------|-------|------|------|
| P0 | Self-reference bug (player in competitor list) | Bug | Fixed |
| P0 | Market share sum > 100% | Bug | Fixed |
| P0 | Market share nearly impossible to gain | Balance | Fixed |
| P1 | Cash never positive (no revenue model) | Balance | Fixed |
| P1 | Sign flips too common | Balance | Fixed |
| P1 | Cash proposal scaling bug | Bug ||
| P1 | World events only regulatory/technology | Content | Fixed |
| P2 | Brand awareness only goes up | Balance | Fixed |
| P2 | Satisfaction downward bias | Balance | Fixed |
| P2 | Competitors always active, always positive | Balance ||
| P2 | Time advance doesn't scale KPI impact | Design | Fixed |
| P3 | Contradictory actions not penalized | Design ||
| P3 | Event count always 2 regardless of time | Design | Fixed |
| P3 | Dampening ratios inconsistent | Balance | Fixed |
