import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#101922] overflow-x-hidden text-white">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-glow-pulse absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div
          className="animate-glow-pulse absolute top-1/3 -left-48 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="animate-glow-pulse absolute top-2/3 -right-32 w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[100px]"
          style={{ animationDelay: "2.5s" }}
        />
        <div
          className="animate-glow-pulse absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px]"
          style={{ animationDelay: "3.5s" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#233648] px-4 sm:px-10 py-3 bg-[#111a22]/80 backdrop-blur-md">
        <div className="flex items-center gap-4 text-white">
          <div className="size-8 flex items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined text-xl">
              rocket_launch
            </span>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            playporter.ai
          </h2>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-32 pb-16 sm:pb-24">
        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute top-[10%] left-[15%] text-primary/15">
            <span className="material-symbols-outlined text-5xl">
              bar_chart
            </span>
          </div>
          <div className="animate-float-delay absolute top-[20%] right-[12%] text-emerald-400/15">
            <span className="material-symbols-outlined text-4xl">
              trending_up
            </span>
          </div>
          <div className="animate-float-delay-2 absolute bottom-[20%] left-[20%] text-orange-400/15">
            <span className="material-symbols-outlined text-4xl">bolt</span>
          </div>
          <div className="animate-float absolute bottom-[15%] right-[18%] text-primary/10">
            <span className="material-symbols-outlined text-5xl">
              psychology
            </span>
          </div>
        </div>

        <div className="max-w-3xl text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="material-symbols-outlined text-base">
              auto_awesome
            </span>
            Ai-Powered Business Game
          </div>
          <h1 className="animate-fade-up-delay-1 text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-[-0.033em] mb-6">
            Strategy Is Decided
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              by Action
            </span>
          </h1>
          <p className="animate-fade-up-delay-2 text-[#92adc9] text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto">
            A turn-based strategy game where you build a company inside a living
            market. You set decisions. AI competitors respond. The industry
            evolves.
          </p>
          <div className="animate-fade-up-delay-3">
            <Link
              href="/onboarding"
              className="group inline-flex items-center justify-center h-12 sm:h-14 px-8 sm:px-10 rounded-xl bg-primary text-white font-bold text-base sm:text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-[0.98] transition-all duration-300 gap-2"
            >
              Start a Company
              <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* A Market That Reacts */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="animate-section text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.025em] mb-4">
              A Market That Reacts
            </h2>
            <p className="text-[#92adc9] text-base sm:text-lg max-w-2xl mx-auto">
              You don&apos;t play against static scenarios. Every competitor is
              driven by AI — each with its own strategy, constraints, and
              instincts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
            <div className="group flex items-center gap-4 p-5 rounded-xl border border-[#233648] bg-[#1a2634]/60 backdrop-blur-sm hover:border-primary/40 hover:bg-[#1e2d3d]/80 transition-all duration-300">
              <div className="p-2.5 rounded-lg bg-primary/20 text-primary shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-2xl">
                  sell
                </span>
              </div>
              <div>
                <h3 className="text-white text-base font-bold">
                  Adjusts pricing
                </h3>
                <p className="text-[#92adc9] text-sm">
                  Undercuts or holds margins based on market pressure
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 p-5 rounded-xl border border-[#233648] bg-[#1a2634]/60 backdrop-blur-sm hover:border-emerald-400/40 hover:bg-[#1e2d3d]/80 transition-all duration-300">
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-2xl">
                  precision_manufacturing
                </span>
              </div>
              <div>
                <h3 className="text-white text-base font-bold">
                  Invests in capacity
                </h3>
                <p className="text-[#92adc9] text-sm">
                  Scales operations to seize or defend market share
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 p-5 rounded-xl border border-[#233648] bg-[#1a2634]/60 backdrop-blur-sm hover:border-orange-400/40 hover:bg-[#1e2d3d]/80 transition-all duration-300">
              <div className="p-2.5 rounded-lg bg-orange-500/20 text-orange-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-2xl">
                  shield
                </span>
              </div>
              <div>
                <h3 className="text-white text-base font-bold">
                  Protects margins
                </h3>
                <p className="text-[#92adc9] text-sm">
                  Defends profitability when competitors get aggressive
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 p-5 rounded-xl border border-[#233648] bg-[#1a2634]/60 backdrop-blur-sm hover:border-violet-400/40 hover:bg-[#1e2d3d]/80 transition-all duration-300">
              <div className="p-2.5 rounded-lg bg-violet-500/20 text-violet-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-2xl">
                  target
                </span>
              </div>
              <div>
                <h3 className="text-white text-base font-bold">
                  Reacts to your positioning
                </h3>
                <p className="text-[#92adc9] text-sm">
                  Adapts strategy in response to every move you make
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-[#6b8baa] text-sm font-medium tracking-wide uppercase">
            Every turn reshapes the competitive landscape
          </p>
        </div>
      </section>

      {/* Learn Strategy by Experiencing It */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.025em] mb-6">
            Learn Strategy by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Experiencing It
            </span>
          </h2>
          <p className="text-[#92adc9] text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Manage cash constraints. Balance growth against profitability.
            Anticipate competitor retaliation. Strategy concepts stop being
            abstract when they affect your survival.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.025em] mb-14">
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="relative flex flex-col items-center text-center p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-black text-lg mb-4">
                1
              </div>
              <h3 className="text-white text-base font-bold mb-2">
                Choose an industry
              </h3>
              <p className="text-[#92adc9] text-sm leading-relaxed">
                Pick a market where you want to compete
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-black text-lg mb-4">
                2
              </div>
              <h3 className="text-white text-base font-bold mb-2">
                Define your decisions
              </h3>
              <p className="text-[#92adc9] text-sm leading-relaxed">
                Set pricing, investment, and strategic direction
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-black text-lg mb-4">
                3
              </div>
              <h3 className="text-white text-base font-bold mb-2">
                Watch competitors react
              </h3>
              <p className="text-[#92adc9] text-sm leading-relaxed">
                AI-driven rivals adapt to your every move
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-black text-lg mb-4">
                4
              </div>
              <h3 className="text-white text-base font-bold mb-2">
                Monitor and adapt
              </h3>
              <p className="text-[#92adc9] text-sm leading-relaxed">
                Track market shares, cash flow, and competitive position
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#233648] bg-[#1a2634]/60 text-[#92adc9] text-sm font-medium">
              <span className="material-symbols-outlined text-primary text-base">
                flag
              </span>
              Your objective: Build sustainable advantage without running out of
              cash
            </p>
          </div>
        </div>
      </section>

      {/* Designed For */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.025em] mb-12">
            Designed For
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="flex items-start gap-4 p-5 rounded-xl border border-[#233648] bg-[#1a2634]/60 backdrop-blur-sm">
              <div className="p-2.5 rounded-lg bg-primary/20 text-primary shrink-0">
                <span className="material-symbols-outlined text-2xl">
                  school
                </span>
              </div>
              <div>
                <h3 className="text-white text-base font-bold mb-1">
                  Business Students
                </h3>
                <p className="text-[#92adc9] text-sm leading-relaxed">
                  Who want strategy to feel real, not theoretical
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl border border-[#233648] bg-[#1a2634]/60 backdrop-blur-sm">
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <span className="material-symbols-outlined text-2xl">
                  rocket_launch
                </span>
              </div>
              <div>
                <h3 className="text-white text-base font-bold mb-1">
                  Entrepreneurs
                </h3>
                <p className="text-[#92adc9] text-sm leading-relaxed">
                  Testing decisions before they become expensive
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl border border-[#233648] bg-[#1a2634]/60 backdrop-blur-sm">
              <div className="p-2.5 rounded-lg bg-orange-500/20 text-orange-400 shrink-0">
                <span className="material-symbols-outlined text-2xl">
                  work
                </span>
              </div>
              <div>
                <h3 className="text-white text-base font-bold mb-1">
                  Professionals
                </h3>
                <p className="text-[#92adc9] text-sm leading-relaxed">
                  Sharpening competitive instincts in a safe environment
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl border border-[#233648] bg-[#1a2634]/60 backdrop-blur-sm">
              <div className="p-2.5 rounded-lg bg-violet-500/20 text-violet-400 shrink-0">
                <span className="material-symbols-outlined text-2xl">
                  menu_book
                </span>
              </div>
              <div>
                <h3 className="text-white text-base font-bold mb-1">
                  Educators
                </h3>
                <p className="text-[#92adc9] text-sm leading-relaxed">
                  Who want students to learn strategy by doing
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-4 sm:px-6 py-20 sm:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#6b8baa] text-lg sm:text-xl font-medium mb-6 tracking-wide">
            Every decision shapes the industry.
          </p>
          <Link
            href="/onboarding"
            className="group inline-flex items-center justify-center h-14 sm:h-16 px-10 sm:px-14 rounded-xl bg-primary text-white font-bold text-lg sm:text-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-[0.98] transition-all duration-300 gap-2"
          >
            Enter the Market
            <span className="material-symbols-outlined text-2xl transition-transform duration-300 group-hover:translate-x-1">
              arrow_forward
            </span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#233648] px-4 sm:px-10 py-6">
        <p className="text-center text-[#4a6a86] text-sm">
          An applied competitive strategy simulator.
        </p>
      </footer>
    </div>
  );
}
