"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGame } from "@/context/GameContext";
import { CompanyArchetype, Difficulty, Market } from "@/lib/types/game";

export default function CompanyPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-[#101922]" />}>
      <CompanyPageContent />
    </Suspense>
  );
}

function CompanyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { initializeGame, isInitializing } = useGame();

  const difficulty = (searchParams.get("difficulty") || "standard") as Difficulty;
  const market = (searchParams.get("market") || "saas") as Market;
  const customMarket = searchParams.get("customMarket") || undefined;
  const companyName = searchParams.get("companyName") || "Unnamed Corp";
  const companyMission = searchParams.get("companyMission") || "To succeed in the market";

  const [selected, setSelected] = useState<CompanyArchetype>("incumbent");

  const handleFinalize = async () => {
    try {
      await initializeGame(
        difficulty,
        market,
        customMarket,
        selected,
        companyName,
        companyMission
      );
      router.push("/briefing");
    } catch (error) {
      console.error("Failed to initialize game:", error);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#101922] overflow-x-hidden text-white">
      <div className="flex h-full grow flex-col">
        {/* Top Navigation */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#233648] px-10 py-3 bg-[#111a22]">
          <div className="flex items-center gap-4 text-white">
            <div className="size-8 flex items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined text-xl">
                rocket_launch
              </span>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              MVP Simulator
            </h2>
          </div>
        </header>

        <main className="flex flex-1 justify-center py-4 px-6 sm:px-10">
          <div className="flex flex-col w-full max-w-[960px]">
            {/* Progress Bar */}
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex justify-between items-center">
                <p className="text-white text-sm font-medium">
                  Step 3 of 3
                </p>
                <p className="text-[#92adc9] text-sm">
                  Strategic Archetype
                </p>
              </div>
              <div className="rounded-full bg-[#324d67] h-2 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>

            {/* Page Heading */}
            <div className="flex flex-col gap-2 mb-4">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Select Your Strategic Archetype
              </h1>
              <p className="text-[#92adc9] text-lg font-normal">
                Choose a company archetype to determine your starting resources and challenges.
              </p>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Card 1: Disruptive Innovator */}
              <label className="relative cursor-pointer group">
                <input
                  className="peer sr-only"
                  name="company"
                  type="radio"
                  value="innovator"
                  checked={selected === "innovator"}
                  onChange={() => setSelected("innovator")}
                />
                <div className="h-full flex flex-col gap-4 p-4 rounded-xl border-2 border-[#324d67] bg-[#1a2634] peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-primary/50 transition-all duration-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-lg bg-cyan-500/20 text-cyan-400">
                      <span className="material-symbols-outlined text-3xl">
                        rocket_launch
                      </span>
                    </div>
                    <div className="check-icon text-primary animate-in zoom-in duration-200">
                      <span className="material-symbols-outlined filled">
                        check_circle
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold mb-2">
                      Disruptive Innovator
                    </h3>
                    <p className="text-[#92adc9] text-sm leading-relaxed">
                      A scrappy startup with breakthrough tech. High innovation potential but extreme financial risk.
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-[#2a3b4d] flex flex-wrap gap-2">
                    <span className="inline-flex items-center text-xs font-medium text-white bg-[#2a3b4d] px-2 py-1 rounded">
                      $750k
                    </span>
                    <span className="inline-flex items-center text-xs font-medium text-white bg-[#2a3b4d] px-2 py-1 rounded">
                      1% Share
                    </span>
                  </div>
                </div>
              </label>

              {/* Card 2: Global Incumbent */}
              <label className="relative cursor-pointer group">
                <input
                  className="peer sr-only"
                  name="company"
                  type="radio"
                  value="incumbent"
                  checked={selected === "incumbent"}
                  onChange={() => setSelected("incumbent")}
                />
                <div className="h-full flex flex-col gap-4 p-4 rounded-xl border-2 border-[#324d67] bg-[#1a2634] peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-primary/50 transition-all duration-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-lg bg-primary/20 text-primary">
                      <span className="material-symbols-outlined text-3xl">
                        corporate_fare
                      </span>
                    </div>
                    <div className="check-icon text-primary animate-in zoom-in duration-200">
                      <span className="material-symbols-outlined filled">
                        check_circle
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold mb-2">
                      Global Incumbent
                    </h3>
                    <p className="text-[#92adc9] text-sm leading-relaxed">
                      An industry titan with massive resources. Immense market power but bureaucratic inertia.
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-[#2a3b4d] flex flex-wrap gap-2">
                    <span className="inline-flex items-center text-xs font-medium text-white bg-[#2a3b4d] px-2 py-1 rounded">
                      $100M
                    </span>
                    <span className="inline-flex items-center text-xs font-medium text-white bg-[#2a3b4d] px-2 py-1 rounded">
                      40% Share
                    </span>
                  </div>
                </div>
              </label>

              {/* Card 3: Cost Leader */}
              <label className="relative cursor-pointer group">
                <input
                  className="peer sr-only"
                  name="company"
                  type="radio"
                  value="costleader"
                  checked={selected === "costleader"}
                  onChange={() => setSelected("costleader")}
                />
                <div className="h-full flex flex-col gap-4 p-4 rounded-xl border-2 border-[#324d67] bg-[#1a2634] peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-primary/50 transition-all duration-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <span className="material-symbols-outlined text-3xl">
                        warehouse
                      </span>
                    </div>
                    <div className="check-icon text-primary animate-in zoom-in duration-200">
                      <span className="material-symbols-outlined filled">
                        check_circle
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold mb-2">
                      Cost Leader
                    </h3>
                    <p className="text-[#92adc9] text-sm leading-relaxed">
                      Highly efficient operator with razor-thin margins. Scale economies but vulnerable to price wars.
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-[#2a3b4d] flex flex-wrap gap-2">
                    <span className="inline-flex items-center text-xs font-medium text-white bg-[#2a3b4d] px-2 py-1 rounded">
                      $15M
                    </span>
                    <span className="inline-flex items-center text-xs font-medium text-white bg-[#2a3b4d] px-2 py-1 rounded">
                      25% Share
                    </span>
                  </div>
                </div>
              </label>

              {/* Card 4: Premium Niche */}
              <label className="relative cursor-pointer group">
                <input
                  className="peer sr-only"
                  name="company"
                  type="radio"
                  value="premium"
                  checked={selected === "premium"}
                  onChange={() => setSelected("premium")}
                />
                <div className="h-full flex flex-col gap-4 p-4 rounded-xl border-2 border-[#324d67] bg-[#1a2634] peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-primary/50 transition-all duration-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                      <span className="material-symbols-outlined text-3xl">
                        diamond
                      </span>
                    </div>
                    <div className="check-icon text-primary animate-in zoom-in duration-200">
                      <span className="material-symbols-outlined filled">
                        check_circle
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold mb-2">
                      Premium Niche
                    </h3>
                    <p className="text-[#92adc9] text-sm leading-relaxed">
                      Luxury brand with loyal customers. Superior margins but limited scalability.
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-[#2a3b4d] flex flex-wrap gap-2">
                    <span className="inline-flex items-center text-xs font-medium text-white bg-[#2a3b4d] px-2 py-1 rounded">
                      $5M
                    </span>
                    <span className="inline-flex items-center text-xs font-medium text-white bg-[#2a3b4d] px-2 py-1 rounded">
                      5% Share
                    </span>
                  </div>
                </div>
              </label>

              {/* Card 5: Data Platform */}
              <label className="relative cursor-pointer group">
                <input
                  className="peer sr-only"
                  name="company"
                  type="radio"
                  value="platform"
                  checked={selected === "platform"}
                  onChange={() => setSelected("platform")}
                />
                <div className="h-full flex flex-col gap-4 p-4 rounded-xl border-2 border-[#324d67] bg-[#1a2634] peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-primary/50 transition-all duration-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
                      <span className="material-symbols-outlined text-3xl">
                        hub
                      </span>
                    </div>
                    <div className="check-icon text-primary animate-in zoom-in duration-200">
                      <span className="material-symbols-outlined filled">
                        check_circle
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold mb-2">
                      Data Platform
                    </h3>
                    <p className="text-[#92adc9] text-sm leading-relaxed">
                      Ecosystem builder leveraging data. Exponential growth potential but high churn risk.
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-[#2a3b4d] flex flex-wrap gap-2">
                    <span className="inline-flex items-center text-xs font-medium text-white bg-[#2a3b4d] px-2 py-1 rounded">
                      $10M
                    </span>
                    <span className="inline-flex items-center text-xs font-medium text-white bg-[#2a3b4d] px-2 py-1 rounded">
                      8% Share
                    </span>
                  </div>
                </div>
              </label>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between">
              <Link
                href={`/market?difficulty=${difficulty}`}
                className="flex items-center justify-center h-12 px-6 rounded-lg text-[#92adc9] font-bold text-base hover:bg-[#1f2937] transition-colors"
              >
                Back
              </Link>
              <button
                onClick={handleFinalize}
                disabled={isInitializing}
                className="flex items-center justify-center h-12 px-8 rounded-lg bg-primary text-white font-bold text-base shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInitializing ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin mr-2">
                      progress_activity
                    </span>
                    Generating Market...
                  </>
                ) : (
                  "Finalize Simulation"
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
