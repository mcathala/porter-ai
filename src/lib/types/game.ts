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
    new:    { cash: 500_000,   marketShare: 2,  satisfaction: 90 },
    medium: { cash: 2_000_000, marketShare: 5,  satisfaction: 85 },
    old:    { cash: 5_000_000, marketShare: 8,  satisfaction: 75 },
  },
  medium: {
    new:    { cash: 5_000_000,  marketShare: 8,  satisfaction: 85 },
    medium: { cash: 15_000_000, marketShare: 18, satisfaction: 75 },
    old:    { cash: 30_000_000, marketShare: 25, satisfaction: 65 },
  },
  large: {
    new:    { cash: 25_000_000,  marketShare: 15, satisfaction: 80 },
    medium: { cash: 75_000_000,  marketShare: 30, satisfaction: 70 },
    old:    { cash: 150_000_000, marketShare: 45, satisfaction: 60 },
  },
};

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
    proposedKPIImpacts: { cash: number; marketShare: number; satisfaction: number };
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
