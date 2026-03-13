#!/usr/bin/env python3
"""
Porter AI — Adaptive AI Player Playtest

Instead of pre-recorded moves, an AI agent dynamically decides what
actions to take each turn based on the current game state, competitor
moves, and market conditions.

Usage:
    python3 scripts/playtest-ai.py                          # Default (VoltDrive, standard, medium/medium)
    python3 scripts/playtest-ai.py --preset fashion         # Fashion startup, easy
    python3 scripts/playtest-ai.py --preset saas            # SaaS incumbent, hard
    python3 scripts/playtest-ai.py --turns 8                # Play 8 turns instead of 5
    python3 scripts/playtest-ai.py --provider groq          # Force Groq provider

Requires:
    - Dev server running: npm run dev
    - LLM API key in .env.local
"""

import json
import urllib.request
import argparse
import sys
import os
import re

BASE_URL = "http://localhost:3000"

# ── Company presets (setup only — moves are AI-generated) ──
PRESETS = {
    "default": {
        "difficulty": "standard",
        "name": "VoltDrive",
        "mission": "Make electric vehicles accessible and exciting for everyday drivers",
        "size": "medium",
        "experience": "medium",
        "market": "electric vehicles",
    },
    "fashion": {
        "difficulty": "easy",
        "name": "Maison Rêve",
        "mission": "Redefine luxury streetwear by merging haute couture craftsmanship with urban culture",
        "size": "small",
        "experience": "new",
        "market": "luxury streetwear fashion",
    },
    "saas": {
        "difficulty": "hard",
        "name": "Orion Systems",
        "mission": "Provide enterprise-grade cloud infrastructure and B2B SaaS tools trusted by Fortune 500 companies",
        "size": "large",
        "experience": "old",
        "market": "enterprise cloud infrastructure and B2B SaaS",
    },
}

STARTING_KPIS = {
    "small": {
        "new":    {"cash": 500_000,   "marketShare": 2,  "satisfaction": 90, "brandAwareness": 10},
        "medium": {"cash": 2_000_000, "marketShare": 5,  "satisfaction": 85, "brandAwareness": 25},
        "old":    {"cash": 5_000_000, "marketShare": 8,  "satisfaction": 75, "brandAwareness": 40},
    },
    "medium": {
        "new":    {"cash": 5_000_000,  "marketShare": 8,  "satisfaction": 85, "brandAwareness": 30},
        "medium": {"cash": 15_000_000, "marketShare": 18, "satisfaction": 75, "brandAwareness": 50},
        "old":    {"cash": 30_000_000, "marketShare": 25, "satisfaction": 65, "brandAwareness": 65},
    },
    "large": {
        "new":    {"cash": 25_000_000,  "marketShare": 15, "satisfaction": 80, "brandAwareness": 45},
        "medium": {"cash": 75_000_000,  "marketShare": 30, "satisfaction": 70, "brandAwareness": 70},
        "old":    {"cash": 150_000_000, "marketShare": 45, "satisfaction": 60, "brandAwareness": 85},
    },
}

AI_PLAYER_SYSTEM = """You are an expert AI CEO playing a business strategy simulation.

You control {name}, a {size} company ({experience} in the industry) competing in the {market} market.
Mission: {mission}
Difficulty: {difficulty}

Each turn you must decide:
1. What strategic actions to take (0-3 actions). Actions are free-form text describing concrete business decisions.
2. How much time to advance: "week", "month", or "quarter"
   - week: small tactical moves, reacting to urgent events
   - month: standard operational tempo
   - quarter: letting big investments play out, or observing

Strategy guidelines:
- Adapt based on game results, competitor moves, and market conditions
- Watch your cash — if burn rate is high, consider cost-cutting or revenue-boosting moves
- React to competitor threats (a disruptor gaining share, a dominant player cutting prices)
- Leverage narrative arcs — amplify storylines that are working in your favor
- Balance short-term wins with long-term positioning
- Empty tasks [] means "routine operations only" — use sparingly when you want to observe
- Be specific in your actions (name amounts, targets, channels)

Respond with ONLY valid JSON, no markdown, no extra text:
{{"reasoning": "1-2 sentences on your strategic thinking this turn", "tasks": ["specific action 1", "specific action 2"], "timeAdvance": "month"}}"""


