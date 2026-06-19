import React from "react";
import { Link } from "react-router-dom";
import { Clock, Users, Coins } from "lucide-react";
import { EnhancedProject } from "../types";

interface CampaignCardProps {
  project: EnhancedProject;
}

export default function CampaignCard({ project }: CampaignCardProps) {
  const targetVal = Number(project.targetAmount) / 1000000;
  const raisedVal = Number(project.raisedAmount) / 1000000;
  
  // Calculate percentage
  const pct = Math.min(100, Math.floor((raisedVal / (targetVal || 1)) * 100));

  // Determine Badge Status
  let statusText = "Active Escrow";
  let statusClass = "bg-[#FFD700] text-black"; // Active Gold
  
  if (project.cancelled) {
    statusText = "Cancelled";
    statusClass = "bg-[#FF3B3B] text-white"; // Cancelled Red
  } else if (project.finalized) {
    statusText = "Funded & Transferred";
    statusClass = "bg-[#00FF88] text-black"; // Funded Green
  } else if (raisedVal >= targetVal) {
    statusText = "Fully Funded";
    statusClass = "bg-[#00FF88] text-black";
  }

  const finalStatusClass = `${statusClass} font-display font-extrabold text-[10px] tracking-wider px-3 py-1 rounded-full uppercase`;

  return (
    <div 
      id={`project-card-${project.id}`}
      className="arcmeta-card p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(255,215,0,0.5)] h-[440px]"
    >
      {/* CARD BODY */}
      <div className="space-y-4">
        {/* TOP META ROW */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#FFA500] tracking-widest uppercase flex items-center gap-1.5 font-bold">
            <Coins className="w-3.5 h-3.5 text-[#FFA500]" />
            <span>Escrow Token: {project.tokenSymbol}</span>
          </span>
          <span id={`status-badge-${project.id}`} className={finalStatusClass}>
            {statusText}
          </span>
        </div>

        {/* TITLE & TAGLINE */}
        <div className="space-y-1.5">
          <h3 className="text-xl font-display font-black text-[#FFD700] uppercase line-clamp-1 leading-tight select-none text-shadow-glow">
            {project.title}
          </h3>
          <p className="text-xs text-gray-300 font-sans line-clamp-3 leading-relaxed">
            {project.tagline}
          </p>
        </div>
      </div>

      {/* MID PANEL: METRICS */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        {/* PROGRESS */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-end text-xs font-mono">
            <span className="text-gray-400 uppercase text-[10px] font-bold">Progress</span>
            <span className="text-[#FFD700] font-black font-orbitron">{pct}%</span>
          </div>
          <div className="w-full bg-[rgba(255,215,0,0.15)] rounded-full h-2 overflow-hidden">
            <div 
              id={`progress-fill-${project.id}`}
              className="bg-[#FFD700] h-2 rounded-full transition-all duration-500 shadow-[0_0_8px_#FFD700]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* METRIC BOXES */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* RAISED */}
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
            <div className="text-[8.5px] uppercase font-mono text-[#FFA500] font-bold">Raised So Far</div>
            <div className="font-orbitron font-bold text-sm text-[#FFD700] pt-0.5">
              {raisedVal.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-[9px]">{project.tokenSymbol}</span>
            </div>
          </div>

          {/* GOAL */}
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
            <div className="text-[8.5px] uppercase font-mono text-[#FFA500] font-bold">Target Goal</div>
            <div className="font-orbitron font-bold text-sm text-[#00FF88] pt-0.5">
              {targetVal.toLocaleString()} <span className="text-[9px] text-gray-300">{project.tokenSymbol}</span>
            </div>
          </div>
        </div>

        {/* STATS FOOTER ROW */}
        <div className="flex items-center justify-between text-xs font-mono pt-1 text-gray-300">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-[#FFA500]" />
            <span className="font-orbitron text-[#FFA500] font-bold">{project.backers}</span>
            <span className="uppercase text-[9px] tracking-wider text-gray-400">Backers</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-[#FFD700]" />
            <span className="font-orbitron text-[#FFD700] font-bold">
              {project.cancelled ? "-" : project.daysLeft}
            </span>
            <span className="uppercase text-[9px] tracking-wider text-gray-400">Days Left</span>
          </div>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="pt-4 mt-auto">
        <Link 
          id={`view-escrow-btn-${project.id}`}
          to={`/project/${project.id}`} 
          className="arcmeta-btn-primary block w-full text-center py-2.5 rounded-xl text-xs tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] text-black"
        >
          Inspect Escrow Ledger
        </Link>
      </div>
    </div>
  );
}
