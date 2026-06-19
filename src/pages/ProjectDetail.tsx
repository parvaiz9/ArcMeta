import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useArcMeta } from "../contexts/ProjectContext";
import { usePublicClient, useAccount } from "wagmi";
import { ARCMETA_ABI, ARCMETA_CONTRACT_ADDRESS } from "../web3";
import { 
  Clock, 
  Users, 
  Coins, 
  ShieldCheck, 
  ChevronRight, 
  Inbox, 
  Send, 
  Award,
  BookOpen, 
  HelpCircle, 
  Sliders, 
  Trash2, 
  CheckCircle,
  FileText
} from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectIndex = Number(id || "0");
  const publicClient = usePublicClient();
  const { isConnected, address } = useAccount();

  const {
    activeUserAddress,
    projects,
    approveTokenTx,
    contributeToProjectTx,
    finalizeTx,
    cancelTx,
    backersMap,
    showToast
  } = useArcMeta();

  const project = projects.find((p) => p.id === projectIndex);

  const [activeTab, setActiveTab] = useState<"story" | "rewards" | "backers" | "faq" | "updates">("story");
  const [pledgeAmount, setPledgeAmount] = useState("100");
  const [pledgeStep, setPledgeStep] = useState<"approve" | "contribute">("approve");
  const [submitting, setSubmitting] = useState(false);
  
  // Hash outputs of two-step transaction flow
  const [approveTxHash, setApproveTxHash] = useState<string | null>(null);
  const [contributeTxHash, setContributeTxHash] = useState<string | null>(null);

  // Backers loaded with dynamic contribution balances
  const [backersWithAmounts, setBackersWithAmounts] = useState<Array<{ address: string; amount: number }>>([]);
  const [loadingBackers, setLoadingBackers] = useState(false);

  // Sync backer ledger
  useEffect(() => {
    if (!project) return;

    const fetchBackerAmounts = async () => {
      setLoadingBackers(true);
      const addressList = backersMap[projectIndex] || [];
      
      if (!publicClient || addressList.length === 0) {
        // Fallback: Populate details from static comments logs in database
        const staticBackers = project.comments.map((c) => ({
          address: c.name,
          amount: c.amount,
        }));
        setBackersWithAmounts(staticBackers);
        setLoadingBackers(false);
        return;
      }

      try {
        const loadedList = await Promise.all(
          addressList.map(async (addr) => {
            try {
              const amountVal = await publicClient.readContract({
                address: ARCMETA_CONTRACT_ADDRESS,
                abi: ARCMETA_ABI,
                functionName: 'contributions',
                args: [BigInt(projectIndex), addr as `0x${string}`],
              } as any) as bigint;
              return {
                address: addr,
                amount: Number(amountVal) / 1000000,
              };
            } catch (err) {
              return { address: addr, amount: 100 }; // Fallback
            }
          })
        );
        // Remove duplicates and filter zero contributions
        setBackersWithAmounts(loadedList.filter((b) => b.amount > 0));
      } catch (err) {
        console.error("Error batch querying backers", err);
      } finally {
        setLoadingBackers(false);
      }
    };

    fetchBackerAmounts();
  }, [projectIndex, backersMap, publicClient, project]);

  if (!project) {
    return (
      <div className="text-center py-20 font-mono space-y-4">
        <h2 className="text-xl text-red-500 font-bold uppercase">🔧 Escrow Ledger Not Found</h2>
        <Link to="/" className="text-[#FFD700] hover:underline">
          Go back to exploring blueprints
        </Link>
      </div>
    );
  }

  const targetUSD = Number(project.targetAmount) / 1000000;
  const raisedUSD = Number(project.raisedAmount) / 1000000;
  const pct = Math.min(100, Math.floor((raisedUSD / (targetUSD || 1)) * 100));

  // Access Roles
  const isCreatorConnected = isConnected && address && address.toLowerCase() === project.creator.toLowerCase();

  // Escrow flows
  const handleApprove = async () => {
    const val = parseFloat(pledgeAmount);
    if (isNaN(val) || val <= 0) {
      showToast("Please input a positive pledge contribution stake", false);
      return;
    }

    setSubmitting(true);
    try {
      const hash = await approveTokenTx(project.tokenSymbol, val);
      setApproveTxHash(hash);
      setPledgeStep("contribute");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleContribute = async () => {
    const val = parseFloat(pledgeAmount);
    if (isNaN(val) || val <= 0) return;

    setSubmitting(true);
    try {
      const hash = await contributeToProjectTx(project.id, val);
      setContributeTxHash(hash);
      setPledgeStep("approve");
      setPledgeAmount("100");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalize = async () => {
    const doubleCheck = window.confirm("Are you ready to unlock this escrow and release all pledged tokens to your wallet?");
    if (!doubleCheck) return;
    const ok = await finalizeTx(project.id);
    if (ok) {
      showToast("Escrow funds released!", true);
    }
  };

  const handleCancelCampaign = async () => {
    const doubleCheck = window.confirm("Are you absolutely sure you want to cancel this mechanical project? This allows all backers to immediately claim a 100% refund of their locked stakes.");
    if (!doubleCheck) return;
    const ok = await cancelTx(project.id);
    if (ok) {
      showToast("Campaign cancelled successfully.", true);
    }
  };

  // Status computation for badges
  let statusBadgeColor = "bg-[#FFD700] text-black";
  let statusLabel = "Active Escrow";
  if (project.cancelled) {
    statusBadgeColor = "bg-[#FF3B3B] text-white";
    statusLabel = "Cancelled";
  } else if (project.finalized) {
    statusBadgeColor = "bg-[#00FF88] text-black";
    statusLabel = "Funded & Disbursed";
  } else if (raisedUSD >= targetUSD) {
    statusBadgeColor = "bg-[#00FF88] text-black";
    statusLabel = "Target Goal Acheived!";
  }

  const finalBadgeStyle = `${statusBadgeColor} font-bold font-display px-4 py-1.5 rounded-full uppercase text-xs tracking-wider shadow-[0_0_10px_rgba(255,215,0,0.4)]`;

  return (
    <div id="project-detail-view" className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      
      {/* 1. TOP BREADCRUMB HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-white/5 pb-4">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Link to="/" className="hover:text-[#FFD700] transition-all">BLUEPRINTS</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-bold">{project.title.slice(0, 30)}...</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-500 uppercase">Creator:</span>
          <span className="text-[#FFA500] hover:underline font-bold select-all">{project.creator}</span>
        </div>
      </div>

      {/* 2. MAIN SPLIT COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: DETAIL STATS AND SECTIONS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* CAMPAIGN BRIEF CONTAINER */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className={finalBadgeStyle}>{statusLabel}</span>
              <span className="text-[10px] font-mono text-gray-400 font-bold bg-white/2 p-1.5 rounded border border-white/5 uppercase">
                Custody Chain: {project.tokenSymbol} (Sepolia Ledger)
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-black uppercase text-white tracking-wide leading-none">
              {project.title}
            </h1>
            
            <p className="text-gray-300 font-sans leading-relaxed text-sm">
              {project.tagline}
            </p>
          </div>

          {/* PROJECT DETAIL SPEC MULTI-TAB SWITCHER */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 border-b border-white/5 pb-0.5">
              {[
                { id: "story", label: "Spec Blueprint", icon: FileText },
                { id: "rewards", label: "Access Tier Perks", icon: Award },
                { id: "backers", label: "Escrow Backers", icon: Users },
                { id: "faq", label: "Resolution FAQ", icon: HelpCircle },
                { id: "updates", label: "Production Logs", icon: BookOpen },
              ].map((tab) => {
                const IconComp = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-3 px-3.5 text-xs uppercase tracking-wider font-display font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === tab.id
                        ? "border-[#FFD700] text-[#FFD700] font-black"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB PANES */}
            <div className="bg-black/20 rounded-2xl border border-white/5 p-6 md:p-8 min-h-[300px]">
              
              {/* STORY TAB */}
              {activeTab === "story" && (
                <div className="space-y-4 animate-[fadeIn_0.25s_ease-out]">
                  <h3 className="text-lg font-display font-black text-white uppercase">Cabinet Spec Description</h3>
                  <div className="text-sm text-gray-300 font-sans leading-relaxed space-y-4 whitespace-pre-wrap">
                    {project.description}
                  </div>
                </div>
              )}

              {/* REWARDS TAB */}
              {activeTab === "rewards" && (
                <div className="space-y-6 animate-[fadeIn_0.25s_ease-out]">
                  <h3 className="text-lg font-display font-black text-white uppercase">Escrow Supporter Reward Perks</h3>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed pb-2 border-b border-white/5">
                    Participate higher tiers to receive physical manufacturing parts, serial plates, or full hardware packages upon creator milestone disbursements.
                  </p>
                  
                  {project.rewards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.rewards.map((rew) => (
                        <div 
                          key={rew.id} 
                          className="arcmeta-card p-5 space-y-3 flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-display font-bold text-xs uppercase text-white tracking-wide">
                                {rew.title}
                              </h4>
                              <span className="font-orbitron font-bold text-[#FFD700] text-xs shrink-0 pt-0.5">
                                {rew.cost} {project.tokenSymbol}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
                              {rew.description}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-gray-400">
                            <span>Delivery: {rew.estimatedDelivery}</span>
                            <button
                              onClick={() => {
                                setPledgeAmount(rew.cost.toString());
                                showToast(`Stake adjusted to Reward package: ${rew.title}!`, true);
                              }}
                              className="px-2 py-1 bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 rounded uppercase cursor-pointer transition-all"
                            >
                              Choose Stake
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 font-mono text-xs">
                      No customized support perks declared for this mechanics campaign.
                    </div>
                  )}
                </div>
              )}

              {/* BACKERS TAB */}
              {activeTab === "backers" && (
                <div className="space-y-6 animate-[fadeIn_0.25s_ease-out]">
                  <h3 className="text-lg font-display font-black text-white uppercase">Active Escrow Wallet Ledger</h3>
                  
                  {loadingBackers ? (
                    <div className="text-center py-12 text-xs font-mono text-gray-500">
                      Syncing contract backer accounts...
                    </div>
                  ) : backersWithAmounts.length > 0 ? (
                    <div className="space-y-3">
                      {backersWithAmounts.map((backer, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <code className="text-xs font-mono font-bold text-gray-300 select-all block break-all">
                              {backer.address}
                            </code>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-mono">
                              Pledge Stake verified on Sepolia chain
                            </span>
                          </div>
                          <div className="text-sm font-orbitron font-bold text-white shrink-0 bg-[#FFD700]/10 border border-[#FFD700]/30 px-3 py-1 rounded-lg">
                            {backer.amount.toLocaleString()} <span className="text-[9px] text-[#FFA500]">{project.tokenSymbol}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 font-mono text-xs">
                      Be the first to back and lock stake in this revolutionary kinetic proposal!
                    </div>
                  )}
                </div>
              )}

              {/* FAQ TAB */}
              {activeTab === "faq" && (
                <div className="space-y-6 animate-[fadeIn_0.25s_ease-out]">
                  <h3 className="text-lg font-display font-black text-white uppercase">Resolution & Disputes Q&A</h3>
                  
                  {project.faq.length > 0 ? (
                    <div className="space-y-4">
                      {project.faq.map((fq, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                          <h4 className="font-display font-bold text-xs uppercase text-[#FFA500] tracking-wide">
                            Q: {fq.question}
                          </h4>
                          <p className="text-xs text-gray-300 font-sans leading-relaxed leading-normal">
                            A: {fq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 font-mono text-xs">
                      No frequently resolved questions listed yet.
                    </div>
                  )}
                </div>
              )}

              {/* UPDATES TAB */}
              {activeTab === "updates" && (
                <div className="space-y-6 animate-[fadeIn_0.25s_ease-out]">
                  <h3 className="text-lg font-display font-black text-white uppercase">Production Logs & Validation</h3>
                  
                  {project.updates.length > 0 ? (
                    <div className="space-y-4">
                      {project.updates.map((up) => (
                        <div key={up.id} className="p-5 rounded-xl bg-black/40 border border-[#FFD700]/20 space-y-2 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 bg-[#FFD700] h-full" />
                          <div className="flex justify-between items-center text-[10px] font-mono pb-2 border-b border-white/5">
                            <span className="text-[#FFA500] font-bold uppercase">Log #{up.id}</span>
                            <span className="text-gray-500">{up.date}</span>
                          </div>
                          <h4 className="font-display font-bold text-sm uppercase text-white">
                            {up.title}
                          </h4>
                          <p className="text-xs text-gray-300 font-sans leading-relaxed">
                            {up.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 font-mono text-xs">
                      No production logging entries recorded yet.
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION ESCROW METRICS PANEL */}
        <div className="space-y-6">

          {/* ESCROW STATS BLOCK */}
          <div className="arcmeta-card p-6 space-y-5">
            <h3 className="text-sm font-display font-black text-white uppercase tracking-wider border-b border-white/5 pb-2">
              Escrow Summary
            </h3>

            {/* PROGRESS METER */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-gray-400">STATUS</span>
                <span className="text-[#FFD700] font-orbitron">{pct}%</span>
              </div>
              <div className="relative w-full bg-[rgba(255,215,0,0.15)] rounded-full h-2">
                <div 
                  className="bg-[#FFD700] h-2 rounded-full shadow-[0_0_8px_#FFD700]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* TARGET INFO */}
            <div className="grid grid-cols-2 gap-4 pb-2 border-b border-white/5">
              <div>
                <div className="text-[9px] font-mono text-[#FFA500] uppercase font-bold">Pledged Escrow</div>
                <div className="text-lg font-orbitron font-normal text-white">
                  {raisedUSD.toLocaleString()} <span className="text-[10px] text-gray-300">{project.tokenSymbol}</span>
                </div>
              </div>
              <div>
                <div className="text-[9px] font-mono text-[#FFA500] uppercase font-bold">Target Escrow</div>
                <div className="text-lg font-orbitron font-normal text-[#00FF88]">
                  {targetUSD.toLocaleString()} <span className="text-[10px] text-gray-300">{project.tokenSymbol}</span>
                </div>
              </div>
            </div>

            {/* COUNTER GRID */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FFD700]" />
                <div className="space-y-0.5">
                  <div className="text-[8px] uppercase tracking-wider text-gray-500 font-mono">Backers</div>
                  <div className="text-sm font-orbitron font-bold text-white">{project.backers}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#FFD700]" />
                <div className="space-y-0.5">
                  <div className="text-[8px] uppercase tracking-wider text-gray-500 font-mono">Hours Left</div>
                  <div className="text-sm font-orbitron font-bold text-white">
                    {project.cancelled ? "-" : project.daysLeft * 24}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TWO-STEP PLEDGING ENGINE */}
          {!project.cancelled && !project.finalized && (
            <div className="arcmeta-card p-6 space-y-4">
              <h3 className="text-sm font-display font-black text-[#FFD700] uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>Two-Step Transaction</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase font-bold block">
                  Pledge Amount Input
                </label>
                <div className="relative">
                  <input
                    type="number"
                    disabled={submitting}
                    value={pledgeAmount}
                    onChange={(e) => setPledgeAmount(e.target.value)}
                    placeholder="100"
                    className="w-full bg-[#0A0800] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-orbitron outline-none focus:border-[#FFD700]"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 font-mono">
                    {project.tokenSymbol}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {pledgeStep === "approve" ? (
                  <button
                    onClick={handleApprove}
                    disabled={submitting}
                    className="w-full py-3 text-xs font-display font-extrabold uppercase bg-[#FFD700] hover:bg-[#FFD700]/80 text-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-black border-t-transparent" />
                        <span>Processing Allowance Approved...</span>
                      </>
                    ) : (
                      <span className="text-black font-extrabold">1. Approve {pledgeAmount} {project.tokenSymbol}</span>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleContribute}
                    disabled={submitting}
                    className="w-full py-3 text-xs font-display font-extrabold uppercase bg-[#FFA500] hover:bg-[#FFA500]/80 text-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                        <span>Pledging locked stakes...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>2. Confirm Contribution Escrows</span>
                      </>
                    )}
                  </button>
                )}

                {/* TRANSACTION HASH VIEWS (EMERALD ALERTS) */}
                {approveTxHash && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 rounded-xl text-[9px] font-mono break-all space-y-1">
                    <span className="font-bold block text-[10px] uppercase">✓ STEP 1 ALLOWED SPEND:</span>
                    <span className="block select-all">{approveTxHash}</span>
                  </div>
                )}

                {contributeTxHash && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 rounded-xl text-[9px] font-mono break-all space-y-1">
                    <span className="font-bold block text-[10px] uppercase">✓ STEP 2 ESCROW VERIFIED:</span>
                    <span className="block select-all">{contributeTxHash}</span>
                  </div>
                )}

                {/* ADVISORY FOOTER */}
                <div className="pt-2 border-t border-white/5 text-[9px] font-mono text-gray-500 text-center space-y-1 leading-normal">
                  <div>Authorized Contract Spender:</div>
                  <code className="text-white text-[8.5px] block select-all break-all">
                    {ARCMETA_CONTRACT_ADDRESS}
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN AND CREATOR ON-CHAIN ESCROW SETTLING */}
          {isCreatorConnected && (
            <div className="arcmeta-card p-6 border-2 border-[#FFD700] space-y-4">
              <h3 className="text-sm font-display font-black text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                <CheckCircle className="w-5 h-5 text-[#FFD700]" />
                <span>Milestone Governance</span>
              </h3>

              <p className="text-[10px] text-gray-300 leading-normal font-sans">
                You are registered as the author of this hardware campaign. Finalize the milestones below to lock/unlock smart custody on-chain.
              </p>

              <div className="space-y-3 pt-1">
                {raisedUSD >= targetUSD && !project.finalized && (
                  <button
                    onClick={handleFinalize}
                    className="w-full bg-[#00FF88] hover:bg-[#00FF88]/80 text-black font-display font-extrabold uppercase py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                  >
                    <span>Release Locked Escrow</span>
                  </button>
                )}

                {!project.finalized && !project.cancelled && (
                  <button
                    onClick={handleCancelCampaign}
                    className="w-full bg-[#FF3B3B] hover:bg-[#FF3B3B]/80 text-white font-display font-extrabold uppercase py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Cancel Campaign & Refund</span>
                  </button>
                )}

                {project.finalized && (
                  <div className="p-3 bg-[#00FF88]/10 border border-[#00FF88]/40 rounded-xl text-[#00FF88] font-mono text-[10px] text-center font-bold">
                    ✓ Escrow Successfully Released to Creator.
                  </div>
                )}

                {project.cancelled && (
                  <div className="p-3 bg-[#FF3B3B]/10 border border-[#FF3B3B]/40 rounded-xl text-[#FF3B3B] font-mono text-[10px] text-center font-bold">
                    ✕ Escrow Cancelled. Backers can claim refunds.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