# ── Env loading ──

def load_env():
    """Load .env.local from project root."""
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env.local")
    env = {}
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    env[key.strip()] = val.strip()
    return env


# ── LLM calls ──

def llm_decide(system_prompt, user_prompt, env):
    """Call LLM and return parsed JSON decision."""
    provider = env.get("LLM_PROVIDER", "groq").lower()

    if provider == "ollama":
        return _call_ollama(system_prompt, user_prompt, env)
    else:
        return _call_groq(system_prompt, user_prompt, env)


def _call_groq(system_prompt, user_prompt, env):
    api_key = env.get("GROQ_API_KEY")
    if not api_key:
        print("ERROR: GROQ_API_KEY not found in .env.local")
        sys.exit(1)

    model = env.get("GROQ_MODEL", "openai/gpt-oss-20b")
    body = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.7,
    }
    req = urllib.request.Request(
        "https://api.groq.com/openai/v1/chat/completions",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read())
    content = data["choices"][0]["message"]["content"]
    return _parse_json(content)


def _call_ollama(system_prompt, user_prompt, env):
    base_url = env.get("OLLAMA_BASE_URL", "https://ollama.com")
    model = env.get("OLLAMA_MODEL", "gpt-oss:120b-cloud")

    body = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "format": "json",
        "stream": False,
    }
    headers = {"Content-Type": "application/json"}
    if env.get("OLLAMA_API_KEY"):
        headers["Authorization"] = f"Bearer {env['OLLAMA_API_KEY']}"

    req = urllib.request.Request(
        f"{base_url.rstrip('/')}/api/chat",
        data=json.dumps(body).encode("utf-8"),
        headers=headers,
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read())
    content = data["message"]["content"]
    return _parse_json(content)


def _parse_json(text):
    """Parse JSON from LLM response, handling markdown fences."""
    text = text.strip()
    # Strip markdown code fences if present
    match = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)
    if match:
        text = match.group(1)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to find first { ... } block
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        raise


# ── Game API ──

def api_post(path, data):
    req = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read())
    except Exception as e:
        print(f"\n  ERROR calling {path}: {e}")
        sys.exit(1)


# ── Turn prompt builder ──

