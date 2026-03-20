import { z } from "zod";

// =============================================================================
// SHARED / REUSABLE SCHEMAS
// =============================================================================

export const KPIDeltaSchema = z.object({
  value: z.number().describe("New total value after this turn"),
  change: z.number().describe("The delta/change from previous value"),
  changePercent: z.number().describe("The percentage change"),
  reason: z.string().describe("Explanation for why this KPI changed"),
});

export const NewsItemSchema = z.object({
  id: z.string().describe("Unique identifier for the news item"),
  headline: z.string().describe("News headline (short, attention-grabbing)"),
  summary: z.string().describe("Brief summary of the news (1-2 sentences)"),
  category: z
    .enum(["industry", "competitor", "internal", "market", "regulatory"])
    .catch("market")
    .describe("Category of the news item"),
  sentiment: z
    .enum(["positive", "negative", "neutral"])
    .catch("neutral")
    .describe("Overall sentiment of the news"),
  relevance: z
    .enum(["high", "medium", "low"])
    .catch("medium")
    .describe("Relevance to the player's company"),
});

export const CompetitorSchema = z.object({
  name: z.string().describe("Name of the competitor company"),
  archetype: z
    .enum(["dominant", "follower", "disruptor", "opportunist"])
    .catch("follower")
    .describe("The competitor's behavioral archetype"),
  marketShare: z.number().describe("Competitor's current market share percentage"),
  momentum: z
    .enum(["positive", "neutral", "negative"])
    .catch("neutral")
    .describe("Competitor's current momentum direction"),
});

export const CompetitorMoveSchema = z.object({
  competitorName: z.string().describe("Name of the competitor company"),
  archetype: z
    .enum(["dominant", "follower", "disruptor", "opportunist"])
    .catch("follower")
    .describe("The competitor's behavioral archetype"),
  action: z.string().describe("What action the competitor took this turn"),
  impact: z.string().describe("How this action affects the market or the player"),
});

export const RestOfMarketSchema = z.object({
  marketShare: z.number().describe("Residual market share held by unnamed companies"),
  fragmentation: z
    .enum(["high", "medium", "consolidated"])
    .catch("medium")
    .describe("How fragmented the rest of the market is"),
  dynamism: z
    .enum(["active", "stable", "stagnant"])
    .catch("stable")
    .describe("How dynamic the rest of the market is"),
  latentPressure: z
    .enum(["low", "moderate", "high"])
    .catch("moderate")
    .describe("Pressure from unnamed market participants to emerge as named actors"),
});

export const NarrativeArcSchema = z.object({
  id: z.string().describe("Unique identifier for this narrative arc"),
  name: z.string().describe("Descriptive name of the narrative arc (e.g., 'Price war with MegaCorp')"),
  weight: z.number().describe("Weight percentage (0-100). All arcs must sum to 100"),
  createdAtTurn: z.number().describe("Turn number when this arc was created"),
  lastAmplifiedAtTurn: z.number().describe("Turn number when this arc was last amplified"),
  status: z
    .enum(["latent", "active", "dominant"])
    .catch("active")
    .describe("Current status derived from weight: latent (<10%), active (10-25%), dominant (>25%)"),
});

export const PendingConsequenceSchema = z.object({
  id: z.string().describe("Unique identifier for this consequence"),
  description: z.string().describe("What will happen when this triggers"),
  cause: z.string().describe("What player action caused this consequence"),
  createdAtTurn: z.number().describe("The turn number when this was created"),
  effect: z.string().describe("The impact when this consequence triggers"),
});

// =============================================================================
// PLAYER COMPANY AGENT SCHEMA
// =============================================================================

export const PlayerCompanyAgentSchema = z.object({
  strengths: z
    .array(z.string())
    .describe("Internal strengths of the player's action — execution capability, culture fit, resource alignment"),
  weaknesses: z
    .array(z.string())
    .describe("Internal weaknesses/risks — cash strain, team overstretch, culture misalignment, execution complexity"),
  opportunities: z
    .array(z.string())
    .describe("External opportunities the action unlocks — market positioning, competitive advantage, new segments, timing"),
  threats: z
    .array(z.string())
    .describe("External risks the action exposes us to — competitive response, regulatory, market timing, over-commitment"),
  proposedKPIImpacts: z.object({
    cash: z.number().describe("Proposed change in cash in FULL dollars (e.g. -4000000 not -4). Must match the scale of the company's current cash balance."),
    marketShare: z.number().describe("Proposed change in market share (positive or negative percentage points)"),
    satisfaction: z.number().describe("Proposed change in team morale (positive or negative percentage points)"),
    brandAwareness: z.number().describe("Proposed change in brand awareness (positive or negative percentage points)"),
  }).describe("Proposed KPI impacts based on SWOT analysis"),
  sideEffects: z
    .array(z.string())
    .describe("Side effects or consequences of the action (internal and external)"),
});

export type PlayerCompanyAgentOutput = z.infer<typeof PlayerCompanyAgentSchema>;

// =============================================================================
// MARKET AGENT SCHEMA
// =============================================================================

export const WorldEventSchema = z.object({
  headline: z.string().describe("Short headline for the event"),
  description: z.string().describe("1-2 sentence description of the event and its market impact"),
  category: z
    .enum(["consumer_trend", "macro", "technology", "supply_chain", "competitive", "talent", "regulatory"])
    .catch("competitive")
    .describe("Category of the world event"),
  sentiment: z
    .enum(["positive", "negative", "neutral"])
    .catch("neutral")
    .describe("Overall sentiment/impact on the market"),
});

