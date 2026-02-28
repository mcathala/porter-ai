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
  SIZE_EXPERIENCE_KPIS,
} from "@/lib/types/game";

// Yolo presets — randomize all fields from these
const YOLO_PRESETS: { name: string; mission: string; size: CompanySize; experience: CompanyExperience; market: Market; customMarket?: string }[] = [
  // Fashion (2)
  { name: "SpeedStitch", mission: "Make fast fashion faster and guilt-free", size: "small", experience: "new", market: "fashion" },
  { name: "VelvetHive", mission: "Curate luxury experiences for the discerning few", size: "medium", experience: "medium", market: "fashion" },
  // Automotive (2)
  { name: "TitanMotors", mission: "Build the trucks that build America", size: "large", experience: "old", market: "automotive" },
  { name: "Nexadrive", mission: "Electrify the last mile of urban delivery", size: "small", experience: "new", market: "automotive" },
  // Custom industries (8)
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
  const [selectedMarket, setSelectedMarket] = useState<Market>("fashion");
  const [customMarket, setCustomMarket] = useState("");

  const previewKpis = SIZE_EXPERIENCE_KPIS[selectedSize][selectedExperience];

  const formatCurrency = (value: number): string => {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
    return `$${value.toFixed(0)}`;
  };

  const handleYolo = () => {
    const preset = YOLO_PRESETS[Math.floor(Math.random() * YOLO_PRESETS.length)];
    setCompanyName(preset.name);
    setCompanyMission(preset.mission);
    setSelectedSize(preset.size);
    setSelectedExperience(preset.experience);
    setSelectedMarket(preset.market);
    setCustomMarket(preset.customMarket || "");
  };

  const handleFinalize = async () => {
    try {
      const name = companyName.trim() || "Unnamed Corp";
      const mission = companyMission.trim() || "To succeed in the market";
      const market = selectedMarket;
      const custom = selectedMarket === "custom" ? customMarket : undefined;

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

        <main className="flex flex-1 justify-center py-4 px-6 sm:px-10">
          <div className="flex flex-col w-full max-w-[960px]">
            {/* Progress Bar */}
            <div className="flex flex-col gap-3 mb-4">
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
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Set Up Your Company
              </h1>
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
                  placeholder="e.g., Revolutionize sustainable fashion..."
                  className="w-full bg-[#1a2634] border-2 border-[#324d67] rounded-xl px-4 py-3 text-white placeholder:text-[#5f7a94] focus:border-primary focus:ring-1 focus:ring-primary transition-colors focus:outline-none"
                />
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h2 className="text-white text-xl font-bold mb-3">Company Size</h2>
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
              <h2 className="text-white text-xl font-bold mb-3">Company Experience</h2>
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

            {/* Market Selection */}
            <div className="mb-6">
              <h2 className="text-white text-xl font-bold mb-3">Target Market</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Fashion */}
                <label className="relative cursor-pointer group">
                  <input
                    className="peer sr-only"
                    name="market"
                    type="radio"
                    value="fashion"
                    checked={selectedMarket === "fashion"}
                    onChange={() => setSelectedMarket("fashion")}
                  />
                  <div className="h-full flex flex-col justify-between p-4 rounded-xl border-2 border-[#324d67] bg-[#1a2634] peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-primary/50 transition-all duration-200 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-lg bg-pink-500/20 text-pink-400">
                        <span className="material-symbols-outlined text-3xl">checkroom</span>
                      </div>
                      <div className="check-icon text-primary animate-in zoom-in duration-200">
                        <span className="material-symbols-outlined filled">check_circle</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-white mb-1">Fashion</h3>
                      <p className="text-sm text-[#92adc9]">Clothing, accessories & lifestyle</p>
                    </div>
                  </div>
                </label>

                {/* Automotive */}
                <label className="relative cursor-pointer group">
                  <input
                    className="peer sr-only"
                    name="market"
                    type="radio"
                    value="automotive"
                    checked={selectedMarket === "automotive"}
                    onChange={() => setSelectedMarket("automotive")}
                  />
                  <div className="h-full flex flex-col justify-between p-4 rounded-xl border-2 border-[#324d67] bg-[#1a2634] peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-primary/50 transition-all duration-200 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-lg bg-orange-500/20 text-orange-400">
                        <span className="material-symbols-outlined text-3xl">directions_car</span>
                      </div>
                      <div className="check-icon text-primary animate-in zoom-in duration-200">
                        <span className="material-symbols-outlined filled">check_circle</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-white mb-1">Automotive</h3>
                      <p className="text-sm text-[#92adc9]">Vehicle tech & transportation</p>
                    </div>
                  </div>
                </label>

                {/* Custom */}
                <label className="relative cursor-pointer group">
                  <input
                    className="peer sr-only"
                    name="market"
                    type="radio"
                    value="custom"
                    checked={selectedMarket === "custom"}
                    onChange={() => setSelectedMarket("custom")}
                  />
                  <div className="h-full flex flex-col justify-between p-4 rounded-xl border-2 border-[#324d67] bg-[#1a2634] peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-primary/50 transition-all duration-200 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-lg bg-slate-500/20 text-slate-300">
                        <span className="material-symbols-outlined text-3xl">edit</span>
                      </div>
                      <div className="check-icon text-primary animate-in zoom-in duration-200">
                        <span className="material-symbols-outlined filled">check_circle</span>
                      </div>
                    </div>
                    <div className="w-full mt-4">
                      <h3 className="text-xl font-bold text-white mb-3">Custom Industry</h3>
                      <input
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMarket("custom");
                        }}
                        value={customMarket}
                        onChange={(e) => setCustomMarket(e.target.value)}
                        className="w-full bg-transparent border-0 border-b-2 border-[#324d67] px-0 py-2 text-white placeholder:text-[#5f7a94] focus:border-primary focus:ring-0 transition-colors focus:outline-hidden"
                        placeholder="Type your industry..."
                        type="text"
                      />
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Live KPI Preview */}
            <div className="mb-6">
              <h2 className="text-white text-xl font-bold mb-3">Starting Position</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-[#1a2634] border border-[#233648] p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-lg">payments</span>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Cash</p>
                  </div>
                  <p className="text-xl font-black text-white mt-1">{formatCurrency(previewKpis.cash)}</p>
                </div>
                <div className="rounded-xl bg-[#1a2634] border border-[#233648] p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-400 text-lg">pie_chart</span>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Market Share</p>
                  </div>
                  <p className="text-xl font-black text-white mt-1">{previewKpis.marketShare}%</p>
                </div>
                <div className="rounded-xl bg-[#1a2634] border border-[#233648] p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400 text-lg">sentiment_satisfied</span>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Satisfaction</p>
                  </div>
                  <p className="text-xl font-black text-white mt-1">{previewKpis.satisfaction}%</p>
                </div>
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
              <div className="flex items-center gap-3">
                <button
                  onClick={handleYolo}
                  disabled={isInitializing}
                  className="flex items-center justify-center gap-2 h-12 px-6 rounded-lg border-2 border-purple-500/50 text-purple-300 font-bold text-base hover:bg-purple-500/10 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-xl">casino</span>
                  Random
                </button>
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
          </div>
        </main>
      </div>
    </div>
  );
}
