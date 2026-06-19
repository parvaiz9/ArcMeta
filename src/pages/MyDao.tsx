import React, { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { LogIn, Users } from "lucide-react";

export default function MyDao() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const [userData, setUserData] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);

  // Clear all useState on disconnect, fetch fresh on connect
  useEffect(() => {
    if (!isConnected) {
      setUserData([]);
      setUserStats(null);
    } else if (address) {
      // Fetch dynamic DAO proposals and voting stats specific to this address
      const mockProposals = [
        { id: "DAO-12", title: "Approve Neuchâtel Tourbillon Milestone", vote: "YEA", power: "450 AMETA", status: "EXECUTED" },
        { id: "DAO-14", title: "Helix Pump Manganese Mold Funding", vote: "YEA", power: "450 AMETA", status: "PASSED" },
        { id: "DAO-15", title: "Stirling Engine Escrow Penalty Release", vote: "NAY", power: "450 AMETA", status: "FAILED" }
      ];
      setUserData(mockProposals);
      setUserStats({ votingPower: "450 AMETA", proposalsVoted: mockProposals.length });
    }
  }, [isConnected, address]);

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div id="my-dao-view" className="space-y-10 animate-[fadeIn_0.3s_ease-out]">
      {/* HEADER SECTION */}
      <div className="border-b border-white/5 pb-4 space-y-2">
        <h1 className="text-3xl font-display font-black text-[#FFD700] uppercase tracking-wider text-shadow-glow">
          MY DAO ESCROW VOTING
        </h1>
        <p className="text-xs text-gray-400 font-mono">
          Governing rights assigned to: <span className="text-[#FFA500] select-all font-bold">{isConnected && address ? truncateAddress(address) : "No connected signer"}</span>
        </p>
      </div>

      {isConnected ? (
        <div className="space-y-8">
          {/* STATS SUMMARY BAR */}
          {userStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-black/40 border border-white/10 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
              <div className="text-center md:border-r border-white/5 space-y-1 py-1.5 font-display">
                <span className="text-[10px] font-mono font-bold text-[#FFA500] uppercase tracking-wider block">DAO Voting Power</span>
                <span className="text-3xl font-orbitron font-black text-[#FFD700]">{userStats.votingPower}</span>
              </div>
              <div className="text-center space-y-1 py-1.5 font-display">
                <span className="text-[10px] font-mono font-bold text-[#FFA500] uppercase tracking-wider block">Proposals Voted On</span>
                <span className="text-3xl font-black font-orbitron text-white">{userStats.proposalsVoted}</span>
              </div>
            </div>
          )}

          {/* DAO VOTES LIST */}
          <div className="space-y-4 font-display">
            <h2 className="text-lg font-display font-black text-[#FFD700] uppercase tracking-wider flex items-center gap-2 text-shadow-glow">
              <Users className="w-5 h-5 text-[#FFD700]" />
              <span>My Escrow Governance Activity</span>
            </h2>

            {userData.length > 0 ? (
              <div className="space-y-3 font-sans">
                {userData.map((prop, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-display font-bold text-[#FFD700] uppercase">{prop.title}</h4>
                      <div className="flex items-center gap-2 text-[9px] font-mono text-gray-500">
                        <span>Identifier: {prop.id}</span>
                        <span>•</span>
                        <span>Assigned voting multiplier: {prop.power}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        prop.vote === "YEA" 
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                          : "bg-red-500/10 border-red-500/30 text-red-500"
                      }`}>
                        VOTE: {prop.vote}
                      </span>
                      <span className={`text-[10px] font-mono uppercase ${
                        prop.status === "EXECUTED" || prop.status === "PASSED" 
                          ? "text-[#00FF88]" 
                          : "text-red-400"
                      }`}>
                        {prop.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl bg-black/20 border border-white/5 text-xs text-gray-500 font-mono">
                No active voting proposals logged.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-24 rounded-[32px] arcmeta-card max-w-sm mx-auto space-y-4 p-8 font-display">
          <LogIn className="w-12 h-12 text-[#FFD700] mx-auto animate-bounce" />
          <h2 className="text-xl font-display font-black text-white uppercase">CONNECT REQUIRED</h2>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            Please connect your Web3 decentralized wallet to verify your AMETA gas holdings and cast governance votes on active escrows.
          </p>
          <button
            onClick={() => {
              const injected = connectors.find((c) => c.id === "injected" || c.name.toLowerCase().includes("metamask"));
              if (injected) {
                connect({ connector: injected });
              } else if (connectors[0]) {
                connect({ connector: connectors[0] });
              }
            }}
            className="arcmeta-btn-primary px-6 py-2.5 rounded-xl text-xs uppercase text-black font-bold"
          >
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
