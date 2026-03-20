"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  GameState,
  TurnInput,
  TurnResult,
  Turn0Result,
  TimeAdvance,
  CompanySize,
  CompanyExperience,
  Competitor,
  Difficulty,
  Market,
  TokenUsage,
  Contact,
  ContactMessage,
  SIZE_EXPERIENCE_KPIS,
  RestOfMarket,
} from "@/lib/types/game";

// Store turn history for the feed
export interface TurnHistoryEntry {
  turn: number;
  date: string;
  result: TurnResult;
  playerActions: string[];
}

// Snapshot of turn 0 briefing data (persisted across turns)
export interface InitialBriefing {
  marketSummary: string;
  competitors: Competitor[];
  restOfMarket: RestOfMarket;
}

// Advisor (Michael) conversation
export interface AdvisorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface GameContextType {
  // Game state
  gameState: GameState;
  isProcessingTurn: boolean;
  isInitializing: boolean;
  currentTurnResult: TurnResult | null;
  currentTurnActions: string[];
  showTurnSummary: boolean;

  // Turn 0 briefing snapshot
  initialBriefing: InitialBriefing | null;

  // Turn history for the feed
  turnHistory: TurnHistoryEntry[];

  // Actions taken this turn
  actions: string[];
  addAction: (action: string) => void;
  removeAction: (index: number) => void;
  clearActions: () => void;

  // Turn processing
  processTurn: (timeAdvance: TimeAdvance) => Promise<void>;
  closeTurnSummary: () => void;

  // Game initialization
  initializeGame: (
    difficulty: Difficulty,
    market: Market,
    customMarket: string | undefined,
    size: CompanySize,
    experience: CompanyExperience,
    companyName: string,
    companyMission: string
  ) => Promise<void>;

  // Advisor (Michael)
  advisorMessages: AdvisorMessage[];
  isAdvisorOpen: boolean;
  isAdvisorTyping: boolean;
  openAdvisor: () => void;
  closeAdvisor: () => void;
  sendAdvisorMessage: (content: string) => Promise<void>;
  clearAdvisorHistory: () => void;

  // Contacts (Stakeholders)
  contacts: Contact[];
  activeContactId: string | null;
  setActiveContactId: (id: string | null) => void;
  sendContactMessage: (contactId: string, message: string) => Promise<void>;
  markContactRead: (contactId: string) => void;

  // Token usage tracking
  totalTokenUsage: TokenUsage;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Default rest of market placeholder
const DEFAULT_REST_OF_MARKET: RestOfMarket = {
  marketShare: 0,
  fragmentation: "medium",
  dynamism: "stable",
  latentPressure: "low",
};

export function GameProvider({ children }: { children: ReactNode }) {
  // Initialize with default game state
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState("standard", "fashion", undefined, "medium", "medium", "My Company", "To be the best")
  );

  const [isProcessingTurn, setIsProcessingTurn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [currentTurnResult, setCurrentTurnResult] = useState<TurnResult | null>(
    null
  );
  const [currentTurnActions, setCurrentTurnActions] = useState<string[]>([]);
  const [showTurnSummary, setShowTurnSummary] = useState(false);
  const [actions, setActions] = useState<string[]>([]);
  const [turnHistory, setTurnHistory] = useState<TurnHistoryEntry[]>([]);

  // Turn 0 briefing snapshot
  const [initialBriefing, setInitialBriefing] = useState<InitialBriefing | null>(null);

  // Token usage tracking
  const [totalTokenUsage, setTotalTokenUsage] = useState<TokenUsage>({
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
  });

  const addTokenUsage = useCallback((usage: TokenUsage) => {
    setTotalTokenUsage((prev) => ({
      inputTokens: prev.inputTokens + usage.inputTokens,
      outputTokens: prev.outputTokens + usage.outputTokens,
      totalTokens: prev.totalTokens + usage.totalTokens,
    }));
  }, []);

  // Advisor (Michael) state
  const [advisorMessages, setAdvisorMessages] = useState<AdvisorMessage[]>([]);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isAdvisorTyping, setIsAdvisorTyping] = useState(false);