export const MarketAgentSchema = z.object({
  competitorMoves: z
    .array(CompetitorMoveSchema)
    .describe("What each named competitor is doing this turn, driven by their own strategy"),
  worldEvents: z
    .array(WorldEventSchema)
    .describe("Industry/market/macro events happening this turn, independent of any single company"),
  restOfMarketAssessment: z
    .string()
    .describe("Qualitative assessment of rest of market dynamics and shifts"),
});

export type MarketAgentOutput = z.infer<typeof MarketAgentSchema>;

// =============================================================================
// GAMEMASTER OUTPUT SCHEMA
// =============================================================================

export const GamemasterOutputSchema = z.object({
  kpiDeltas: z.object({
    cash: KPIDeltaSchema.describe("Cash balance change details"),
    marketShare: KPIDeltaSchema.describe("Market share change details"),
    satisfaction: KPIDeltaSchema.describe("Team morale change details"),
    brandAwareness: KPIDeltaSchema.describe("Brand awareness change details"),
  }).describe("Final resolved KPI deltas"),
  updatedCompetitors: z
    .array(CompetitorSchema)
    .default([])
    .describe("Full updated list of named competitors (3-5 actors). Can add new or remove existing."),
  updatedRestOfMarket: RestOfMarketSchema
    .default({ marketShare: 0, fragmentation: "medium", dynamism: "stable", latentPressure: "low" })
    .describe("Updated rest of market state"),
  updatedNarratives: z
    .array(NarrativeArcSchema)
    .default([])
    .describe("Updated narrative arc pool. Weights must sum to 100. Can create new, amplify, decay, or retire arcs."),
  newConsequences: z
    .array(PendingConsequenceSchema)
    .default([])
    .describe("New delayed consequences created by this turn"),
  triggeredConsequences: z
    .array(PendingConsequenceSchema)
    .default([])
    .describe("Previously pending consequences that triggered this turn"),
  newDate: z
    .string()
    .default("")
    .describe("The new date after time advancement (YYYY-MM-DD format)"),
  turnSummary: z
    .string()
    .default("")
    .describe("A 2-3 paragraph narrative summary of the turn, flavored by dominant narrative arcs"),
  newsItems: z
    .array(NewsItemSchema)
    .default([])
    .describe("News headlines and summaries for this turn, scaled by time advance"),
  nextTurnContext: z
    .string()
    .default("")
    .describe("Brief context summary for the next turn and for the Advisor"),
  companyCulture: z
    .string()
    .default("")
    .describe("Updated 1-2 sentence company culture description reflecting cumulative player decisions"),
  estimatedMonthlyRevenue: z
    .number()
    .default(0)
    .describe("Updated estimated monthly revenue in full dollars. Should increase with market share gains, successful product launches, price increases. Decrease with market share loss, price cuts."),
  estimatedMonthlyCosts: z
    .number()
    .default(0)
    .describe("Updated estimated monthly operating costs in full dollars. Should increase with hiring, expansion, new infrastructure. Decrease with layoffs, cost-cutting."),
  inboundContactMessages: z
    .array(z.object({
      contactId: z.string().describe("ID of the contact sending the message"),
      message: z.string().describe("Short message from the contact (1-2 sentences max)"),
    }))
    .default([])
    .describe("0-2 proactive messages from existing contacts reacting to this turn. Only generate if the contact has a genuine reason to reach out."),
  newTransientContacts: z
    .array(z.object({
      id: z.string().describe("Unique ID like 'transient-supplier-1'"),
      name: z.string().describe("Full name of the transient contact"),
      position: z.string().describe("Their role or title"),
      company: z.string().optional().describe("Their company if external"),
      personality: z.string().describe("One sentence personality description"),
      introMessage: z.string().describe("Their opening message to the CEO — 1-2 sentences"),
      expiresAfterTurn: z.number().describe("Turn number after which this contact disappears if ignored"),
      isPlayerInitiated: z.boolean().default(false).describe("Set true if the player's action explicitly involved contacting this person (e.g. 'contact the supplier'). Player-initiated contacts are mandatory — always generate them."),
    }))
    .default([])
    .describe("New transient contacts appearing this turn. MANDATORY when the player's action explicitly contacted an external party. Otherwise optional, aim for 1 every 2-3 turns max."),
});

export type GamemasterOutput = z.infer<typeof GamemasterOutputSchema>;

// =============================================================================
// TURN 0 INITIALIZATION SCHEMA
// =============================================================================

export const Turn0ContactSchema = z.object({
  id: z.string().describe("Unique ID like 'contact-cfo' or 'contact-cto'"),
  name: z.string().describe("Full name of the contact (first + last)"),
  position: z.string().describe("Role title e.g. 'CFO', 'CTO', 'Head of Sales', 'Investor Lead'"),
  personality: z.string().describe("One sentence personality description e.g. 'Methodical and data-driven, gets cold when ignored'"),
  introMessage: z.string().describe("Their first message to the CEO — 1-2 sentences, conversational, in character"),
});

export const Turn0ResultSchema = z.object({
  competitors: z
    .array(CompetitorSchema)
    .describe("3-4 initial named competitors with archetypes that create tension with the player's company"),
  restOfMarket: RestOfMarketSchema
    .describe("Initial rest of market state"),
  marketSummary: z
    .string()
    .describe("A brief market introduction narrative for the player to read before starting"),
  companyCulture: z
    .string()
    .describe("Initial 1-2 sentence company culture description derived from the player's mission and company characteristics"),
  estimatedMonthlyRevenue: z
    .number()
    .default(0)
    .describe("Estimated monthly revenue in full dollars, based on market share and company size"),
  estimatedMonthlyCosts: z
    .number()
    .default(0)
    .describe("Estimated monthly operating costs in full dollars"),
  contacts: z
    .array(Turn0ContactSchema)
    .default([])
    .describe("Initial stakeholder contacts for the player"),
});

export type Turn0Result = z.infer<typeof Turn0ResultSchema>;
