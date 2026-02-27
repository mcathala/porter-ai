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
    .describe("Category of the news item"),
  sentiment: z
    .enum(["positive", "negative", "neutral"])
    .describe("Overall sentiment of the news"),
  relevance: z
    .enum(["high", "medium", "low"])
    .describe("Relevance to the player's company"),
});

export const CompetitorSchema = z.object({
  name: z.string().describe("Name of the competitor company"),
  archetype: z
    .enum(["dominant", "follower", "disruptor", "opportunist"])
    .describe("The competitor's behavioral archetype"),
  marketShare: z.number().describe("Competitor's current market share percentage"),
  momentum: z
    .enum(["positive", "neutral", "negative"])
    .describe("Competitor's current momentum direction"),
});

export const CompetitorMoveSchema = z.object({
  competitorName: z.string().describe("Name of the competitor company"),
  archetype: z
    .enum(["dominant", "follower", "disruptor", "opportunist"])
    .describe("The competitor's behavioral archetype"),
  action: z.string().describe("What action the competitor took this turn"),
  impact: z.string().describe("How this action affects the market or the player"),
});

export const RestOfMarketSchema = z.object({
  marketShare: z.number().describe("Residual market share held by unnamed companies"),
  fragmentation: z
    .enum(["high", "medium", "consolidated"])
    .describe("How fragmented the rest of the market is"),
  dynamism: z
    .enum(["active", "stable", "stagnant"])
    .describe("How dynamic the rest of the market is"),
  latentPressure: z
    .enum(["low", "moderate", "high"])
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
// INTERNAL AGENT SCHEMA
// =============================================================================

export const InternalAgentSchema = z.object({
  strengths: z
    .array(z.string())
    .describe("Strengths of the player's action from an internal company perspective"),
  weaknesses: z
    .array(z.string())
    .describe("Weaknesses/risks of the player's action from an internal company perspective"),
  proposedKPIImpacts: z.object({
    cash: z.number().describe("Proposed change in cash (positive or negative dollar amount)"),
    marketShare: z.number().describe("Proposed change in market share (positive or negative percentage points)"),
    satisfaction: z.number().describe("Proposed change in customer satisfaction (positive or negative percentage points)"),
  }).describe("Proposed internal KPI impacts with reasoning"),
  internalSideEffects: z
    .array(z.string())
    .describe("Internal side effects or consequences of the action"),
});

export type InternalAgentOutput = z.infer<typeof InternalAgentSchema>;

// =============================================================================
// EXTERNAL AGENT SCHEMA
// =============================================================================

export const ExternalAgentSchema = z.object({
  opportunities: z
    .array(z.string())
    .describe("Opportunities that the player's action creates or exploits in the market"),
  threats: z
    .array(z.string())
    .describe("Threats that the player's action triggers from the external environment"),
  competitorReactions: z
    .array(CompetitorMoveSchema)
    .describe("Each named competitor's likely behavioral response (qualitative, not numerical)"),
  restOfMarketAssessment: z
    .string()
    .describe("Qualitative assessment of how the rest of the market reacts"),
});

export type ExternalAgentOutput = z.infer<typeof ExternalAgentSchema>;

// =============================================================================
// GAMEMASTER OUTPUT SCHEMA
// =============================================================================

export const GamemasterOutputSchema = z.object({
  kpiDeltas: z.object({
    cash: KPIDeltaSchema.describe("Cash balance change details"),
    marketShare: KPIDeltaSchema.describe("Market share change details"),
    satisfaction: KPIDeltaSchema.describe("Customer satisfaction change details"),
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
});

export type GamemasterOutput = z.infer<typeof GamemasterOutputSchema>;

// =============================================================================
// TURN 0 INITIALIZATION SCHEMA
// =============================================================================

export const Turn0ResultSchema = z.object({
  competitors: z
    .array(CompetitorSchema)
    .describe("3-4 initial named competitors with archetypes that create tension with the player's choice"),
  restOfMarket: RestOfMarketSchema
    .describe("Initial rest of market state"),
  marketSummary: z
    .string()
    .describe("A brief market introduction narrative for the player to read before starting"),
});

export type Turn0Result = z.infer<typeof Turn0ResultSchema>;