  // Contacts (Stakeholders) state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [lastTransientContactTurn, setLastTransientContactTurn] = useState<number>(-3);

  // Add an action to the current turn
  const addAction = useCallback((action: string) => {
    setActions((prev) => [...prev, action]);
  }, []);

  // Remove a single action by index
  const removeAction = useCallback((index: number) => {
    setActions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Clear all actions
  const clearActions = useCallback(() => {
    setActions([]);
  }, []);

  // Initialize a new game (async — calls server-side Turn 0)
  const initializeGame = useCallback(
    async (
      difficulty: Difficulty,
      market: Market,
      customMarket: string | undefined,
      size: CompanySize,
      experience: CompanyExperience,
      companyName: string,
      companyMission: string
    ) => {
      setIsInitializing(true);

      try {
        // Create initial game state with placeholder competitors
        const initialState = createInitialGameState(
          difficulty,
          market,
          customMarket,
          size,
          experience,
          companyName,
          companyMission
        );

        // Call server-side Turn 0 initialization
        const response = await fetch("/api/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            difficulty,
            market: customMarket || market,
            playerCompany: initialState.playerCompany,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || errorData.error || "Initialization failed");
        }

        const turn0Result: Turn0Result = await response.json();

        // Update state with server-generated competitors and market data
        setGameState({
          ...initialState,
          competitors: turn0Result.competitors,
          restOfMarket: turn0Result.restOfMarket,
          lastTurnSummary: turn0Result.marketSummary,
          companyCulture: turn0Result.companyCulture,
          estimatedMonthlyRevenue: turn0Result.estimatedMonthlyRevenue,
          estimatedMonthlyCosts: turn0Result.estimatedMonthlyCosts,
          companyProfile: turn0Result.companyProfile,
          marketProfile: turn0Result.marketProfile,
        });

        // Persist turn 0 briefing data
        setInitialBriefing({
          marketSummary: turn0Result.marketSummary,
          competitors: turn0Result.competitors,
          restOfMarket: turn0Result.restOfMarket,
        });

        // Reset and initialize token usage
        const initUsage = turn0Result.tokenUsage || { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
        setTotalTokenUsage(initUsage);

        // Store initial contacts
        setContacts(turn0Result.contacts || []);
        setActiveContactId(null);
        setLastTransientContactTurn(-3);

        setActions([]);
        setCurrentTurnResult(null);
        setShowTurnSummary(false);
        setTurnHistory([]);
        setAdvisorMessages([]);
        setIsAdvisorOpen(false);
      } catch (error) {
        console.error("Game initialization error:", error);
        throw error;
      } finally {
        setIsInitializing(false);
      }
    },
    []
  );

  // Process a turn
  const processTurn = useCallback(
    async (timeAdvance: TimeAdvance) => {
      setIsProcessingTurn(true);

      try {
        // Build contact summaries from contacts with recent exchanges
        const contactSummaries = contacts
          .filter((c) => c.conversationHistory.length > 0)
          .map((c) => {
            const recent = c.conversationHistory.slice(-2);
            const summary = recent.map((m) => `${m.role === "player" ? "CEO" : c.name}: ${m.content}`).join(" → ");
            return { contactId: c.id, name: c.name, position: c.position, summary };
          });

        const turnInput: TurnInput = {
          tasks: actions,
          gameState,
          timeAdvance,
          contactSummaries: contactSummaries.length > 0 ? contactSummaries : undefined,
        };

        const response = await fetch("/api/turn", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(turnInput),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || errorData.error || "API error");
        }

        const result: TurnResult = await response.json();

        // Add to turn history
        const historyEntry: TurnHistoryEntry = {
          turn: gameState.turn + 1,
          date: result.newDate,
          result,
          playerActions: [...actions],
        };
        setTurnHistory((prev) => [historyEntry, ...prev]);

        // Update game state with results
        setGameState((prev) => ({
          ...prev,
          turn: prev.turn + 1,
          currentDate: result.newDate,
          kpis: {
            cash: result.kpiDeltas.cash.value,
            marketShare: result.kpiDeltas.marketShare.value,
            satisfaction: result.kpiDeltas.satisfaction.value,
            brandAwareness: result.kpiDeltas.brandAwareness.value,
          },
          lastTurnSummary: result.nextTurnContext,
          companyCulture: result.companyCulture || prev.companyCulture,
          estimatedMonthlyRevenue: result.estimatedMonthlyRevenue || prev.estimatedMonthlyRevenue,
          estimatedMonthlyCosts: result.estimatedMonthlyCosts || prev.estimatedMonthlyCosts,
          // Update competitors from Gamemaster's resolved state
          competitors: result.updatedCompetitors,
          restOfMarket: result.updatedRestOfMarket,
          narrativeArcs: result.updatedNarratives,
          // Update pending consequences
          pendingConsequences: [
            ...prev.pendingConsequences.filter(
              (c) =>
                !result.triggeredConsequences.some((tc) => tc.id === c.id)
            ),
            ...result.newConsequences,
          ],
        }));

        // Accumulate token usage from this turn
        if (result.tokenUsage) {
          addTokenUsage(result.tokenUsage);
        }

        // Process contact updates from this turn
        const nextTurn = gameState.turn + 1;
        setContacts((prev) => {
          let updated = [...prev];

          // Add inbound messages from contacts
          for (const inbound of result.inboundContactMessages || []) {
            updated = updated.map((c) => {
              if (c.id !== inbound.contactId) return c;
              const newMsg: ContactMessage = {
                id: `${c.id}-t${nextTurn}-${Date.now()}`,
                role: "contact",
                content: inbound.message,
                turnNumber: nextTurn,
              };
              return {
                ...c,
                conversationHistory: [...c.conversationHistory, newMsg],
                unreadCount: c.unreadCount + 1,
              };
            });
          }

          // Add new transient contacts
          // Player-initiated contacts always go through; organic ones throttled to 1 every 2 turns
          const newTransients = result.newTransientContacts || [];
          const playerInitiated = newTransients.filter((t) => t.isPlayerInitiated);
          const organic = newTransients.filter((t) => !t.isPlayerInitiated);

          const toAdd = [
            ...playerInitiated,
            ...(nextTurn - lastTransientContactTurn >= 2 ? organic.slice(0, 1) : []),
          ];

          for (const raw of toAdd) {
            const already = updated.find((c) => c.id === raw.id);
            if (!already) {
              const newContact: Contact = {
                id: raw.id,
                name: raw.name,
                position: raw.position,
                company: raw.company,
                personality: raw.personality,
                relationshipStatus: "neutral",
                type: "transient",
                expiresAfterTurn: raw.expiresAfterTurn,
                conversationHistory: raw.introMessage
                  ? [{ id: `${raw.id}-intro`, role: "contact", content: raw.introMessage, turnNumber: nextTurn }]
                  : [],
                unreadCount: raw.introMessage ? 1 : 0,
              };
              updated = [...updated, newContact];
              if (!raw.isPlayerInitiated) setLastTransientContactTurn(nextTurn);
            }
          }

          // Expire transient contacts that have passed their turn
          updated = updated.map((c) => {
            if (c.type === "transient" && c.expiresAfterTurn && nextTurn > c.expiresAfterTurn) {
              return { ...c, relationshipStatus: "gone" as const };
            }
            return c;
          });

          return updated;
        });

        // Show turn summary (save actions before clearing)
        setCurrentTurnActions([...actions]);
        setCurrentTurnResult(result);
        setShowTurnSummary(true);

        // Clear actions for next turn
        setActions([]);
      } catch (error) {
        console.error("Error processing turn:", error);
        throw error;
      } finally {
        setIsProcessingTurn(false);
      }
    },
    [actions, gameState, contacts, lastTransientContactTurn]
  );

  // Close turn summary modal
  const closeTurnSummary = useCallback(() => {
    setShowTurnSummary(false);
  }, []);

  // Advisor functions
  const openAdvisor = useCallback(() => {
    setIsAdvisorOpen(true);
  }, []);

  const closeAdvisor = useCallback(() => {
    setIsAdvisorOpen(false);
  }, []);

  const clearAdvisorHistory = useCallback(() => {
    setAdvisorMessages([]);
  }, []);

  // Mark a contact's messages as read
  const markContactRead = useCallback((contactId: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  // Send a message to a contact and stream their reply
  const sendContactMessage = useCallback(
    async (contactId: string, message: string) => {
      const contact = contacts.find((c) => c.id === contactId);
      if (!contact) return;

      // Add player message to history
      const playerMsg: ContactMessage = {
        id: `player-${Date.now()}`,
        role: "player",
        content: message,
        turnNumber: gameState.turn,
      };
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactId
            ? { ...c, conversationHistory: [...c.conversationHistory, playerMsg] }
            : c
        )
      );

      // Build conversation history for API (role mapping: contact→assistant, player→user)
      const apiHistory = contact.conversationHistory.slice(-10).map((m) => ({
        role: (m.role === "player" ? "user" : "assistant") as "user" | "assistant",
        content: m.content,
      }));

      try {
        const response = await fetch("/api/stakeholder/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contact,
            message,
            gameState,
            conversationHistory: apiHistory,
          }),
        });

        if (!response.ok) throw new Error("Failed to reach stakeholder");

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("No response body");

        // Placeholder contact reply message
        const replyId = `contact-${Date.now()}`;
        const replyMsg: ContactMessage = {
          id: replyId,
          role: "contact",
          content: "",
          turnNumber: gameState.turn,
        };
        setContacts((prev) =>
          prev.map((c) =>
            c.id === contactId
              ? { ...c, conversationHistory: [...c.conversationHistory, replyMsg] }
              : c
          )
        );

        // Stream contact response
        let done = false;
        let fullContent = "";
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            fullContent += chunk;
            setContacts((prev) =>
              prev.map((c) =>
                c.id === contactId
                  ? {
                      ...c,
                      conversationHistory: c.conversationHistory.map((m) =>
                        m.id === replyId ? { ...m, content: m.content + chunk } : m
                      ),
                    }
                  : c
              )
            );
          }
        }

        // Strip token usage delimiter from displayed content
        const tokenDelimiter = "\n__TOKEN_USAGE__:";
        const delimiterIndex = fullContent.lastIndexOf(tokenDelimiter);
        if (delimiterIndex !== -1) {
          const usageJson = fullContent.slice(delimiterIndex + tokenDelimiter.length);
          try {
            const usage = JSON.parse(usageJson);
            addTokenUsage(usage);
          } catch { /* ignore */ }

          const cleanContent = fullContent.slice(0, delimiterIndex);
          setContacts((prev) =>
            prev.map((c) =>
              c.id === contactId
                ? {
                    ...c,
                    conversationHistory: c.conversationHistory.map((m) =>
                      m.id === replyId ? { ...m, content: cleanContent } : m
                    ),
                  }
                : c
            )
          );
        }
      } catch (error) {
        console.error("Contact chat error:", error);
      }
    },
    [contacts, gameState, addTokenUsage]
  );

  const sendAdvisorMessage = useCallback(
    async (content: string) => {
      // Add user message
      const userMessage: AdvisorMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };
      setAdvisorMessages((prev) => [...prev, userMessage]);
      setIsAdvisorTyping(true);

      try {
        const response = await fetch("/api/advisor/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content,
            gameState,
            turnHistory: turnHistory.slice(0, 5), // Last 5 turns for context
            pendingActions: actions,
            conversationHistory: advisorMessages.slice(-10), // Last 10 messages
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get advisor response");
        }

        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response body");
        }

        // Create assistant message placeholder
        const assistantMessageId = `assistant-${Date.now()}`;
        const assistantMessage: AdvisorMessage = {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        };
        setAdvisorMessages((prev) => [...prev, assistantMessage]);
        setIsAdvisorTyping(false);

        // Read stream
        let done = false;
        let fullContent = "";
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;

          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            fullContent += chunk;
            setAdvisorMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: msg.content + chunk }
                  : msg
              )
            );
          }
        }

        // Parse token usage from the stream delimiter if present
        const tokenDelimiter = "\n__TOKEN_USAGE__:";
        const delimiterIndex = fullContent.lastIndexOf(tokenDelimiter);
        if (delimiterIndex !== -1) {
          const usageJson = fullContent.slice(delimiterIndex + tokenDelimiter.length);
          try {
            const usage: TokenUsage = JSON.parse(usageJson);
            addTokenUsage(usage);
          } catch { /* ignore parse errors */ }

          // Remove the delimiter from the displayed message
          const cleanContent = fullContent.slice(0, delimiterIndex);
          setAdvisorMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: cleanContent }
                : msg
            )
          );
        }
      } catch (error) {
        console.error("Advisor error:", error);
        setIsAdvisorTyping(false);

        // Add error message
        const errorMessage: AdvisorMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "I apologize, but I'm having trouble connecting right now. Please try again.",
          timestamp: new Date(),
        };
        setAdvisorMessages((prev) => [...prev, errorMessage]);
      }
    },
    [gameState, turnHistory, actions, advisorMessages]
  );

  return (
    <GameContext.Provider
      value={{
        gameState,
        isProcessingTurn,
        isInitializing,
        currentTurnResult,
        currentTurnActions,
        showTurnSummary,
        initialBriefing,
        turnHistory,
        actions,
        addAction,
        removeAction,
        clearActions,
        processTurn,
        closeTurnSummary,
        initializeGame,
        // Advisor
        advisorMessages,
        isAdvisorOpen,
        isAdvisorTyping,
        openAdvisor,
        closeAdvisor,
        sendAdvisorMessage,
        clearAdvisorHistory,
        // Contacts
        contacts,
        activeContactId,
        setActiveContactId,
        sendContactMessage,
        markContactRead,
        // Token usage
        totalTokenUsage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}

// Helper function to create initial game state
function createInitialGameState(
  difficulty: Difficulty,
  market: Market,
  customMarket: string | undefined,
  size: CompanySize,
  experience: CompanyExperience,
  companyName: string,
  companyMission: string
): GameState {
  const startingKpis = SIZE_EXPERIENCE_KPIS[size][experience];

  return {
    difficulty,
    market,
    customMarket,
    playerCompany: {
      name: companyName,
      mission: companyMission,
      size,
      experience,
    },
    turn: 0,
    currentDate: new Date().toISOString().split("T")[0],
    kpis: {
      cash: startingKpis.cash,
      marketShare: startingKpis.marketShare,
      satisfaction: startingKpis.satisfaction,
      brandAwareness: startingKpis.brandAwareness,
    },
    companyCulture: "", // Populated by server-side Turn 0
    competitors: [], // Populated by server-side Turn 0
    restOfMarket: DEFAULT_REST_OF_MARKET, // Populated by server-side Turn 0
    estimatedMonthlyRevenue: 0, // Populated by server-side Turn 0
    estimatedMonthlyCosts: 0,   // Populated by server-side Turn 0
    narrativeArcs: [], // Empty at Turn 0, created at Turn 1
    lastTurnSummary: undefined,
    pendingConsequences: [],
  };
}
