// =============================================================================
// GAME STATE TYPES
// =============================================================================

export type Difficulty = "easy" | "standard" | "hard";
export type Market = "fashion" | "automotive" | "custom";
export type CompanySize = "small" | "medium" | "large";
export type CompanyExperience = "new" | "medium" | "old";
export type CompetitorArchetype = "dominant" | "follower" | "disruptor" | "opportunist";
export type TimeAdvance = "event" | "week" | "month" | "quarter" | "year";

export interface KPIs {
  cash: number;           // In dollars
  marketShare: number;    // Percentage (0-100)
  satisfaction: number;   // Percentage (0-100)
  brandAwareness: number; // Percentage (0-100) — how much customers like/know your product
}

export interface KPIDelta {
  value: number;
  change: number;
  changePercent: number;
  reason: string;
}

export interface PlayerCompany {
  name: string;
  mission: string;
  size: CompanySize;
  experience: CompanyExperience;
}

// Size x Experience → Starting KPIs matrix
export const SIZE_EXPERIENCE_KPIS: Record<CompanySize, Record<CompanyExperience, KPIs>> = {
  small: {
    new:    { cash: 500_000,   marketShare: 2,  satisfaction: 90, brandAwareness: 10 },
    medium: { cash: 2_000_000, marketShare: 5,  satisfaction: 85, brandAwareness: 25 },
    old:    { cash: 5_000_000, marketShare: 8,  satisfaction: 75, brandAwareness: 40 },
  },
  medium: {
    new:    { cash: 5_000_000,  marketShare: 8,  satisfaction: 85, brandAwareness: 30 },
    medium: { cash: 15_000_000, marketShare: 18, satisfaction: 75, brandAwareness: 50 },
    old:    { cash: 30_000_000, marketShare: 25, satisfaction: 65, brandAwareness: 65 },
  },
  large: {
    new:    { cash: 25_000_000,  marketShare: 15, satisfaction: 80, brandAwareness: 45 },
    medium: { cash: 75_000_000,  marketShare: 30, satisfaction: 70, brandAwareness: 70 },
    old:    { cash: 150_000_000, marketShare: 45, satisfaction: 60, brandAwareness: 85 },
  },
};

// Baseline monthly revenue per 1% of market share, by company size.
// e.g. a medium company with 18% share → 18 * 200_000 = $3.6M/month revenue
export const REVENUE_PER_SHARE_POINT: Record<CompanySize, number> = {
  small: 30_000,     // small market: $30k per share point/month
  medium: 200_000,   // medium market: $200k per share point/month
  large: 1_000_000,  // large market: $1M per share point/month
};

// Operating cost as percentage of revenue (baseline — before player actions)
export const OPERATING_COST_RATIO: Record<CompanyExperience, number> = {
  new: 0.95,    // new companies barely break even
  medium: 0.85, // established companies have 15% margin
  old: 0.75,    // mature companies have 25% margin
};

export function computeInitialFinancials(size: CompanySize, experience: CompanyExperience, marketShare: number) {
  const revenue = marketShare * REVENUE_PER_SHARE_POINT[size];
  const costs = revenue * OPERATING_COST_RATIO[experience];
  return {
    estimatedMonthlyRevenue: Math.round(revenue),
    estimatedMonthlyCosts: Math.round(costs),
  };
}

// =============================================================================
// COMPETITOR TYPES
// =============================================================================

export interface Competitor {
  name: string;
  archetype: CompetitorArchetype;
  marketShare: number;
  momentum: "positive" | "neutral" | "negative";
}

export interface CompetitorMove {
  competitorName: string;
  archetype: CompetitorArchetype;
  action: string;
  impact: string;
}

// =============================================================================
// REST OF MARKET
// =============================================================================

export interface RestOfMarket {
  marketShare: number;
  fragmentation: "high" | "medium" | "consolidated";
  dynamism: "active" | "stable" | "stagnant";
  latentPressure: "low" | "moderate" | "high";
}

// =============================================================================
// NARRATIVE ARC SYSTEM
// =============================================================================

export interface NarrativeArc {
  id: string;
  name: string;
  weight: number; // 0-100, all arcs sum to 100
  createdAtTurn: number;
  lastAmplifiedAtTurn: number;
  status: "latent" | "active" | "dominant";
}

// =============================================================================
// PENDING CONSEQUENCES
// =============================================================================

export interface PendingConsequence {
  id: string;
  description: string;
  cause: string;
  createdAtTurn: number;
  effect: string;
  kpiImpact?: Partial<KPIs>;
}

// =============================================================================
// TOKEN USAGE TRACKING
// =============================================================================

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

// =============================================================================
// GAME STATE
// =============================================================================