def build_turn_prompt(game_state, turn_num, turn_history, last_result):
    """Build the context the AI player sees before making a decision."""
    parts = []
    kpis = game_state["kpis"]
    rev = game_state.get("estimatedMonthlyRevenue", 0)
    cost = game_state.get("estimatedMonthlyCosts", 0)

    parts.append(f"=== TURN {turn_num + 1} === Date: {game_state['currentDate']}")

    # KPIs
    parts.append(f"\nYour KPIs:")
    parts.append(f"  Cash:             ${kpis['cash']:>14,.0f}")
    parts.append(f"  Market Share:     {kpis['marketShare']:>14.1f}%")
    parts.append(f"  Satisfaction:     {kpis['satisfaction']:>14.1f}%")
    parts.append(f"  Brand Awareness:  {kpis['brandAwareness']:>14.1f}%")
    parts.append(f"\n  Monthly Revenue:  ${rev:>14,}    Costs: ${cost:,}    Net: ${rev - cost:+,}/mo")

    months_runway = kpis["cash"] / cost if cost > 0 else 999
    if months_runway < 12:
        parts.append(f"  ⚠ Cash runway: ~{months_runway:.0f} months at current burn rate")

    # Competitors
    parts.append(f"\nCompetitor landscape:")
    for c in game_state["competitors"]:
        parts.append(f"  - {c['name']} ({c['archetype']}): {c['marketShare']}% share, {c['momentum']} momentum")
    rom = game_state["restOfMarket"]
    parts.append(f"  - Rest of market: {rom['marketShare']}% ({rom.get('fragmentation', '?')} fragmentation, {rom.get('dynamism', '?')} dynamism)")

    # What happened last turn
    if last_result:
        parts.append(f"\nLast turn results:")
        parts.append(f"  {game_state.get('lastTurnSummary', '')[:600]}")

        ma = last_result.get("marketAgentOutput")
        if ma:
            if ma.get("worldEvents"):
                parts.append(f"\n  Recent world events:")
                for ev in ma["worldEvents"]:
                    parts.append(f"    [{ev.get('category', '?'):>12}] [{ev['sentiment']:>8}] {ev['headline']}")
            if ma.get("competitorMoves"):
                parts.append(f"\n  Competitor moves last turn:")
                for cm in ma["competitorMoves"]:
                    parts.append(f"    - {cm['competitorName']}: {cm['action'][:150]}")

    # Narrative arcs
    if game_state.get("narrativeArcs"):
        parts.append(f"\nActive narrative arcs (storylines shaping your company):")
        for arc in game_state["narrativeArcs"]:
            parts.append(f"  - {arc['name']}: {arc['weight']}% weight ({arc['status']})")

    # Pending consequences
    if game_state.get("pendingConsequences"):
        parts.append(f"\nPending consequences (from earlier decisions):")
        for c in game_state["pendingConsequences"]:
            parts.append(f"  - {c['description'][:150]}")

    # Decision history
    if turn_history:
        parts.append(f"\nYour decision history:")
        for h in turn_history[-5:]:  # last 5 turns max
            parts.append(f"  Turn {h['turn']}: [{h['timeAdvance']}] {h['tasks']}")
            parts.append(f"    → Cash {h['cash_change']:+,.0f} | Share {h['share_change']:+.1f}% | Sat {h['sat_change']:+.1f}% | Brand {h['brand_change']:+.1f}%")
            parts.append(f"    Reasoning: {h['reasoning'][:120]}")

    parts.append(f"\nWhat are your strategic decisions for this turn?")
    return "\n".join(parts)


# ── Main game loop ──

