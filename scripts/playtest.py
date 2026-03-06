#!/usr/bin/env python3
"""
Porter AI — Automated Playtest Script

Plays a full game via the API and outputs detailed diagnostics including:
- Per-turn KPI tracking
- Player Agent proposed vs Gamemaster resolved (dampening analysis)
- Competitor activity frequency
- World event pattern analysis
- Narrative arc evolution
- Self-reference bug detection
- Market share sum validation

Usage:
    python3 scripts/playtest.py                          # Run default game (standard, medium/medium, EV market)
    python3 scripts/playtest.py --preset fashion         # Small/new fashion startup, easy
    python3 scripts/playtest.py --preset saas            # Large/old SaaS incumbent, hard
    python3 scripts/playtest.py --difficulty hard --size large --experience old --market "crypto exchange" --name "CoinVault"

Requires the dev server to be running: npm run dev
"""

import json
import urllib.request
import argparse
import sys

BASE_URL = "http://localhost:3000"

# ── Presets ──
PRESETS = {
    "default": {
        "difficulty": "standard",
        "name": "VoltDrive",
        "mission": "Make electric vehicles accessible and exciting for everyday drivers",
        "size": "medium",
        "experience": "medium",
        "market": "electric vehicles",
        "turns": [
            {"label": "Launch affordable product + Marketing", "tasks": ["Launch a new affordable product targeting first-time buyers", "Run a nationwide digital marketing campaign"], "timeAdvance": "month"},
            {"label": "Infrastructure expansion + Talent", "tasks": ["Partner with major retail chains for distribution at 500 locations", "Recruit 50 engineers from top universities"], "timeAdvance": "month"},
            {"label": "Autopilot — no actions (quarter)", "tasks": [], "timeAdvance": "quarter"},
            {"label": "Aggressive — price war + acquisition", "tasks": ["Initiate acquisition talks with the smallest competitor", "Cut prices by 15% across all products"], "timeAdvance": "month"},
            {"label": "Sustainability pivot + Morale boost", "tasks": ["Announce carbon-neutral manufacturing by 2028", "Launch employee satisfaction program with stock options"], "timeAdvance": "month"},
        ],
    },
    "fashion": {
        "difficulty": "easy",
        "name": "Maison Rêve",
        "mission": "Redefine luxury streetwear by merging haute couture craftsmanship with urban culture",
        "size": "small",
        "experience": "new",
        "market": "luxury streetwear fashion",
        "turns": [
            {"label": "Viral launch + Celebrity collab", "tasks": ["Launch an exclusive capsule collection with a viral TikTok campaign", "Sign a collaboration deal with a major rapper for a co-branded line"], "timeAdvance": "month"},
            {"label": "Do nothing — test inaction", "tasks": [], "timeAdvance": "month"},
            {"label": "Flagship store + Star hire + DTC", "tasks": ["Open a flagship retail store in SoHo, New York", "Hire a former luxury brand creative director", "Launch a direct-to-consumer e-commerce platform"], "timeAdvance": "quarter"},
            {"label": "Sustainability pivot", "tasks": ["Announce 100% recycled and organic materials for all future collections", "Pull out of all fast-fashion retail partnerships"], "timeAdvance": "month"},
            {"label": "Defensive — lawsuit + loyalty", "tasks": ["File a trademark lawsuit against a competitor copying designs", "Launch a loyalty program with early access to drops"], "timeAdvance": "week"},
        ],
    },
    "saas": {
        "difficulty": "hard",
        "name": "Orion Systems",
        "mission": "Provide enterprise-grade cloud infrastructure and B2B SaaS tools trusted by Fortune 500 companies",
        "size": "large",
        "experience": "old",
        "market": "enterprise cloud infrastructure and B2B SaaS",
        "turns": [
            {"label": "Do nothing — test incumbent decay", "tasks": [], "timeAdvance": "quarter"},
            {"label": "Massive investment — AI + acquisition + DevRel", "tasks": ["Invest $20M in an AI-powered automation platform", "Acquire a fast-growing edge computing startup for $15M", "Launch a $5M developer relations program"], "timeAdvance": "quarter"},
            {"label": "Layoffs + restructuring", "tasks": ["Lay off 12% of workforce to cut operating costs", "Restructure engineering into cross-functional squads"], "timeAdvance": "month"},
            {"label": "Press release only", "tasks": ["Issue a press release announcing 99.99% uptime achievement"], "timeAdvance": "week"},
            {"label": "All-in — price war + global expansion", "tasks": ["Slash pricing by 30% to undercut competitors", "Open three new data center regions globally", "Launch a $50M brand campaign targeting decision-makers"], "timeAdvance": "quarter"},
        ],
    },
}

