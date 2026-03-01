"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGame } from "@/context/GameContext";
import {
  CompanySize,
  CompanyExperience,
  Market,
  Difficulty,
} from "@/lib/types/game";

// Yolo presets — randomize all fields from these
const YOLO_PRESETS: { name: string; mission: string; size: CompanySize; experience: CompanyExperience; market: Market; customMarket: string }[] = [
  { name: "SpeedStitch", mission: "Make fast fashion faster and guilt-free", size: "small", experience: "new", market: "custom", customMarket: "Fashion" },
  { name: "VelvetHive", mission: "Curate luxury experiences for the discerning few", size: "medium", experience: "medium", market: "custom", customMarket: "Luxury Fashion" },
  { name: "TitanMotors", mission: "Build the trucks that build America", size: "large", experience: "old", market: "custom", customMarket: "Automotive" },
  { name: "Nexadrive", mission: "Electrify the last mile of urban delivery", size: "small", experience: "new", market: "custom", customMarket: "Electric Vehicles" },
  { name: "OrbitX Labs", mission: "Make space logistics affordable for every nation", size: "small", experience: "new", market: "custom", customMarket: "Space Logistics" },
  { name: "NovaPharma", mission: "Democratize precision medicine through AI-driven drug discovery", size: "medium", experience: "medium", market: "custom", customMarket: "Pharmaceuticals" },
  { name: "DeepHarvest", mission: "Feed the world with vertical farming at industrial scale", size: "medium", experience: "new", market: "custom", customMarket: "AgriTech" },
  { name: "Arcadia Resorts", mission: "Reinvent hospitality for the remote-work generation", size: "large", experience: "old", market: "custom", customMarket: "Hospitality" },
  { name: "Synwave Energy", mission: "Replace every coal plant with fusion before 2040", size: "large", experience: "medium", market: "custom", customMarket: "Energy" },
  { name: "PixelForge", mission: "Build the game engine that makes AAA accessible to indie studios", size: "small", experience: "medium", market: "custom", customMarket: "Video Games" },
  { name: "MedVault", mission: "Own the future of decentralized health records", size: "medium", experience: "new", market: "custom", customMarket: "HealthTech" },
  { name: "TerraFreight", mission: "Dominate autonomous freight across three continents", size: "large", experience: "old", market: "custom", customMarket: "Logistics & Shipping" },
];

const SIZE_OPTIONS: { value: CompanySize; label: string; description: string }[] = [
  { value: "small", label: "Small", description: "Startup / Small team" },
  { value: "medium", label: "Medium", description: "Mid-market company" },
  { value: "large", label: "Large", description: "Enterprise / Corporation" },
];

const EXPERIENCE_OPTIONS: { value: CompanyExperience; label: string; description: string }[] = [
  { value: "new", label: "New", description: "Just entering the market" },
  { value: "medium", label: "Established", description: "A few years of history" },
  { value: "old", label: "Veteran", description: "Decades of operations" },
];

export default function CompanySetupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-[#101922]" />}>
      <CompanySetupContent />
    </Suspense>
  );
}

function CompanySetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const difficulty = (searchParams.get("difficulty") || "standard") as Difficulty;
  const { initializeGame, isInitializing } = useGame();

  const [companyName, setCompanyName] = useState("");
  const [companyMission, setCompanyMission] = useState("");
  const [selectedSize, setSelectedSize] = useState<CompanySize>("medium");
  const [selectedExperience, setSelectedExperience] = useState<CompanyExperience>("medium");
  const [customMarket, setCustomMarket] = useState("");

  const handleYolo = () => {
    const preset = YOLO_PRESETS[Math.floor(Math.random() * YOLO_PRESETS.length)];
    setCompanyName(preset.name);
    setCompanyMission(preset.mission);
    setSelectedSize(preset.size);
    setSelectedExperience(preset.experience);
    setCustomMarket(preset.customMarket);
  };

  const handleFinalize = async () => {
    try {
      const name = companyName.trim() || "Unnamed Corp";
      const mission = companyMission.trim() || "To succeed in the market";
      const market = "custom" as Market;
      const custom = customMarket || undefined;

      await initializeGame(difficulty, market, custom, selectedSize, selectedExperience, name, mission);
      router.push("/briefing");
    } catch (error) {
      console.error("Failed to initialize game:", error);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#101922] overflow-x-hidden text-white">
      {/* Loading Overlay */}
      {isInitializing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101922]/90 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-white text-lg font-bold">Initializing Simulation</p>
            <p className="text-[#92adc9] text-sm">Generating market landscape and competitors...</p>
          </div>
        </div>
      )}

      <div className="flex h-full grow flex-col">
        {/* Top Navigation */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#233648] px-4 sm:px-10 py-3 bg-[#111a22]">
          <div className="flex items-center gap-4 text-white">
            <div className="size-8 flex items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined text-xl">rocket_launch</span>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">PorterAi</h2>
          </div>
        </header>

        <main className="flex flex-1 justify-center py-8 px-6 sm:px-10">
          <div className="flex flex-col w-full max-w-[960px]">
            {/* Progress Bar */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex justify-between items-center">
                <p className="text-white text-sm font-medium">Step 2 of 2</p>
                <p className="text-[#92adc9] text-sm">Company Setup</p>
              </div>
              <div className="rounded-full bg-[#324d67] h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: "50%" }}
                ></div>
              </div>
            </div>

            {/* Page Heading */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center justify-between">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                  Set Up Your Company
                </h1>
                <button
                  onClick={handleYolo}
                  disabled={isInitializing}
                  className="flex items-center justify-center gap-2 h-10 px-5 rounded-lg border-2 border-purple-500/50 text-purple-300 font-bold text-sm hover:bg-purple-500/10 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">casino</span>
                  Random
                </button>
              </div>
              <p className="text-[#92adc9] text-lg font-normal">
                Define your company&apos;s identity, size, experience, and market.
              </p>
            </div>

            {/* Company Name & Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#92adc9] mb-2">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., NovaTech, Apex Industries..."
                  className="w-full bg-[#1a2634] border-2 border-[#324d67] rounded-xl px-4 py-3 text-white placeholder:text-[#5f7a94] focus:border-primary focus:ring-1 focus:ring-primary transition-colors focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#92adc9] mb-2">Mission / Vision</label>
                <input
                  type="text"
                  value={companyMission}
                  onChange={(e) => setCompanyMission(e.target.value)}
                  placeholder="e.g., Make the fastest, most exclusive designed cars..."
                  className="w-full bg-[#1a2634] border-2 border-[#324d67] rounded-xl px-4 py-3 text-white placeholder:text-[#5f7a94] focus:border-primary focus:ring-1 focus:ring-primary transition-colors focus:outline-none"
                />
              </div>
            </div>

            {/* Target Market */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#92adc9] mb-2">Target Market</label>
              <input
                type="text"
                value={customMarket}
                onChange={(e) => setCustomMarket(e.target.value)}
                placeholder="e.g., Automotive, HealthTech, Fashion,..."
                className="w-full bg-[#1a2634] border-2 border-[#324d67] rounded-xl px-4 py-3 text-white placeholder:text-[#5f7a94] focus:border-primary focus:ring-1 focus:ring-primary transition-colors focus:outline-none"
              />
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#92adc9] mb-2">Company Size</label>
              <div className="grid grid-cols-3 gap-3">
                {SIZE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="relative cursor-pointer">
                    <input
                      className="peer sr-only"
                      name="size"
                      type="radio"
                      value={opt.value}
                      checked={selectedSize === opt.value}
                      onChange={() => setSelectedSize(opt.value)}
                    />
                    <div className="flex flex-col items-center gap-1 p-4 rounded-xl border-2 border-[#324d67] bg-[#1a2634] peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-primary/50 transition-all duration-200 text-center">
                      <span className="text-base font-bold text-white">{opt.label}</span>
                      <span className="text-xs text-[#92adc9]">{opt.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#92adc9] mb-2">Company Experience</label>
              <div className="grid grid-cols-3 gap-3">
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="relative cursor-pointer">
                    <input
                      className="peer sr-only"
                      name="experience"
                      type="radio"
                      value={opt.value}
                      checked={selectedExperience === opt.value}
                      onChange={() => setSelectedExperience(opt.value)}
                    />
                    <div className="flex flex-col items-center gap-1 p-4 rounded-xl border-2 border-[#324d67] bg-[#1a2634] peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-primary/50 transition-all duration-200 text-center">
                      <span className="text-base font-bold text-white">{opt.label}</span>
                      <span className="text-xs text-[#92adc9]">{opt.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between">
              <Link
                href="/onboarding"
                className="flex items-center justify-center h-12 px-6 rounded-lg text-[#92adc9] font-bold text-base hover:bg-[#1f2937] transition-colors"
              >
                Back
              </Link>
              <button
                onClick={handleFinalize}
                disabled={isInitializing}
                className="flex items-center justify-center gap-2 h-12 px-8 rounded-lg bg-primary text-white font-bold text-base shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-xl">play_arrow</span>
                Begin Simulation
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