def run_game(config, num_turns, env):
    start_kpis = STARTING_KPIS[config["size"]][config["experience"]]

    print("=" * 70)
    print(f"AI PLAYER GAME: {config['name']} — {config['size']}/{config['experience']} — {config['difficulty']} difficulty")
    print(f"Market: {config['market']}")
    print(f"LLM Provider: {env.get('LLM_PROVIDER', 'groq')} | Model: {env.get(env.get('LLM_PROVIDER', 'groq').upper() + '_MODEL', '?')}")
    print(f"Turns: {num_turns}")
    print("=" * 70)

    # ── Initialize ──
    init = api_post("/api/initialize", {
        "difficulty": config["difficulty"],
        "market": "custom",
        "playerCompany": {
            "name": config["name"],
            "mission": config["mission"],
            "size": config["size"],
            "experience": config["experience"],
        },
    })

    print(f"\nCompetitors: {[(c['name'], c['archetype'], c['marketShare']) for c in init['competitors']]}")
    print(f"Rest of market: {init['restOfMarket']['marketShare']}% share")
    est_rev = init.get("estimatedMonthlyRevenue", 0)
    est_cost = init.get("estimatedMonthlyCosts", 0)
    print(f"Starting KPIs: Cash ${start_kpis['cash']:,} | Share {start_kpis['marketShare']}% | Sat {start_kpis['satisfaction']}% | Brand {start_kpis['brandAwareness']}%")
    print(f"Financials: Revenue ${est_rev:,}/mo | Costs ${est_cost:,}/mo | Net ${est_rev - est_cost:+,}/mo")
    print()

    game_state = {
        "difficulty": config["difficulty"],
        "market": "custom",
        "customMarket": config["market"],
        "playerCompany": {
            "name": config["name"],
            "mission": config["mission"],
            "size": config["size"],
            "experience": config["experience"],
        },
        "turn": 0,
        "currentDate": "2026-03-13",
        "kpis": dict(start_kpis),
        "companyCulture": init["companyCulture"],
        "estimatedMonthlyRevenue": est_rev,
        "estimatedMonthlyCosts": est_cost,
        "competitors": init["competitors"],
        "restOfMarket": init["restOfMarket"],
        "narrativeArcs": [],
        "pendingConsequences": [],
        "lastTurnSummary": "",
    }

    system_prompt = AI_PLAYER_SYSTEM.format(
        name=config["name"],
        size=config["size"],
        experience=config["experience"],
        market=config["market"],
        mission=config["mission"],
        difficulty=config["difficulty"],
    )

    turn_history = []
    all_results = []
    all_competitor_counts = []
    all_event_categories = []
    sign_flips = 0
    last_result = None

    for i in range(num_turns):
        # ── AI decides ──
        user_prompt = build_turn_prompt(game_state, i, turn_history, last_result)

        print("=" * 70)
        print(f"TURN {i+1}: AI is thinking...")
        print("=" * 70)

        try:
            decision = llm_decide(system_prompt, user_prompt, env)
        except Exception as e:
            print(f"  LLM ERROR: {e}")
            print("  Falling back to routine operations (no actions, month advance)")
            decision = {"reasoning": "LLM error — defaulting to routine ops", "tasks": [], "timeAdvance": "month"}

        tasks = decision.get("tasks", [])
        time_advance = decision.get("timeAdvance", "month")
        reasoning = decision.get("reasoning", "")

        # Validate timeAdvance
        if time_advance not in ("event", "week", "month", "quarter", "year"):
            time_advance = "month"

        print(f"\n  AI DECISION ({time_advance}):")
        print(f"  Reasoning: {reasoning}")
        if tasks:
            for t in tasks:
                print(f"    → {t}")
        else:
            print(f"    → [routine operations — no specific actions]")

        # ── Play the turn ──
        result = api_post("/api/turn", {
            "tasks": tasks,
            "gameState": game_state,
            "timeAdvance": time_advance,
        })

        all_results.append(result)
        last_result = result
        kd = result["kpiDeltas"]

        # ── Agent comparison ──
        pca = result.get("playerCompanyAgentOutput")
        if pca:
            proposed = pca["proposedKPIImpacts"]
            print(f"\n  PLAYER AGENT PROPOSED →  Cash: {proposed['cash']:+,}  Share: {proposed['marketShare']:+.1f}  Sat: {proposed['satisfaction']:+.1f}  Brand: {proposed['brandAwareness']:+.1f}")
        print(f"  GAMEMASTER RESOLVED  →  Cash: {kd['cash']['change']:+,.0f}  Share: {kd['marketShare']['change']:+.1f}  Sat: {kd['satisfaction']['change']:+.1f}  Brand: {kd['brandAwareness']['change']:+.1f}")

        if pca:
            proposed = pca["proposedKPIImpacts"]
            for kpi_key, p_val, r_val in [
                ("cash", proposed["cash"], kd["cash"]["change"]),
                ("marketShare", proposed["marketShare"], kd["marketShare"]["change"]),
                ("satisfaction", proposed["satisfaction"], kd["satisfaction"]["change"]),
                ("brandAwareness", proposed["brandAwareness"], kd["brandAwareness"]["change"]),
            ]:
                if p_val != 0 and ((p_val > 0 and r_val < 0) or (p_val < 0 and r_val > 0)):
                    sign_flips += 1
                    print(f"  *** SIGN FLIP on {kpi_key}: proposed {p_val:+} → resolved {r_val:+} ***")

        # ── KPI state ──
        print(f"\n  STATE AFTER TURN:")
        print(f"    Cash:            ${kd['cash']['value']:>14,.0f}  ({kd['cash']['change']:+,.0f})  {kd['cash']['reason'][:80]}")
        print(f"    Market Share:    {kd['marketShare']['value']:>14.1f}%  ({kd['marketShare']['change']:+.1f}%)  {kd['marketShare']['reason'][:80]}")
        print(f"    Satisfaction:    {kd['satisfaction']['value']:>14.1f}%  ({kd['satisfaction']['change']:+.1f}%)  {kd['satisfaction']['reason'][:80]}")
        print(f"    Brand Awareness: {kd['brandAwareness']['value']:>14.1f}%  ({kd['brandAwareness']['change']:+.1f}%)  {kd['brandAwareness']['reason'][:80]}")

        rev = result.get("estimatedMonthlyRevenue", 0)
        cost = result.get("estimatedMonthlyCosts", 0)
        print(f"    Revenue/mo:      ${rev:>14,}  Costs/mo: ${cost:,}  Net: ${rev - cost:+,}/mo")

        # ── SWOT highlights ──
        if pca:
            print(f"\n  SWOT:")
            for cat, items in [("S", pca["strengths"]), ("W", pca["weaknesses"]), ("O", pca["opportunities"]), ("T", pca["threats"])]:
                if items:
                    print(f"    {cat}: {items[0][:120]}{'...' if len(items[0]) > 120 else ''}")

        # ── Market agent ──
        ma = result.get("marketAgentOutput")
        if ma:
            active_count = len(ma["competitorMoves"])
            quiet = sum(1 for cm in ma["competitorMoves"] if any(w in cm["action"].lower() for w in ["steady", "routine", "continues", "maintains", "no major"]))
            all_competitor_counts.append(active_count - quiet)

            print(f"\n  MARKET: {len(ma['worldEvents'])} events, {active_count} competitor moves ({quiet} quiet)")
            for ev in ma["worldEvents"]:
                cat = ev.get("category", "unknown")
                all_event_categories.append(cat)
                print(f"    [{cat:>12}] [{ev['sentiment']:>8}] {ev['headline']}")
            for cm in ma["competitorMoves"]:
                print(f"    - {cm['competitorName']} ({cm['archetype']}): {cm['action'][:100]}...")

        # ── Narratives ──
        if result.get("updatedNarratives"):
            arcs_str = ", ".join(f"{a['name']} ({a['weight']}% {a['status']})" for a in result["updatedNarratives"])
            print(f"\n  ARCS: {arcs_str}")

        # ── Consequences ──
        for c in result.get("newConsequences", []):
            print(f"  + CONSEQUENCE: {c['description'][:120]}")
        for c in result.get("triggeredConsequences", []):
            print(f"  ! TRIGGERED: {c['description'][:120]}")

        # ── Bug checks ──
        if ma:
            player_name_lower = config["name"].lower().split()[0]
            self_refs = [cm for cm in ma["competitorMoves"] if player_name_lower in cm["competitorName"].lower()]
            if self_refs:
                print(f"\n  *** BUG: SELF-REFERENCE — {[s['competitorName'] for s in self_refs]} ***")

        total_share = kd["marketShare"]["value"] + sum(c["marketShare"] for c in result["updatedCompetitors"]) + result["updatedRestOfMarket"]["marketShare"]
        if abs(total_share - 100.0) > 0.5:
            print(f"\n  *** BUG: MARKET SHARE SUM = {total_share:.1f}% (expected ~100%) ***")

        print()

        # ── Track decision history ──
        turn_history.append({
            "turn": i + 1,
            "tasks": tasks,
            "timeAdvance": time_advance,
            "reasoning": reasoning,
            "cash_change": kd["cash"]["change"],
            "share_change": kd["marketShare"]["change"],
            "sat_change": kd["satisfaction"]["change"],
            "brand_change": kd["brandAwareness"]["change"],
        })

        # ── Update game state ──
        game_state["turn"] = i + 1
        game_state["currentDate"] = result["newDate"]
        game_state["kpis"] = {
            "cash": kd["cash"]["value"],
            "marketShare": kd["marketShare"]["value"],
            "satisfaction": kd["satisfaction"]["value"],
            "brandAwareness": kd["brandAwareness"]["value"],
        }
        game_state["companyCulture"] = result["companyCulture"]
        game_state["estimatedMonthlyRevenue"] = result.get("estimatedMonthlyRevenue", game_state.get("estimatedMonthlyRevenue", 0))
        game_state["estimatedMonthlyCosts"] = result.get("estimatedMonthlyCosts", game_state.get("estimatedMonthlyCosts", 0))
        game_state["competitors"] = result["updatedCompetitors"]
        game_state["restOfMarket"] = result["updatedRestOfMarket"]
        game_state["narrativeArcs"] = result.get("updatedNarratives", [])
        game_state["lastTurnSummary"] = result["turnSummary"]
        triggered_ids = {c["id"] for c in result.get("triggeredConsequences", [])}
        remaining = [c for c in game_state.get("pendingConsequences", []) if c.get("id") not in triggered_ids]
        game_state["pendingConsequences"] = remaining + result.get("newConsequences", [])

    # ══════════════════════════════════════════════════════════════════════
    # FINAL REPORT
    # ══════════════════════════════════════════════════════════════════════
    end_kpis = game_state["kpis"]

    print("\n" + "=" * 70)
    print("FINAL SUMMARY")
    print("=" * 70)

    print(f"\n  {'KPI':<20} {'Start':>14} {'End':>14} {'Change':>14}")
    print(f"  {'-'*62}")
    print(f"  {'Cash':<20} ${start_kpis['cash']:>13,.0f} ${end_kpis['cash']:>13,.0f} ${end_kpis['cash']-start_kpis['cash']:>+13,.0f}")
    print(f"  {'Market Share':<20} {start_kpis['marketShare']:>13.1f}% {end_kpis['marketShare']:>13.1f}% {end_kpis['marketShare']-start_kpis['marketShare']:>+13.1f}%")
    print(f"  {'Satisfaction':<20} {start_kpis['satisfaction']:>13.1f}% {end_kpis['satisfaction']:>13.1f}% {end_kpis['satisfaction']-start_kpis['satisfaction']:>+13.1f}%")
    print(f"  {'Brand Awareness':<20} {start_kpis['brandAwareness']:>13.1f}% {end_kpis['brandAwareness']:>13.1f}% {end_kpis['brandAwareness']-start_kpis['brandAwareness']:>+13.1f}%")

    print(f"\n  Final Competitors:")
    for c in game_state["competitors"]:
        print(f"    - {c['name']}: {c['marketShare']}% share, {c['momentum']} momentum ({c['archetype']})")
    print(f"    - Rest of market: {game_state['restOfMarket']['marketShare']}%")

    # ── AI Decision recap ──
    print("\n" + "=" * 70)
    print("AI DECISION RECAP")
    print("=" * 70)
    for h in turn_history:
        tasks_str = ", ".join(h["tasks"]) if h["tasks"] else "[routine ops]"
        print(f"\n  Turn {h['turn']} ({h['timeAdvance']}):")
        print(f"    Strategy: {h['reasoning']}")
        print(f"    Actions:  {tasks_str[:150]}")
        print(f"    Results:  Cash {h['cash_change']:+,.0f} | Share {h['share_change']:+.1f}% | Sat {h['sat_change']:+.1f}% | Brand {h['brand_change']:+.1f}%")

    # ── Dampening analysis ──
    print("\n" + "=" * 70)
    print("DAMPENING ANALYSIS — Player Agent vs Gamemaster")
    print("=" * 70)

    for i, r in enumerate(all_results):
        pca = r.get("playerCompanyAgentOutput")
        kd = r["kpiDeltas"]
        if not pca:
            continue
        p = pca["proposedKPIImpacts"]
        print(f"\n  Turn {i+1} ({turn_history[i]['timeAdvance']}):")
        for kpi_name, p_val, r_val in [
            ("Cash", p["cash"], kd["cash"]["change"]),
            ("Share", p["marketShare"], kd["marketShare"]["change"]),
            ("Satisfaction", p["satisfaction"], kd["satisfaction"]["change"]),
            ("Brand", p["brandAwareness"], kd["brandAwareness"]["change"]),
        ]:
            if p_val != 0:
                ratio = r_val / p_val
                direction = "amplified" if abs(ratio) > 1.05 else "dampened" if abs(ratio) < 0.95 else "kept"
                flipped = " SIGN FLIPPED" if (p_val > 0 and r_val < 0) or (p_val < 0 and r_val > 0) else ""
                if kpi_name == "Cash":
                    print(f"    {kpi_name:>12}: {p_val:+,.0f} → {r_val:+,.0f}  ({ratio:.2f}x) [{direction}]{flipped}")
                else:
                    print(f"    {kpi_name:>12}: {p_val:+.2f} → {r_val:+.2f}  ({ratio:.2f}x) [{direction}]{flipped}")
            else:
                if kpi_name == "Cash":
                    print(f"    {kpi_name:>12}: 0 → {r_val:+,.0f}")
                else:
                    print(f"    {kpi_name:>12}: 0 → {r_val:+.2f}")

    # ── Pattern analysis ──
    print("\n" + "=" * 70)
    print("PATTERN ANALYSIS")
    print("=" * 70)

    print(f"\n  Sign flips (GM reversed direction of Agent proposal): {sign_flips}")
    cash_pct = (end_kpis["cash"] - start_kpis["cash"]) / start_kpis["cash"] * 100
    print(f"  Cash burned: {cash_pct:+.1f}% of starting cash")
    print(f"  Cash was positive in {sum(1 for r in all_results if r['kpiDeltas']['cash']['change'] > 0)}/{len(all_results)} turns")

    time_choices = [h["timeAdvance"] for h in turn_history]
    from collections import Counter
    time_counts = Counter(time_choices)
    print(f"  Time advance choices: {dict(time_counts)}")
    action_counts = [len(h["tasks"]) for h in turn_history]
    print(f"  Actions per turn: {action_counts} (avg: {sum(action_counts)/len(action_counts):.1f})")

    if all_competitor_counts:
        print(f"\n  Active competitors per turn: {all_competitor_counts} (avg: {sum(all_competitor_counts)/len(all_competitor_counts):.1f})")

    if all_event_categories:
        cat_counts = Counter(all_event_categories)
        print(f"  World event categories: {dict(cat_counts)}")
        print(f"  Events per turn: {[len(r.get('marketAgentOutput', {}).get('worldEvents', [])) for r in all_results]}")

    print()


