"use client";

import { useState, useRef, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { Contact, ContactRelationshipStatus } from "@/lib/types/game";

// Color assigned per contact position
const POSITION_COLORS: Record<string, string> = {
  CFO: "#137fec",
  CTO: "#8b5cf6",
  "HR Director": "#10b981",
  "Head of Sales": "#f59e0b",
  "Investor Lead": "#f97316",
  "Legal Counsel": "#f43f5e",
};

function getAvatarColor(contact: Contact): string {
  for (const [key, color] of Object.entries(POSITION_COLORS)) {
    if (contact.position.includes(key)) return color;
  }
  return contact.type === "transient" ? "#6b7280" : "#137fec";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const STATUS_CONFIG: Record<ContactRelationshipStatus, { dot: string; label: string; labelColor: string }> = {
  engaged: { dot: "#10b981", label: "Engaged", labelColor: "text-emerald-400" },
  neutral: { dot: "#92adc9", label: "Neutral", labelColor: "text-[#92adc9]" },
  frustrated: { dot: "#ef4444", label: "Frustrated", labelColor: "text-red-400" },
  gone: { dot: "#374151", label: "Gone", labelColor: "text-gray-500" },
};

function ContactRow({
  contact,
  isActive,
  onClick,
}: {
  contact: Contact;
  isActive: boolean;
  onClick: () => void;
}) {
  const avatarColor = getAvatarColor(contact);
  const status = STATUS_CONFIG[contact.relationshipStatus];
  const lastMsg = contact.conversationHistory[contact.conversationHistory.length - 1];
  const isGone = contact.relationshipStatus === "gone";

  return (
    <button
      onClick={onClick}
      disabled={isGone}
      className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all text-left rounded-lg ${
        isActive
          ? "bg-primary/[0.08] border-l-2 border-l-primary"
          : "hover:bg-white/[0.03] border-l-2 border-l-transparent"
      } ${isGone ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className="size-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: avatarColor + "33", border: `1px solid ${avatarColor}55` }}
        >
          <span style={{ color: avatarColor }}>{getInitials(contact.name)}</span>
        </div>
        {/* Status dot */}
        <span
          className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#0a0f14]"
          style={{ backgroundColor: status.dot }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm font-semibold truncate ${isActive ? "text-white" : "text-[#c0d0e0]"}`}>
            {contact.name}
          </span>
          {contact.unreadCount > 0 && !isGone && (
            <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#137fec] text-white text-[10px] font-bold flex items-center justify-center">
              {contact.unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] text-[#92adc9] truncate">
            {contact.company ? `${contact.position} · ${contact.company}` : contact.position}
          </span>
          {contact.type === "transient" && !isGone && contact.expiresAfterTurn && (
            <span className="shrink-0 text-[9px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-full">
              T{contact.expiresAfterTurn}
            </span>
          )}
        </div>
        {lastMsg && (
          <p className="text-[11px] text-[#92adc9]/70 truncate mt-0.5">
            {lastMsg.role === "player" ? "You: " : ""}{lastMsg.content}
          </p>
        )}
      </div>
    </button>
  );
}

export default function StakeholdersPage() {
  const { contacts, activeContactId, setActiveContactId, sendContactMessage, markContactRead, gameState } = useGame();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeContact = contacts.find((c) => c.id === activeContactId) ?? null;

  const innerCircle = contacts.filter((c) => c.type === "inner_circle");
  const transient = contacts.filter((c) => c.type === "transient");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeContact?.conversationHistory.length]);

  const handleSelectContact = (id: string) => {
    setActiveContactId(id);
    markContactRead(id);
    setShowChat(true);
  };

  const handleSend = async () => {
    if (!input.trim() || !activeContactId || isSending) return;
    const msg = input.trim();
    setInput("");
    setIsSending(true);
    try {
      await sendContactMessage(activeContactId, msg);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-3">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] inline-flex">
            <span className="material-symbols-outlined text-[#92adc9] text-4xl">group</span>
          </div>
          <p className="text-[#92adc9] text-sm">No contacts yet — start a game to meet your team.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Contact List */}
      <aside
        className={`${showChat ? "hidden md:flex" : "flex"} w-full md:w-72 flex-col glass-nav border-r border-white/[0.05] shrink-0`}
      >
        <div className="px-4 py-4 border-b border-white/[0.05]">
          <h2 className="text-white font-bold font-heading text-base">Contacts</h2>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {/* Inner Circle */}
          {innerCircle.length > 0 && (
            <>
              <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-[#92adc9]">
                Inner Circle
              </p>
              {innerCircle.map((c) => (
                <ContactRow
                  key={c.id}
                  contact={c}
                  isActive={c.id === activeContactId}
                  onClick={() => handleSelectContact(c.id)}
                />
              ))}
            </>
          )}

          {/* Transient */}
          {transient.length > 0 && (
            <>
              <div className="px-4 pt-4 pb-1 flex items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#92adc9]">Transient</span>
                <span className="material-symbols-outlined text-[#92adc9] text-[14px]">hourglass_empty</span>
              </div>
              {transient.map((c) => (
                <ContactRow
                  key={c.id}
                  contact={c}
                  isActive={c.id === activeContactId}
                  onClick={() => handleSelectContact(c.id)}
                />
              ))}
              <p className="px-4 pt-2 pb-3 text-[10px] text-[#92adc9]/50">
                Transient contacts expire if ignored.
              </p>
            </>
          )}
        </div>
      </aside>

      {/* Chat Panel */}
      <section className={`${showChat ? "flex" : "hidden md:flex"} flex-col flex-1 min-h-0`}>
        {!activeContact ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center space-y-2">
              <span className="material-symbols-outlined text-[#233648] text-5xl block">chat</span>
              <p className="text-[#92adc9] text-sm">Select a contact to start a conversation</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 glass-nav border-b border-white/[0.05] shrink-0">
              <button
                onClick={() => setShowChat(false)}
                className="flex md:hidden items-center justify-center p-1.5 rounded-lg text-[#92adc9] hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>

              {/* Avatar */}
              <div
                className="size-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  backgroundColor: getAvatarColor(activeContact) + "33",
                  border: `1px solid ${getAvatarColor(activeContact)}55`,
                }}
              >
                <span style={{ color: getAvatarColor(activeContact) }}>{getInitials(activeContact.name)}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold font-heading text-sm leading-none">
                    {activeContact.name}
                  </span>
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: STATUS_CONFIG[activeContact.relationshipStatus].dot }}
                  />
                  <span
                    className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 ${STATUS_CONFIG[activeContact.relationshipStatus].labelColor}`}
                    style={{ borderColor: STATUS_CONFIG[activeContact.relationshipStatus].dot + "66" }}
                  >
                    {STATUS_CONFIG[activeContact.relationshipStatus].label}
                  </span>
                </div>
                <p className="text-[11px] text-[#92adc9] mt-0.5">
                  {activeContact.company
                    ? `${activeContact.position} · ${activeContact.company}`
                    : `${activeContact.position} · ${activeContact.type === "inner_circle" ? "Inner Circle" : "Transient"}`}
                </p>
              </div>

              <div className="text-[11px] text-[#92adc9] hidden sm:block shrink-0">
                Turn {gameState.turn}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {activeContact.conversationHistory.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-[#92adc9] text-sm">Send a message to start the conversation.</p>
                </div>
              ) : (
                <>
                  {activeContact.conversationHistory.map((msg, i) => {
                    const isPlayer = msg.role === "player";
                    const showTurnLabel =
                      i === 0 ||
                      activeContact.conversationHistory[i - 1].turnNumber !== msg.turnNumber;

                    return (
                      <div key={msg.id}>
                        {showTurnLabel && (
                          <div className="flex justify-center my-2">
                            <span className="text-[10px] uppercase tracking-widest text-[#92adc9]/60">
                              Turn {msg.turnNumber}
                            </span>
                          </div>
                        )}
                        <div className={`flex gap-2.5 max-w-xl ${isPlayer ? "ml-auto flex-row-reverse" : ""}`}>
                          {!isPlayer && (
                            <div
                              className="size-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-1"
                              style={{
                                backgroundColor: getAvatarColor(activeContact) + "33",
                                border: `1px solid ${getAvatarColor(activeContact)}55`,
                                color: getAvatarColor(activeContact),
                              }}
                            >
                              {getInitials(activeContact.name)}
                            </div>
                          )}
                          <div
                            className={`px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                              isPlayer
                                ? "rounded-tr-sm bg-primary/[0.1] border border-primary/[0.2] text-white"
                                : "rounded-tl-sm bg-white/[0.03] border border-white/[0.06] text-[#c0d0e0]"
                            }`}
                          >
                            {msg.content || (
                              <span className="flex gap-1 items-center text-[#92adc9]">
                                <span className="size-1.5 rounded-full bg-[#92adc9] animate-bounce [animation-delay:0ms]" />
                                <span className="size-1.5 rounded-full bg-[#92adc9] animate-bounce [animation-delay:150ms]" />
                                <span className="size-1.5 rounded-full bg-[#92adc9] animate-bounce [animation-delay:300ms]" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="shrink-0 px-4 py-3 glass-nav border-t border-white/[0.05]">
              {activeContact.relationshipStatus === "gone" ? (
                <p className="text-center text-[#92adc9] text-sm py-1">
                  This contact is no longer available.
                </p>
              ) : (
                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Reply to ${activeContact.name.split(" ")[0]}…`}
                    rows={1}
                    disabled={isSending}
                    className="flex-1 px-3 py-2.5 glass-input rounded-xl text-sm text-white placeholder-[#92adc9] resize-none focus:outline-none focus:border-[#137fec]/50 transition-colors disabled:opacity-50"
                    style={{ maxHeight: 120 }}
                    onInput={(e) => {
                      const t = e.target as HTMLTextAreaElement;
                      t.style.height = "auto";
                      t.style.height = Math.min(t.scrollHeight, 120) + "px";
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isSending}
                    className="flex items-center justify-center size-10 bg-[#137fec] hover:bg-blue-500 active:scale-95 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    {isSending ? (
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