# ── Starting KPIs (must match game.ts SIZE_EXPERIENCE_KPIS) ──
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


def run_game(config, turns):
    start_kpis = STARTING_KPIS[config["size"]][config["experience"]]

    # ── Initialize ──
    print("=" * 70)
    print(f"GAME: {config['name']} — {config['size']}/{config['experience']} — {config['difficulty']} difficulty")
    print(f"Market: {config['market']}")
    print("=" * 70)

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
    print(f"Starting KPIs: Cash ${start_kpis['cash']:,} | Share {start_kpis['marketShare']}% | Sat {start_kpis['satisfaction']}% | Brand {start_kpis['brandAwareness']}%")
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
        "currentDate": "2026-03-06",
        "kpis": dict(start_kpis),
        "companyCulture": init["companyCulture"],
        "competitors": init["competitors"],
        "restOfMarket": init["restOfMarket"],
        "narrativeArcs": [],
        "pendingConsequences": [],
        "lastTurnSummary": "",
    }

    all_results = []
    all_competitor_counts = []
    all_event_categories = []
    sign_flips = 0

    for i, turn in enumerate(turns):
        print("=" * 70)
        print(f"TURN {i+1}: {turn['label']}")
        print("=" * 70)

        result = api_post("/api/turn", {
            "tasks": turn["tasks"],
            "gameState": game_state,
            "timeAdvance": turn["timeAdvance"],
        })

        all_results.append(result)
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
        print(f"\n  Turn {i+1} ({turns[i]['timeAdvance']}):")
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

    if all_competitor_counts:
        print(f"\n  Active competitors per turn: {all_competitor_counts} (avg: {sum(all_competitor_counts)/len(all_competitor_counts):.1f})")

    if all_event_categories:
        from collections import Counter
        cat_counts = Counter(all_event_categories)
        print(f"  World event categories: {dict(cat_counts)}")
        print(f"  Events per turn: {[len(r.get('marketAgentOutput', {}).get('worldEvents', [])) for r in all_results]}")

    print()


def main():
    parser = argparse.ArgumentParser(description="Porter AI Playtest Script")
    parser.add_argument("--preset", choices=list(PRESETS.keys()), default=None, help="Use a preset game configuration")
    parser.add_argument("--difficulty", choices=["easy", "standard", "hard"], default="standard")
    parser.add_argument("--size", choices=["small", "medium", "large"], default="medium")
    parser.add_argument("--experience", choices=["new", "medium", "old"], default="medium")
    parser.add_argument("--market", type=str, default="electric vehicles")
    parser.add_argument("--name", type=str, default="TestCorp")
    parser.add_argument("--mission", type=str, default="Build the best products in our market")
    parser.add_argument("--turns", type=int, default=5, help="Number of turns to play (uses default actions)")

    args = parser.parse_args()

    if args.preset:
        p = PRESETS[args.preset]
        config = {
            "difficulty": p["difficulty"],
            "name": p["name"],
            "mission": p["mission"],
            "size": p["size"],
            "experience": p["experience"],
            "market": p["market"],
        }
        turns = p["turns"]
    else:
        config = {
            "difficulty": args.difficulty,
            "name": args.name,
            "mission": args.mission,
            "size": args.size,
            "experience": args.experience,
            "market": args.market,
        }
        # Generate default turns if no preset
        default_actions = [
            {"label": "Launch new product + marketing", "tasks": ["Launch a new flagship product", "Run a major marketing campaign"], "timeAdvance": "month"},
            {"label": "Expand operations + hire talent", "tasks": ["Expand distribution to new regions", "Hire senior talent from competitors"], "timeAdvance": "month"},
            {"label": "Do nothing — inaction test", "tasks": [], "timeAdvance": "month"},
            {"label": "Price cut + partnership", "tasks": ["Cut prices by 20% to gain market share", "Form a strategic partnership with an industry leader"], "timeAdvance": "quarter"},
            {"label": "Brand investment + employee morale", "tasks": ["Launch a major brand refresh campaign", "Introduce employee stock options and flexible work"], "timeAdvance": "month"},
        ]
        turns = default_actions[:args.turns]

    run_game(config, turns)


if __name__ == "__main__":
    main()
