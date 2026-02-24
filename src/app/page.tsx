import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#101922] overflow-x-hidden text-white">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-glow-pulse absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="animate-glow-pulse absolute top-1/2 -left-48 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" style={{ animationDelay: "1.5s" }} />
        <div className="animate-glow-pulse absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[100px]" style={{ animationDelay: "2.5s" }} />
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
            PorterAi
          </h2>
        </div>
        <Link
          href="/onboarding"
          className="flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
        >
          Start Playing
        </Link>
      </header>

      {/* Main content — fills remaining viewport */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-0">
        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute top-[10%] left-[15%] text-primary/15">
            <span className="material-symbols-outlined text-5xl">bar_chart</span>
          </div>
          <div className="animate-float-delay absolute top-[20%] right-[12%] text-emerald-400/15">
            <span className="material-symbols-outlined text-4xl">trending_up</span>
          </div>
          <div className="animate-float-delay-2 absolute bottom-[20%] left-[20%] text-orange-400/15">
            <span className="material-symbols-outlined text-4xl">bolt</span>
          </div>
          <div className="animate-float absolute bottom-[15%] right-[18%] text-primary/10">
            <span className="material-symbols-outlined text-5xl">psychology</span>
          </div>
        </div>

        {/* Hero */}
        <div className="max-w-3xl text-center mb-8 sm:mb-12">
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="material-symbols-outlined text-base">
              auto_awesome
            </span>
            AI-Powered Business Simulator
          </div>
          <h1 className="animate-fade-up-delay-1 text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-[-0.033em] mb-4">
            Master Business Strategy
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400"> by doing</span>
          </h1>
          <p className="animate-fade-up-delay-2 text-[#92adc9] text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto">
            Run your own company in a dynamic market powered by AI agents. Make strategic decisions, outsmart AI competitors, and prove you can lead a company to success.
          </p>
          <div className="animate-fade-up-delay-3">
            <Link
              href="/onboarding"
              className="group inline-flex items-center justify-center h-12 sm:h-14 px-8 sm:px-10 rounded-xl bg-primary text-white font-bold text-base sm:text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-[0.98] transition-all duration-300 gap-2"
            >
              Start Playing
              <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 max-w-5xl w-full pb-4">
          <div className="group flex items-start gap-4 p-5 rounded-xl border border-[#233648] bg-[#1a2634]/60 backdrop-blur-sm hover:border-primary/40 hover:bg-[#1e2d3d]/80 hover:-translate-y-0.5 transition-all duration-300">
            <div className="p-2.5 rounded-lg bg-primary/20 text-primary shrink-0 group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-2xl">smart_toy</span>
            </div>
            <div>
              <h3 className="text-white text-base font-bold mb-1">AI Competitors</h3>
              <p className="text-[#92adc9] text-sm leading-relaxed">
                Intelligent AI agents adapt to your strategy and fight for market share.
              </p>
            </div>
          </div>

          <div className="group flex items-start gap-4 p-5 rounded-xl border border-[#233648] bg-[#1a2634]/60 backdrop-blur-sm hover:border-orange-400/40 hover:bg-[#1e2d3d]/80 hover:-translate-y-0.5 transition-all duration-300">
            <div className="p-2.5 rounded-lg bg-orange-500/20 text-orange-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-2xl">strategy</span>
            </div>
            <div>
              <h3 className="text-white text-base font-bold mb-1">Strategic Decisions</h3>
              <p className="text-[#92adc9] text-sm leading-relaxed">
                Manage cash, market share, and satisfaction through every choice you make.
              </p>
            </div>
          </div>

          <div className="group flex items-start gap-4 p-5 rounded-xl border border-[#233648] bg-[#1a2634]/60 backdrop-blur-sm hover:border-emerald-400/40 hover:bg-[#1e2d3d]/80 hover:-translate-y-0.5 transition-all duration-300">
            <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-2xl">trending_up</span>
            </div>
            <div>
              <h3 className="text-white text-base font-bold mb-1">Dynamic Market</h3>
              <p className="text-[#92adc9] text-sm leading-relaxed">
                Markets evolve with narrative arcs, news, and shifting dynamics. No two games are alike.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
