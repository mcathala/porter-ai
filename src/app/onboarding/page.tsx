"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FadeUp, MagneticButton, StaggerText } from "@/components/animations";
import { motion } from "framer-motion";
import PorterLogo from "@/components/PorterLogo";

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("standard");

  const handleContinue = () => {
    router.push(`/market?difficulty=${selected}`);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden text-white">
      <div className="flex h-full grow flex-col">
        {/* Top Navigation */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-white/[0.04] px-4 sm:px-10 py-3">
          <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span className="text-[13px] font-medium">porter.ai</span>
          </Link>
          <span className="text-white/20 text-[12px] font-medium">New game</span>
        </header>

        <main className="flex flex-1 justify-center py-8 px-6 sm:px-10">
          <FadeUp className="flex flex-col w-full max-w-[960px]">
            {/* Progress Bar Section */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex justify-between items-center">
                <p className="text-white text-sm font-medium">
                  Step 1 of 2
                </p>
                <p className="text-[#92adc9] text-sm">
                  Configuration
                </p>
              </div>
              <div className="rounded-full bg-white/[0.06] h-2 overflow-hidden">
                <motion.div className="h-full rounded-full bg-primary" initial={{ width: "0%" }} animate={{ width: "0%" }} transition={{ duration: 0.8, ease: "easeOut" }} />
              </div>
            </div>

            {/* Page Heading */}
            <div className="flex flex-col gap-2 mb-8">
              <h1 className="text-white text-4xl font-bold font-heading leading-tight tracking-[-0.02em]">
                <StaggerText text="Select Your Challenge Level" />
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
                <div className="h-full flex flex-col gap-4 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl peer-checked:border-primary/40 peer-checked:shadow-[0_0_20px_rgba(19,127,236,0.08)] hover:border-white/[0.12] transition-all duration-200 shadow-sm hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:scale-[1.01] relative">
                  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
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
                    <h3 className="text-white text-xl font-bold font-heading mb-2">
                      Easy
                    </h3>
                    <p className="text-[#92adc9] text-sm leading-relaxed">
                      Sandbox mode. Actions tend to succeed, the market responds easily, and regulation is minimal.
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/[0.06]">
                    <span className="inline-flex items-center text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded">
                      Sandbox
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
                <div className="h-full flex flex-col gap-4 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl peer-checked:border-primary/40 peer-checked:shadow-[0_0_20px_rgba(19,127,236,0.08)] hover:border-white/[0.12] transition-all duration-200 shadow-sm hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:scale-[1.01] relative">
                  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
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
                    <h3 className="text-white text-xl font-bold font-heading mb-2">
                      Standard
                    </h3>
                    <p className="text-[#92adc9] text-sm leading-relaxed">
                      Balanced experience. Actions sometimes have unexpected outcomes, with moderate market inertia and occasional regulation.
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/[0.06]">
                    <span className="inline-flex items-center text-xs font-semibold text-primary bg-blue-500/10 px-2 py-1 rounded">
                      Balanced
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
                <div className="h-full flex flex-col gap-4 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl peer-checked:border-primary/40 peer-checked:shadow-[0_0_20px_rgba(19,127,236,0.08)] hover:border-white/[0.12] transition-all duration-200 shadow-sm hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:scale-[1.01] relative">
                  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
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
                    <h3 className="text-white text-xl font-bold font-heading mb-2">
                      Hard
                    </h3>
                    <p className="text-[#92adc9] text-sm leading-relaxed">
                      Realistic simulation. Plans rarely go as expected, the market resists change, and regulation actively shapes your strategy.
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/[0.06]">
                    <span className="inline-flex items-center text-xs font-semibold text-orange-400 bg-orange-500/10 px-2 py-1 rounded">
                      Realistic
                    </span>
                  </div>
                </div>
              </label>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center justify-center h-12 px-6 rounded-lg text-[#92adc9] font-bold text-base hover:bg-white/[0.04] transition-colors border border-white/[0.06] hover:border-white/[0.12]">
                Back
              </Link>
              <MagneticButton href={`/market?difficulty=${selected}`}>
                <div className="btn-glow flex items-center justify-center h-12 px-8 rounded-xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Continue
                </div>
              </MagneticButton>
            </div>
          </FadeUp>
        </main>
      </div>
    </div>
  );
}
