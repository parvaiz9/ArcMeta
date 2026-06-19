import React, { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { useArcMeta } from "../contexts/ProjectContext";
import CampaignCard from "../components/CampaignCard";
import { FolderOpen, Heart, LogIn } from "lucide-react";

export default function MyProjects() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  
  const { 
    projects, 
    userContributions, 
    claimRefundTx, 
    isContractLoading
  } = useArcMeta();

  const [activeTab, setActiveTab] = useState<"created" | "backed">("created");
  
  // Specific required states for data privacy & wallet-gating
  const [userData, setUserData] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);

  // Requirement 3 & 5: Clear all state on disconnect, use account address dependency
  useEffect(() => {
    if (!isConnected) {
      setUserData([]);
      setUserStats(null);
    } else if (address) {
      // Find created and backed projects for this connected address
      const created = projects.filter(
        (p) => p.creator.toLowerCase() === address.toLowerCase()
      );
      const backed = projects.filter((p) => {
        const onChainContrib = userContributions[p.id] || 0n;
        return onChainContrib > 0n;
      });

      const stats = {
        totalPledged: backed.reduce((acc, p) => {
          const contrib = userContributions[p.id] || 0n;
          return acc + (Number(contrib) / 1000000);
        }, 0),
        projectsCreated: created.length,
        projectsBacked: backed.length,
      };

      setUserData([
        { type: "created", list: created },
        { type: "backed", list: backed }
      ]);
      setUserStats(stats);
    }
  }, [isConnected, address, projects, userContributions]);

  const createdProjects = isConnected && userData.length > 0
    ? userData.find(u => u.type === "created")?.list || []
    : [];

  const backedProjects = isConnected && userData.length > 0
    ? userData.find(u => u.type === "backed")?.list || []
    : [];

  const handleClaimRefund = async (projectId: number) => {
    try {
      await claimRefundTx(projectId);
    } catch (err: any) {
      console.error(err);
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div id="my-projects-container" className="space-y-10 animate-[fadeIn_0.3s_ease-out]">
      {/* HEADER SECTION */}
      <div className="border-b border-white/5 pb-4 space-y-2">
        <h1 className="text-3xl font-display font-black text-[#FFD700] uppercase tracking-wider text-shadow-glow">
          MY ESCROW PROFILE
        </h1>
        <p className="text-xs text-gray-400 font-mono">
          Connected Web3 Signer: <span className="text-[#FFA500] select-all font-bold">{isConnected && address ? truncateAddress(address) : "No connected signer"}</span>
        </p>
      </div>

      {isConnected && address ? (
        <div className="space-y-8">
          {/* STATS SUMMARY */}
          {userStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-black/40 border border-white/10 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
              <div className="text-center md:border-r border-white/5 space-y-1 py-1.5 font-display">
                <span className="text-[10px] font-mono font-bold text-[#FFA500] uppercase tracking-wider block">Created Blueprints</span>
                <span className="text-3xl font-black font-orbitron text-[#FFD700]">{userStats.projectsCreated}</span>
              </div>
              <div className="text-center space-y-1 py-1.5 font-display">
                <span className="text-[10px] font-mono font-bold text-[#FFA500] uppercase tracking-wider block">Total Staked pledges</span>
                <span className="text-3xl font-black font-orbitron text-white">${userStats.totalPledged.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* TABS SELECTOR */}
          <div className="flex gap-4 border-b border-white/5 pb-0.5">
            <button
              id="tab-created"
              onClick={() => setActiveTab("created")}
              className={`pb-3 text-xs uppercase tracking-wider font-display font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "created"
                  ? "border-[#FFD700] text-[#FFD700]"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Launched Blueprints ({createdProjects.length})
            </button>
            <button
              id="tab-backed"
              onClick={() => setActiveTab("backed")}
              className={`pb-3 text-xs uppercase tracking-wider font-display font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "backed"
                  ? "border-[#FFD700] text-[#FFD700]"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Backed Escrows ({backedProjects.length})
            </button>
          </div>

          {/* ACTIVE CONTENT */}
          {activeTab === "created" ? (
            createdProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {createdProjects.map((project: any) => (
                  <CampaignCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl bg-black/20 border border-white/5 space-y-3">
                <FolderOpen className="w-10 h-10 text-gray-600 mx-auto" />
                <p className="text-xs text-gray-500 font-mono">
                  You haven't uploaded any hardware engineering blueprints yet.
                </p>
              </div>
            )
          ) : (
            backedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {backedProjects.map((project: any) => {
                  const rawAmountBacked = userContributions[project.id] || 0n;
                  const amtUnitStr = (Number(rawAmountBacked) / 1000000).toLocaleString();

                  // Determine refund viability: fails if expired AND wasn't funded OR explicitly cancelled
                  const targetUnits = Number(project.targetAmount) / 1000000;
                  const raisedUnits = Number(project.raisedAmount) / 1000000;
                  const isExpired = project.daysLeft === 0;
                  const isFundingFailed = isExpired && raisedUnits < targetUnits;
                  const refundEligible = project.cancelled || isFundingFailed;

                  return (
                    <div 
                      key={project.id} 
                      className="arcmeta-card p-6 flex flex-col justify-between h-[450px]"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono font-bold text-[#FFA500] uppercase tracking-wider">
                            Pledge Locked
                          </span>
                          <span className="text-xs font-orbitron text-black font-bold bg-[#FFD700] px-2.5 py-1 rounded-md border border-[#FFD700]/30 shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                            {amtUnitStr} {project.tokenSymbol}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-display font-black text-[#FFD700] uppercase line-clamp-1">
                            {project.title}
                          </h3>
                          <p className="text-xs text-gray-300 font-sans line-clamp-3">
                            {project.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/5 space-y-4 mt-auto">
                        <div className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-1.5 text-center">
                          <span className="text-[10px] uppercase font-mono text-gray-400 block">
                            Milestone Status:
                          </span>
                          <code className="text-[10px] font-mono text-[#FFD700] font-bold block">
                            {project.cancelled 
                              ? "🔴 CANCELLED BY CREATOR" 
                              : project.finalized 
                                ? "🟢 FUNDS RETRIEVED BY CREATOR" 
                                : isFundingFailed 
                                  ? "🔴 FUNDING PERIOD FAILED" 
                                  : "🟡 STAKED IN ACTIVE ESCROW"
                            }
                          </code>
                        </div>

                        {refundEligible ? (
                          <button
                            onClick={() => handleClaimRefund(project.id)}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-display font-extrabold uppercase py-3 rounded-xl transition-all tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer"
                          >
                            Claim Escrow Refund
                          </button>
                        ) : (
                          <div className="text-[9.5px] text-gray-400 font-sans leading-normal text-center bg-white/2 p-2 rounded-lg border border-white/5">
                            🔒 Escrow is active. Funds exit only upon creator milestone completion or failure.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl bg-black/20 border border-white/5 space-y-3">
                <Heart className="w-10 h-10 text-gray-600 mx-auto" />
                <p className="text-xs text-gray-500 font-mono">
                  No active on-chain escrow stakes on your balance.
                </p>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="text-center py-24 rounded-[32px] arcmeta-card max-w-sm mx-auto space-y-4 p-8">
          <LogIn className="w-12 h-12 text-[#FFD700] mx-auto animate-bounce" />
          <h2 className="text-xl font-display font-black text-[#FFD700] uppercase">CONNECT REQUIRED</h2>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            Please connect your Web3 decentralized client to inspect private ledger states.
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