export interface GameState {
  // Configuration
  difficulty: Difficulty;
  market: Market;
  customMarket?: string;
  playerCompany: PlayerCompany;

  // Current state
  turn: number;
  currentDate: string; // ISO date string
  kpis: KPIs;

  // Evolving company culture description (invisible to player)
  companyCulture: string;

  // Competitors (3-5 dynamic named actors)
  competitors: Competitor[];
  restOfMarket: RestOfMarket;

  // Narrative
  narrativeArcs: NarrativeArc[];

  // Financial estimates (evolve each turn based on player actions)
  estimatedMonthlyRevenue: number; // Baseline monthly revenue in dollars
  estimatedMonthlyCosts: number;   // Baseline monthly operating costs in dollars

  // History (for now, just last turn)
  lastTurnSummary?: string;

  // Pending consequences from previous actions
  pendingConsequences: PendingConsequence[];
}

// =============================================================================
// TURN INPUT/OUTPUT TYPES
// =============================================================================

export interface TurnInput {
  // What the player did this turn
  tasks: string[];

  // Current game state
  gameState: GameState;

  // How far to advance
  timeAdvance: TimeAdvance;
}

export interface TurnResult {
  // Updated KPIs with explanations
  kpiDeltas: {
    cash: KPIDelta;
    marketShare: KPIDelta;
    satisfaction: KPIDelta;
    brandAwareness: KPIDelta;
  };

  // Narrative
  turnSummary: string;
  newsItems: NewsItem[];

  // Competitors
  competitorMoves: CompetitorMove[];
  updatedCompetitors: Competitor[];
  updatedRestOfMarket: RestOfMarket;

  // Narratives
  updatedNarratives: NarrativeArc[];

  // Consequences
  newConsequences: PendingConsequence[];
  triggeredConsequences: PendingConsequence[];

  // Updated date
  newDate: string;

  // For next turn context
  nextTurnContext: string;

  // Updated company culture description
  companyCulture: string;

  // Updated financial estimates
  estimatedMonthlyRevenue: number;
  estimatedMonthlyCosts: number;

  // Token usage for this turn
  tokenUsage?: TokenUsage;

  // Debug / dev-only: LLM info
  llmInfo?: {
    provider: string;
    model: string;
  };

  // Debug / dev-only: intermediate agent outputs
  playerCompanyAgentOutput?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    proposedKPIImpacts: { cash: number; marketShare: number; satisfaction: number; brandAwareness: number };
    sideEffects: string[];
  };
  marketAgentOutput?: {
    competitorMoves: CompetitorMove[];
    worldEvents: { headline: string; description: string; category: string; sentiment: string }[];
    restOfMarketAssessment: string;
  };
}

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  category: "industry" | "competitor" | "internal" | "market" | "regulatory";
  sentiment: "positive" | "negative" | "neutral";
  relevance: "high" | "medium" | "low";
}

// =============================================================================
// TURN 0 INITIALIZATION
// =============================================================================

export interface Turn0Result {
  competitors: Competitor[];
  restOfMarket: RestOfMarket;
  marketSummary: string;
  companyCulture: string;
  estimatedMonthlyRevenue: number;
  estimatedMonthlyCosts: number;
  tokenUsage?: TokenUsage;
}

// =============================================================================
// AGENT OUTPUT TYPES (Internal - for LangGraph)
// =============================================================================

export interface InternalAgentOutput {
  strengths: string[];
  weaknesses: string[];
  proposedKPIImpacts: Partial<KPIs>;
  internalSideEffects: string[];
}

export interface ExternalAgentOutput {
  opportunities: string[];
  threats: string[];
  competitorReactions: CompetitorMove[];
  restOfMarketAssessment: string;
}

export interface GamemasterOutput {
  kpiDeltas: TurnResult["kpiDeltas"];
  updatedCompetitors: Competitor[];
  updatedRestOfMarket: RestOfMarket;
  updatedNarratives: NarrativeArc[];
  newConsequences: PendingConsequence[];
  triggeredConsequences: PendingConsequence[];
  newDate: string;
  turnSummary: string;
  newsItems: NewsItem[];
  nextTurnContext: string;
  companyCulture: string;
  estimatedMonthlyRevenue: number;
  estimatedMonthlyCosts: number;
}

// =============================================================================
// GRAPH STATE (LangGraph)
// =============================================================================

export interface AgentGraphState {
  // Input
  turnInput: TurnInput;

  // Layer 1 outputs
  internalOutput?: InternalAgentOutput;
  externalOutput?: ExternalAgentOutput;

  // Layer 2 output
  gamemasterOutput?: GamemasterOutput;

  // Final result
  turnResult?: TurnResult;
}
