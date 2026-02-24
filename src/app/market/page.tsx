"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

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
  const difficulty = searchParams.get("difficulty") || "standard";

  const [selectedMarket, setSelectedMarket] = useState<string>("saas");
  const [customMarket, setCustomMarket] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyMission, setCompanyMission] = useState("");

  const handleContinue = () => {
    const name = companyName.trim() || "Unnamed Corp";
    const mission = companyMission.trim() || "To succeed in the market";
    const params = new URLSearchParams({
      difficulty,
      market: selectedMarket,
      ...(selectedMarket === "custom" && customMarket ? { customMarket } : {}),
      companyName: name,
      companyMission: mission,
    });
    router.push(`/company?${params.toString()}`);
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
              PorterAi
            </h2>
          </div>
        </header>

        <main className="flex flex-1 justify-center py-4 px-6 sm:px-10">
          <div className="flex flex-col w-full max-w-[960px]">
            {/* Progress Bar */}
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex justify-between items-center">
                <p className="text-white text-sm font-medium">
                  Step 2 of 3
                </p>
                <p className="text-[#92adc9] text-sm">
                  Company Setup
                </p>
              </div>
              <div className="rounded-full bg-[#324d67] h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: "66%" }}
                ></div>
              </div>
            </div>

            {/* Page Heading */}
            <div className="flex flex-col gap-2 mb-4">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Define Your Company
              </h1>
              <p className="text-[#92adc9] text-lg font-normal">
                Name your company, set its mission, and choose your market.
              </p>
            </div>

            {/* Company Name & Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#92adc9] mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., NovaTech, Apex Industries..."
                  className="w-full bg-[#1a2634] border-2 border-[#324d67] rounded-xl px-4 py-3 text-white placeholder:text-[#5f7a94] focus:border-primary focus:ring-1 focus:ring-primary transition-colors focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#92adc9] mb-2">
                  Company Mission
                </label>
                <input
                  type="text"
                  value={companyMission}
                  onChange={(e) => setCompanyMission(e.target.value)}
                  placeholder="e.g., Revolutionize how businesses manage their data..."
                  className="w-full bg-[#1a2634] border-2 border-[#324d67] rounded-xl px-4 py-3 text-white placeholder:text-[#5f7a94] focus:border-primary focus:ring-1 focus:ring-primary transition-colors focus:outline-none"
                />
              </div>
            </div>

            {/* Market Selection */}
            <div className="mb-6">
              <h2 className="text-white text-xl font-bold mb-4">
                Target Market
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Option 1: SaaS */}
                <label className="relative cursor-pointer group">
                  <input
                    className="peer sr-only"
                    name="market"
                    type="radio"
                    value="saas"
                    checked={selectedMarket === "saas"}
                    onChange={() => setSelectedMarket("saas")}
                  />
                  <div className="h-full flex flex-col justify-between p-4 rounded-xl border-2 border-[#324d67] bg-[#1a2634] peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-primary/50 transition-all duration-200 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-lg bg-primary/20 text-primary">
                        <span className="material-symbols-outlined text-3xl">
                          cloud
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                          Recommended
                        </span>
                        <div className="check-icon text-primary animate-in zoom-in duration-200">
                          <span className="material-symbols-outlined filled">
                            check_circle
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        SaaS
                      </h3>
                      <p className="text-sm text-[#92adc9]">
                        Software as a Service platforms
                      </p>
                    </div>
                  </div>
                </label>

                {/* Option 2: Automotive */}
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
                        <span className="material-symbols-outlined text-3xl">
                          directions_car
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-orange-900/30 px-2.5 py-0.5 text-xs font-medium text-orange-300 ring-1 ring-inset ring-orange-600/20">
                          Popular
                        </span>
                        <div className="check-icon text-primary animate-in zoom-in duration-200">
                          <span className="material-symbols-outlined filled">
                            check_circle
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        Automotive
                      </h3>
                      <p className="text-sm text-[#92adc9]">
                        Vehicle tech & transportation
                      </p>
                    </div>
                  </div>
                </label>

                {/* Option 3: Random */}
                <label className="relative cursor-pointer group">
                  <input
                    className="peer sr-only"
                    name="market"
                    type="radio"
                    value="random"
                    checked={selectedMarket === "random"}
                    onChange={() => setSelectedMarket("random")}
                  />
                  <div className="h-full flex flex-col justify-between p-4 rounded-xl border-2 border-[#324d67] bg-[#1a2634] peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-primary/50 transition-all duration-200 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                        <span className="material-symbols-outlined text-3xl">
                          shuffle
                        </span>
                      </div>
                      <div className="check-icon text-primary animate-in zoom-in duration-200">
                        <span className="material-symbols-outlined filled">
                          check_circle
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        Yolo Mode
                      </h3>
                      <p className="text-sm text-[#92adc9]">
                        Assign a random market
                      </p>
                    </div>
                  </div>
                </label>

                {/* Option 4: Custom Input */}
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
                        <span className="material-symbols-outlined text-3xl">
                          edit
                        </span>
                      </div>
                      <div className="check-icon text-primary animate-in zoom-in duration-200">
                        <span className="material-symbols-outlined filled">
                          check_circle
                        </span>
                      </div>
                    </div>
                    <div className="w-full mt-4">
                      <h3 className="text-xl font-bold text-white mb-3">
                        Custom Industry
                      </h3>
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
