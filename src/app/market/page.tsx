"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGame } from "@/context/GameContext";
import { MagneticButton } from "@/components/animations";
import { motion } from "framer-motion";
import PorterLogo from "@/components/PorterLogo";
import {
  CompanySize,
  CompanyExperience,
  Market,
  Difficulty,
} from "@/lib/types/game";
import { logger } from "@/lib/utils/logger";

// Yolo presets — randomize all fields from these
const YOLO_PRESETS: { name: string; mission: string; size: CompanySize; experience: CompanyExperience; market: Market; customMarket: string }[] = [
  // Tech
  { name: "NovaTech Innovations", mission: "Develop cutting-edge AI solutions to revolutionize everyday productivity", size: "medium", experience: "medium", market: "custom", customMarket: "Tech" },
  { name: "ByteBridge Solutions", mission: "Bridge the digital divide with secure, scalable cloud infrastructure for businesses", size: "large", experience: "old", market: "custom", customMarket: "Tech" },
  { name: "Quantum Robotics Inc.", mission: "Pioneer advanced robotics to automate industries and enhance human capabilities", size: "medium", experience: "new", market: "custom", customMarket: "Tech" },
  { name: "Apex Security Systems", mission: "Deliver robust cybersecurity tools to protect businesses from evolving threats", size: "small", experience: "medium", market: "custom", customMarket: "Tech" },
  { name: "InnovateSoft Ventures", mission: "Drive software innovation to solve complex problems and transform industries", size: "large", experience: "old", market: "custom", customMarket: "Tech" },
  // Automotive
  { name: "Apex AutoWorks", mission: "Build reliable, eco-friendly vehicles that empower global mobility", size: "large", experience: "old", market: "custom", customMarket: "Automotive" },
  { name: "Velocity Motors", mission: "Engineer high-performance electric vehicles for a sustainable future", size: "large", experience: "medium", market: "custom", customMarket: "Automotive" },
  { name: "TurboCharge Autos", mission: "Design affordable hybrid cars that combine speed, efficiency, and innovation", size: "medium", experience: "new", market: "custom", customMarket: "Automotive" },
  { name: "AutoNova", mission: "Build the smartest autonomous driving platform", size: "large", experience: "old", market: "custom", customMarket: "Automotive" },
  // Health
  { name: "VitalHealth Labs", mission: "Provide affordable telemedicine services to improve access to healthcare worldwide", size: "small", experience: "new", market: "custom", customMarket: "Health" },
  { name: "PureWellness Spa", mission: "Promote holistic wellness through natural therapies and personalized care", size: "small", experience: "old", market: "custom", customMarket: "Health" },
  { name: "BioTech Horizons", mission: "Advance biotechnology to cure diseases and extend healthy lifespans", size: "medium", experience: "new", market: "custom", customMarket: "Health" },
  { name: "VitalCore Fitness", mission: "Inspire active lifestyles through personalized fitness programs and community support", size: "large", experience: "old", market: "custom", customMarket: "Health" },
  { name: "MediTrack", mission: "Revolutionize patient data management worldwide", size: "medium", experience: "medium", market: "custom", customMarket: "Health" },
  // Fashion
  { name: "TrendForge Fashion", mission: "Create sustainable, stylish clothing that celebrates individuality and the environment", size: "medium", experience: "medium", market: "custom", customMarket: "Fashion" },
  { name: "StyleSphere Apparel", mission: "Design inclusive fashion that empowers self-expression across all body types", size: "medium", experience: "new", market: "custom", customMarket: "Fashion" },
  { name: "EcoFashion Collective", mission: "Lead the shift to eco-friendly fashion with recycled materials and ethical production", size: "medium", experience: "new", market: "custom", customMarket: "Fashion" },
  { name: "ThriveWear", mission: "Create sustainable fashion that performs", size: "small", experience: "new", market: "custom", customMarket: "Fashion" },
  // Food
  { name: "GreenHarvest Foods", mission: "Deliver organic, farm-fresh produce to promote healthy eating habits", size: "small", experience: "medium", market: "custom", customMarket: "Food" },
  { name: "Gourmet Global Eats", mission: "Bring authentic international cuisines to tables worldwide with ethical sourcing", size: "large", experience: "old", market: "custom", customMarket: "Food" },
  { name: "FreshBite Nutrition", mission: "Innovate nutritious snacks that make healthy living delicious and accessible", size: "large", experience: "old", market: "custom", customMarket: "Food" },
  { name: "FreshFleet", mission: "Revolutionize last-mile grocery delivery", size: "medium", experience: "new", market: "custom", customMarket: "Food & Logistics" },
  // Entertainment
  { name: "Elite Entertainment Group", mission: "Produce immersive media experiences that inspire creativity and connection", size: "medium", experience: "new", market: "custom", customMarket: "Entertainment" },
  { name: "DreamStream Media", mission: "Stream innovative content that entertains, educates, and unites global audiences", size: "medium", experience: "new", market: "custom", customMarket: "Entertainment" },
  { name: "PixelPlay Games", mission: "Create engaging video games that foster imagination and social interaction", size: "large", experience: "old", market: "custom", customMarket: "Entertainment" },
  { name: "Nexus Media Productions", mission: "Produce compelling stories that challenge perspectives and spark conversations", size: "small", experience: "medium", market: "custom", customMarket: "Entertainment" },
  { name: "SoundHive", mission: "Connect independent musicians to global audiences", size: "small", experience: "new", market: "custom", customMarket: "Music & Entertainment" },
  // Finance
  { name: "SecureFinance Advisors", mission: "Offer trusted financial guidance to help clients achieve long-term wealth security", size: "large", experience: "old", market: "custom", customMarket: "Finance" },
  { name: "WealthGuard Investments", mission: "Safeguard investments with transparent, tech-driven strategies for all investors", size: "small", experience: "medium", market: "custom", customMarket: "Finance" },
  { name: "CapitalEdge Banking", mission: "Provide modern banking services that empower financial independence for everyone", size: "medium", experience: "new", market: "custom", customMarket: "Finance" },
  { name: "FinEdge", mission: "Make investing accessible to everyone", size: "medium", experience: "medium", market: "custom", customMarket: "Finance" },
  // Construction
  { name: "EcoBuild Construction", mission: "Construct energy-efficient buildings that harmonize with nature and communities", size: "small", experience: "medium", market: "custom", customMarket: "Construction" },
  { name: "UrbanRenew Developers", mission: "Revitalize urban spaces with innovative, community-focused development projects", size: "large", experience: "old", market: "custom", customMarket: "Construction" },
  { name: "Horizon Builders", mission: "Build resilient structures that stand the test of time and adapt to future needs", size: "small", experience: "medium", market: "custom", customMarket: "Construction" },
  { name: "TerraBlox", mission: "Build modular eco-friendly housing at scale", size: "large", experience: "medium", market: "custom", customMarket: "Construction" },
  // Energy
  { name: "SolarVolt", mission: "Democratize clean energy for every household", size: "small", experience: "new", market: "custom", customMarket: "Energy" },
  // AgriTech
  { name: "AgroSense", mission: "Optimize crop yields with AI-driven insights", size: "medium", experience: "medium", market: "custom", customMarket: "AgriTech" },
  // Travel & Hospitality
  { name: "CloudNine Travel", mission: "Curate unforgettable travel experiences", size: "large", experience: "old", market: "custom", customMarket: "Travel & Hospitality" },
  // EdTech
  { name: "ByteLearn", mission: "Personalize education through adaptive AI", size: "small", experience: "new", market: "custom", customMarket: "EdTech" },
  // Manufacturing
  { name: "IronForge Steel", mission: "Supply the strongest industrial-grade materials", size: "large", experience: "old", market: "custom", customMarket: "Manufacturing" },
  // Real Estate
  { name: "UrbanNest", mission: "Reinvent affordable urban co-living spaces", size: "medium", experience: "medium", market: "custom", customMarket: "Real Estate" },
  // Sports Equipment
  { name: "VeloRush", mission: "Design the fastest carbon-fiber bicycles", size: "small", experience: "medium", market: "custom", customMarket: "Sports Equipment" },
  // Pharmaceuticals
  { name: "NexGen Pharma", mission: "Accelerate drug discovery with machine learning", size: "large", experience: "old", market: "custom", customMarket: "Pharmaceuticals" },
  // Beauty & Cosmetics
  { name: "PureBloom", mission: "Deliver organic skincare backed by science", size: "small", experience: "new", market: "custom", customMarket: "Beauty & Cosmetics" },
  // Cybersecurity
  { name: "DataShield", mission: "Protect businesses from next-gen cyber threats", size: "medium", experience: "medium", market: "custom", customMarket: "Cybersecurity" },
  // Logistics
  { name: "SwiftDrive Logistics", mission: "Optimize supply chains with efficient, reliable delivery solutions worldwide", size: "small", experience: "medium", market: "custom", customMarket: "Logistics" },
  { name: "CargoDrift", mission: "Streamline international freight operations", size: "large", experience: "old", market: "custom", customMarket: "Shipping & Logistics" },
  // Pet Care
  { name: "PetPulse", mission: "Improve pet health through connected devices", size: "small", experience: "new", market: "custom", customMarket: "Pet Care" },
  // Fitness & Wellness
  { name: "LunaFit", mission: "Empower women's wellness through smart wearables", size: "small", experience: "medium", market: "custom", customMarket: "Fitness & Wellness" },
  // Data Analytics
  { name: "DataForge Analytics", mission: "Harness big data to provide actionable insights for smarter decision-making", size: "small", experience: "medium", market: "custom", customMarket: "Tech" },
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
    <Suspense fallback={<div className="flex min-h-screen" />}>
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
      logger.error("Failed to initialize game:", error);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden text-white">
      {/* Loading Overlay */}
      {isInitializing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f14]/90 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-white text-lg font-bold font-heading">Initializing Simulation</p>
            <p className="text-[#92adc9] text-sm">Generating market landscape and competitors...</p>
          </div>
        </div>
      )}

      <div className="flex h-full grow flex-col">
        {/* Top Navigation */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-white/[0.04] px-4 sm:px-10 py-3">
          <Link href="/onboarding" className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span className="text-[13px] font-medium">porter.ai</span>
          </Link>
          <span className="text-white/20 text-[12px] font-medium">Company setup</span>
        </header>

        <main className="flex flex-1 justify-center py-8 px-6 sm:px-10">
          <div className="flex flex-col w-full max-w-[960px]">
            {/* Progress Bar */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex justify-between items-center">
                <p className="text-white text-sm font-medium">Step 2 of 2</p>
                <p className="text-[#92adc9] text-sm">Company Setup</p>
              </div>
              <div className="rounded-full bg-white/[0.06] h-2 overflow-hidden">
                <motion.div className="h-full rounded-full bg-primary" initial={{ width: "0%" }} animate={{ width: "50%" }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }} />
              </div>
            </div>

            {/* Page Heading */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center justify-between">
                <h1 className="text-white text-4xl font-bold font-heading leading-tight tracking-[-0.02em]">
                  Set Up Your Company
                </h1>
                <button
                  onClick={handleYolo}
                  disabled={isInitializing}
                  className="flex items-center justify-center gap-2 h-10 px-5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-purple-300 font-bold text-sm hover:bg-white/[0.06] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">casino</span>
                  Random
                </button>
              </div>
              <p className="text-[#92adc9] text-lg font-normal">
                Define your company&apos;s identity, size, experience, and market.
              </p>
            </div>

            {/* Company Name & Target Market */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#92adc9] mb-2">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., NovaTech, Apex Industries..."
                  className="glass-input w-full rounded-xl px-4 py-3 text-white placeholder:text-[#5f7a94] focus:outline-none focus:shadow-[0_0_20px_rgba(19,127,236,0.08)] transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#92adc9] mb-2">Target Market</label>
                <input
                  type="text"
                  value={customMarket}
                  onChange={(e) => setCustomMarket(e.target.value)}
                  placeholder="e.g., Automotive, HealthTech, Fashion,..."
                  className="glass-input w-full rounded-xl px-4 py-3 text-white placeholder:text-[#5f7a94] focus:outline-none focus:shadow-[0_0_20px_rgba(19,127,236,0.08)] transition-all duration-300"
                />
              </div>
            </div>

            {/* Mission */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#92adc9] mb-2">Mission</label>
              <input
                type="text"
                value={companyMission}
                onChange={(e) => setCompanyMission(e.target.value)}
                placeholder="e.g., Make the fastest, most exclusive designed cars..."
                className="glass-input w-full rounded-xl px-4 py-3 text-white placeholder:text-[#5f7a94] focus:outline-none focus:shadow-[0_0_20px_rgba(19,127,236,0.08)] transition-all duration-300"
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
                    <div className="flex flex-col items-center gap-1 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] peer-checked:border-primary/40 peer-checked:shadow-[0_0_20px_rgba(19,127,236,0.08)] hover:border-white/[0.12] transition-all duration-200 text-center">
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
                    <div className="flex flex-col items-center gap-1 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] peer-checked:border-primary/40 peer-checked:shadow-[0_0_20px_rgba(19,127,236,0.08)] hover:border-white/[0.12] transition-all duration-200 text-center">
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
                className="flex items-center justify-center h-12 px-6 rounded-lg text-[#92adc9] font-bold text-base hover:bg-white/[0.04] transition-colors"
              >
                Back
              </Link>
              <MagneticButton>
                <button
                  onClick={handleFinalize}
                  disabled={isInitializing}
                  className="btn-glow flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-xl">play_arrow</span>
                  Begin Simulation
                </button>
              </MagneticButton>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
