import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useArcMeta } from "../contexts/ProjectContext";
import CampaignCard from "../components/CampaignCard";
import { Search, SlidersHorizontal, Activity, HelpCircle } from "lucide-react";

export default function Home() {
  const { 
    projects, 
    totalProjects, 
    totalBackers, 
    totalRaisedUSDC, 
    totalRaisedEURC, 
    isContractLoading 
  } = useArcMeta();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedToken, setSelectedToken] = useState<"ALL" | "USDC" | "EURC">("ALL");

  // Filter Campaign Listings
  const filtered = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesToken = selectedToken === "ALL" || p.tokenSymbol === selectedToken;
    return matchesSearch && matchesToken;
  });

  return (
    <div id="home-container" className="space-y-12 animate-[fadeIn_0.4s_ease-out]">
      {/* 1. HERO HEADER BANNER */}
      <section id="hero-banner" className="text-center space-y-4 max-w-4xl mx-auto py-6">
        <span className="px-3.5 py-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-xs font-mono font-bold uppercase tracking-widest text-[#FFD700]">
          🔩 Mechanical Crowdfunding Escrow v2
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-[#FFD700] uppercase text-center leading-none text-shadow-glow">
          CROWDFUND THE WORLD'S NEXT <br/>
          <span className="arcmeta-gradient-text">MECHANICAL MASTERPIECE</span>
        </h1>
        <p className="text-gray-300 font-sans text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          ArcMeta pledges hardware designs into decentralized escrows on-chain. Zero financial fraud, complete manufacturing tracking, and milestone-bound token releases.
        </p>
        <div className="flex justify-center gap-4 pt-3">
          <Link
            id="hero-create-btn"
            to="/create"
            className="arcmeta-btn-primary px-8 py-3 rounded-xl text-xs flex items-center gap-2"
          >
            Submit Custom Blueprint
          </Link>
          <a
            href="#stats-section"
            className="arcmeta-btn-secondary px-8 py-3 rounded-xl text-xs flex items-center justify-center"
          >
            Explore Ledgers
          </a>
        </div>
      </section>

      {/* 2. STATS BAR SECTION */}
      <section 
        id="stats-section" 
        className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 rounded-[24px] bg-black/40 border-2 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.25)]"
      >
        {/* STAT 1 */}
        <div className="text-center md:border-r border-white/5 space-y-1 py-1.5">
          <div className="text-[10px] font-mono font-bold text-[#FFA500] uppercase tracking-wider">
            Total Projects Broadcasted
          </div>
          <div className="text-3xl font-black font-orbitron text-[#FFD700]">
            {isContractLoading ? "..." : totalProjects}
          </div>
        </div>

        {/* STAT 2 */}
        <div className="text-center md:border-r border-white/5 space-y-1 py-1.5">
          <div className="text-[10px] font-mono font-bold text-[#FFA500] uppercase tracking-wider">
            Active Backer Pledges
          </div>
          <div className="text-3xl font-black font-orbitron text-[#FFD700]">
            {isContractLoading ? "..." : totalBackers}
          </div>
        </div>

        {/* STAT 3 */}
        <div className="text-center md:border-r border-white/5 space-y-1 py-1.5">
          <div className="text-[10px] font-mono font-bold text-[#FFA500] uppercase tracking-wider">
            Cumulative USDC Escrowed
          </div>
          <div className="text-3xl font-black font-orbitron text-[#FFD700]">
            ${isContractLoading ? "..." : totalRaisedUSDC.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>

        {/* STAT 4 */}
        <div className="text-center space-y-1 py-1.5">
          <div className="text-[10px] font-mono font-bold text-[#FFA500] uppercase tracking-wider">
            Cumulative EURC Escrowed
          </div>
          <div className="text-3xl font-black font-orbitron text-[#FFD700]">
            €{isContractLoading ? "..." : totalRaisedEURC.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      </section>

      {/* 3. CAMPAIGN FILTER & SEARCH CONTROLS */}
      <section id="campaign-controls" className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
        {/* Left Side: Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFA500]" />
          <input
            id="campaign-search"
            type="text"
            placeholder="Search blueprints by timepiece, engine, hydraulic pump..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0800] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-[#FFD700] transition-all"
          />
        </div>

        {/* Right Side: Token Type Filter Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono text-[#FFEC8B] font-bold">Stable Token:</span>
          {["ALL", "USDC", "EURC"].map((tok) => (
            <button
              key={tok}
              onClick={() => setSelectedToken(tok as any)}
              className={`px-3 py-1.5 text-[10px] font-display uppercase tracking-wider font-bold rounded-lg border transition-all cursor-pointer ${
                selectedToken === tok
                  ? "bg-[#FFD700] border-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.6)]"
                  : "bg-[#0A0800] border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {tok}
            </button>
          ))}
        </div>
      </section>

      {/* 4. LISTING CAMPAIGN GRID */}
      <section id="campaign-list" className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h2 className="text-xl font-display font-black text-[#FFD700] uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#FFD700]" />
            <span>Active Mechanical Ledgers ({filtered.length})</span>
          </h2>
          <span className="text-xs text-gray-400 font-mono">
            Direct Contract Interingress Protocol Secured
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project) => (
              <CampaignCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 rounded-3xl border border-dashed border-white/10 bg-black/10">
            <SlidersHorizontal className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-mono">
              No campaign matching your mechanical query found. Get backing!
            </p>
          </div>
        )}
      </section>

      {/* 5. USER INFORMATION FOOTER */}
      <footer id="dashboard-footer" className="p-6 rounded-2xl bg-black/40 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono text-gray-400">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#FFD700]" />
          <span>How on-chain escrows protect backers:</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <span className="bg-[#FFD700]/10 border border-[#FFD700]/20 px-2.5 py-1 rounded text-white font-bold">1. Mainspring Escrow Approved</span>
          <span className="bg-[#FFD700]/10 border border-[#FFD700]/20 px-2.5 py-1 rounded text-white font-bold">2. Milestone Released Sequentially</span>
          <span className="bg-[#FFD700]/10 border border-[#FFD700]/20 px-2.5 py-1 rounded text-white font-bold">3. Capital Refund Instantly Available</span>
        </div>
      </footer>
    </div>
  );
}
