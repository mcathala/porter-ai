// =============================================================================
// GAME STATE TYPES
// =============================================================================

export type Difficulty = "easy" | "standard" | "hard";
export type Market = "saas" | "automotive" | "random" | "custom";
export type CompanyArchetype = "innovator" | "incumbent" | "costleader" | "premium" | "platform";
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
  archetype: CompanyArchetype;
}

export interface CompanyConfig {
  archetype: CompanyArchetype;
  name: string;
  description: string;
  startingCash: number;
  startingMarketShare: number;
  startingSatisfaction: number;
}

// All company archetypes with their configurations
export const COMPANY_CONFIGS: Record<CompanyArchetype, CompanyConfig> = {
  innovator: {
    archetype: "innovator",
    name: "Disruptive Innovator",
    description: "A scrappy startup with breakthrough tech. High innovation potential but extreme financial risk.",
    startingCash: 750000,
    startingMarketShare: 1,
    startingSatisfaction: 85,
  },
  incumbent: {
    archetype: "incumbent",
    name: "Global Incumbent",
    description: "An industry titan with massive resources. Immense market power but bureaucratic inertia.",
    startingCash: 100000000,
    startingMarketShare: 40,
    startingSatisfaction: 75,
  },
  costleader: {
    archetype: "costleader",
    name: "Cost Leader",
    description: "Highly efficient operator with razor-thin margins. Scale economies but vulnerable to price wars.",
    startingCash: 15000000,
    startingMarketShare: 25,
    startingSatisfaction: 70,
  },
  premium: {
    archetype: "premium",
    name: "Premium Niche",
    description: "Luxury brand with loyal customers. Superior margins but limited scalability.",
    startingCash: 5000000,
    startingMarketShare: 5,
    startingSatisfaction: 95,
  },
  platform: {
    archetype: "platform",
    name: "Data Platform",
    description: "Ecosystem builder leveraging data. Exponential growth potential but high churn risk.",
    startingCash: 10000000,
    startingMarketShare: 8,
    startingSatisfaction: 80,
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

  // Token usage for this turn
  tokenUsage?: TokenUsage;
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
