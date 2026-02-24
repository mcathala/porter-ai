"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("standard");

  const handleContinue = () => {
    router.push(`/market?difficulty=${selected}`);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#101922] overflow-x-hidden text-white">
      <div className="flex h-full grow flex-col">
        {/* Top Navigation */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#233648] px-4 sm:px-10 py-3 bg-[#111a22]">
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
        </header>

        <main className="flex flex-1 justify-center py-8 px-6 sm:px-10">
          <div className="flex flex-col w-full max-w-[960px]">
            {/* Progress Bar Section */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex justify-between items-center">
                <p className="text-white text-sm font-medium">
                  Step 1 of 3
                </p>
                <p className="text-[#92adc9] text-sm">
                  Configuration
                </p>
              </div>
              <div className="rounded-full bg-[#324d67] h-2 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: "33%" }}
                ></div>
              </div>
            </div>

            {/* Page Heading */}
            <div className="flex flex-col gap-2 mb-8">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Select Your Challenge Level
              </h1>
              <p className="text-[#92adc9] text-lg font-normal">
                How do you want to play?
              </p>
            </div>

            {/* Difficulty Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Card 1: Easy */}
              <label className="relative cursor-pointer group">
                <input
                  className="peer sr-only"
                  name="difficulty"
                  type="radio"
                  value="easy"
                  checked={selected === "easy"}
                  onChange={() => setSelected("easy")}
                />
                <div className="h-full flex flex-col gap-4 p-6 rounded-xl border-2 border-[#324d67] bg-[#1a2634] peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-primary/50 transition-all duration-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
                      <span className="material-symbols-outlined text-3xl">
                        menu_book
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
                      Easy
                    </h3>
                    <p className="text-[#92adc9] text-sm leading-relaxed">
                      Tasks success rate is high, allowing you to experiment freely. Less pressure by stakeholders.
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-[#2a3b4d]">
                    <span className="inline-flex items-center text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded">
                      Low AI Pressure
                    </span>
                  </div>
                </div>
              </label>

              {/* Card 2: Standard */}
              <label className="relative cursor-pointer group">
                <input
                  className="peer sr-only"
                  name="difficulty"
                  type="radio"
                  value="standard"
                  checked={selected === "standard"}
                  onChange={() => setSelected("standard")}
                />
                <div className="h-full flex flex-col gap-4 p-6 rounded-xl border-2 border-[#324d67] bg-[#1a2634] peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-primary/50 transition-all duration-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-lg bg-primary/20 text-primary">
                      <span className="material-symbols-outlined text-3xl">
                        trophy
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
                      Standard
                    </h3>
                    <p className="text-[#92adc9] text-sm leading-relaxed">
                      Tasks could fail. AI agents actively compete for
                      market share and respond to your moves.
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-[#2a3b4d]">
                    <span className="inline-flex items-center text-xs font-semibold text-primary bg-blue-500/10 px-2 py-1 rounded">
                      Standard Pressure
                    </span>
                  </div>
                </div>
              </label>

              {/* Card 3: Hard */}
              <label className="relative cursor-pointer group">
                <input
                  className="peer sr-only"
                  name="difficulty"
                  type="radio"
                  value="hard"
                  checked={selected === "hard"}
                  onChange={() => setSelected("hard")}
                />
                <div className="h-full flex flex-col gap-4 p-6 rounded-xl border-2 border-[#324d67] bg-[#1a2634] peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-primary/50 transition-all duration-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-lg bg-orange-500/20 text-orange-400">
                      <span className="material-symbols-outlined text-3xl">
                        bolt
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
                      Hard
                    </h3>
                    <p className="text-[#92adc9] text-sm leading-relaxed">
                      High pressure simulation. AI agents are aggressive,
                      unpredictable, and will try to drive you out.
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-[#2a3b4d]">
                    <span className="inline-flex items-center text-xs font-semibold text-orange-400 bg-orange-500/10 px-2 py-1 rounded">
                      High AI Pressure
                    </span>
                  </div>
                </div>
              </label>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center justify-center h-12 px-6 rounded-lg text-[#92adc9] font-bold text-base hover:bg-[#1f2937] transition-colors">
                Back
              </Link>
              <button
                onClick={handleContinue}
                className="flex items-center justify-center h-12 px-8 rounded-lg bg-primary text-white font-bold text-base shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
