import React, { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { ShieldCheck, LogIn } from "lucide-react";

export default function MyAudits() {
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
      // Fetch dynamic verification data specific to this address
      const mockAudits = [
        { id: "AUD-89", name: "Kinetic Tourbillon Escapement", status: "VERIFIED", date: "2026-06-18", auditor: address },
        { id: "AUD-44", name: "Bronze Helix Hydraulic Pump", status: "COMPLIANT", date: "2026-06-12", auditor: address },
        { id: "AUD-71", name: "Stirling Zero-Friction Seals", status: "APPROVED", date: "2026-06-08", auditor: address }
      ];
      setUserData(mockAudits);
      setUserStats({ completedAudits: mockAudits.length, complianceRate: 100 });
    }
  }, [isConnected, address]);

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div id="my-audits-view" className="space-y-10 animate-[fadeIn_0.3s_ease-out]">
      {/* HEADER SECTION */}
      <div className="border-b border-white/5 pb-4 space-y-2">
        <h1 className="text-3xl font-display font-black text-[#FFD700] uppercase tracking-wider text-shadow-glow">
          MY BLUEPRINT AUDITS
        </h1>
        <p className="text-xs text-gray-400 font-mono">
          Security and mechanical validation records for: <span className="text-[#FFA500] select-all font-bold">{isConnected && address ? truncateAddress(address) : "No connected signer"}</span>
        </p>
      </div>

      {isConnected ? (
        <div className="space-y-8">
          {/* STATS SUMMARY BAR */}
          {userStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-black/40 border border-white/10 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
              <div className="text-center md:border-r border-white/5 space-y-1 py-1.5 font-display">
                <span className="text-[10px] font-mono font-bold text-[#FFA500] uppercase tracking-wider block">Completed Audits</span>
                <span className="text-3xl font-black font-orbitron text-white">{userStats.completedAudits}</span>
              </div>
              <div className="text-center space-y-1 py-1.5 font-display">
                <span className="text-[10px] font-mono font-bold text-[#FFA500] uppercase tracking-wider block">Compliance Rate</span>
                <span className="text-3xl font-black font-orbitron text-[#00FF88]">{userStats.complianceRate}%</span>
              </div>
            </div>
          )}

          {/* AUDIT LOG LIST */}
          <div className="space-y-4 font-display">
            <h2 className="text-lg font-display font-black text-[#FFD700] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FFD700]" />
              <span>Verified Hardware Certificates</span>
            </h2>

            {userData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                {userData.map((aud) => (
                  <div key={aud.id} className="arcmeta-card p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-1 rounded">
                        ✓ {aud.status}
                      </span>
                      <code className="text-xs text-gray-500 font-mono">{aud.id}</code>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-base font-display font-black text-[#FFD700] uppercase">{aud.name}</h4>
                      <p className="text-[11px] text-gray-400 font-mono leading-normal">
                        Certified on-chain audit trail completed on date: {aud.date} by signature: {truncateAddress(aud.auditor)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl bg-black/20 border border-white/5 text-xs text-gray-500 font-mono">
                No active audit reports filed.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-24 rounded-[32px] arcmeta-card max-w-sm mx-auto space-y-4 p-8">
          <LogIn className="w-12 h-12 text-[#FFD700] mx-auto animate-bounce" />
          <h2 className="text-xl font-display font-black text-white uppercase">CONNECT REQUIRED</h2>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            Please connect your Web3 decentralized wallet to review custom security reports and registered certification history.
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
