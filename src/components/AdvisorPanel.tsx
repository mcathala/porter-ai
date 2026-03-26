"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useGame } from "@/context/GameContext";

export default function AdvisorPanel() {
  const {
    isAdvisorOpen,
    closeAdvisor,
    advisorMessages,
    isAdvisorTyping,
    sendAdvisorMessage,
    clearAdvisorHistory,
  } = useGame();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change or panel opens
  useEffect(() => {
    if (isAdvisorOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [advisorMessages, isAdvisorTyping, isAdvisorOpen]);

  // Focus input when panel opens
  useEffect(() => {
    if (isAdvisorOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdvisorOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isAdvisorTyping) return;

    const message = inputValue.trim();
    setInputValue("");
    await sendAdvisorMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (e.key === "Escape") {
      closeAdvisor();
    }
  };

  if (!isAdvisorOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0a0f14]/80 backdrop-blur-sm z-40"
        onClick={closeAdvisor}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-panel border-l border-white/[0.05] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
              M
            </div>
            <div>
              <h2 className="font-bold font-heading text-white">Michael</h2>
              <p className="text-xs font-heading text-gray-400">Chief of Staff</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearAdvisorHistory}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
              title="Clear conversation"
            >
              <span className="material-symbols-outlined text-[20px]">
                delete_sweep
              </span>
            </button>
            <button
              onClick={closeAdvisor}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {advisorMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/20 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-emerald-500 text-3xl">
                  psychology
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading tracking-[-0.02em] text-white mb-2">
                How can I help?
              </h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                I&apos;m Michael, your chief of staff. Ask me about your company&apos;s
                position, competitors, market conditions, or strategic options.
              </p>
              <div className="space-y-2 w-full">
                <SuggestedQuestion
                  text="What's our biggest risk right now?"
                  onClick={(q) => sendAdvisorMessage(q)}
                />
                <SuggestedQuestion
                  text="How should I respond to competitor moves?"
                  onClick={(q) => sendAdvisorMessage(q)}
                />
                <SuggestedQuestion
                  text="What should my priorities be this turn?"
                  onClick={(q) => sendAdvisorMessage(q)}
                />
              </div>
            </div>
          )}

          {advisorMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isAdvisorTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                M
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3 text-gray-400">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-white/[0.06] bg-white/[0.02]"
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Michael for advice..."
              disabled={isAdvisorTyping}
              className="flex-1 glass-input rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isAdvisorTyping}
              className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 text-center">
            Press Enter to send • Esc to close
          </p>
        </form>
      </div>
    </>
  );
}

function MessageBubble({
  message,
}: {
  message: { role: "user" | "assistant"; content: string };
}) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          M
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-white rounded-tr-sm shadow-lg shadow-primary/20"
            : "bg-white/[0.03] border border-white/[0.06] text-gray-200 rounded-tl-sm"
        }`}
      >
        {isUser ? (
          <div className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
        ) : (
          <div className="text-sm leading-relaxed markdown-content">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="my-2">{children}</p>,
                strong: ({ children }) => (
                  <strong className="font-bold text-white">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-300">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-200">{children}</li>
                ),
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold font-heading tracking-[-0.02em] text-white mt-3 mb-2">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-bold font-heading tracking-[-0.02em] text-white mt-3 mb-2">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-bold font-heading text-white mt-2 mb-1">{children}</h3>
                ),
                code: ({ children }) => (
                  <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-emerald-400 text-xs">
                    {children}
                  </code>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-emerald-500 pl-3 my-2 text-gray-400 italic">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

function SuggestedQuestion({
  text,
  onClick,
}: {
  text: string;
  onClick: (text: string) => void;
}) {
  return (
    <button
      onClick={() => onClick(text)}
      className="w-full text-left px-4 py-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] hover:border-emerald-500/40 rounded-xl text-sm text-gray-300 hover:text-white transition-all"
    >
      {text}
    </button>
  );
}