def main():
    parser = argparse.ArgumentParser(description="Porter AI — Adaptive AI Player Playtest")
    parser.add_argument("--preset", choices=list(PRESETS.keys()), default=None, help="Company preset")
    parser.add_argument("--difficulty", choices=["easy", "standard", "hard"], default="standard")
    parser.add_argument("--size", choices=["small", "medium", "large"], default="medium")
    parser.add_argument("--experience", choices=["new", "medium", "old"], default="medium")
    parser.add_argument("--market", type=str, default="electric vehicles")
    parser.add_argument("--name", type=str, default="TestCorp")
    parser.add_argument("--mission", type=str, default="Build the best products in our market")
    parser.add_argument("--turns", type=int, default=5, help="Number of turns")
    parser.add_argument("--provider", choices=["groq", "ollama"], default=None, help="LLM provider override")

    args = parser.parse_args()
    env = load_env()

    if args.provider:
        env["LLM_PROVIDER"] = args.provider

    if args.preset:
        config = dict(PRESETS[args.preset])
    else:
        config = {
            "difficulty": args.difficulty,
            "name": args.name,
            "mission": args.mission,
            "size": args.size,
            "experience": args.experience,
            "market": args.market,
        }

    run_game(config, args.turns, env)


if __name__ == "__main__":
    main()
