import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArcMeta } from "../contexts/ProjectContext";
import { Send, Info } from "lucide-react";

export default function CreateProject() {
  const { createProjectTx } = useArcMeta();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState<"USDC" | "EURC">("USDC");
  const [targetAmount, setTargetAmount] = useState("");
  const [durationDays, setDurationDays] = useState("30");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount || !description) return;

    setSubmitting(true);
    try {
      await createProjectTx(
        title,
        description,
        parseFloat(targetAmount),
        parseInt(durationDays),
        tokenSymbol
      );
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="create-container" className="max-w-2xl mx-auto space-y-8 animate-[fadeIn_0.3s_ease-out]">
      {/* HEADER TITLE */}
      <div className="border-b border-white/5 pb-4 space-y-1 text-center md:text-left">
        <h1 className="text-3xl font-display font-black text-[#FFD700] uppercase tracking-wider text-shadow-glow">
          REGISTER MECHANICAL BLUEPRINT
        </h1>
        <p className="text-xs text-gray-400 font-mono">
          Initiate a decentralized hardware escrow contract instantly on-chain
        </p>
      </div>

      {/* FORM CARD */}
      <form onSubmit={handleSubmit} className="arcmeta-card p-6 md:p-8 space-y-6">
        
        {/* BLUEPRINT TITLE */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase font-mono text-[#FFA500] font-bold tracking-wider block">
            Mechanical Title / Mechanism Name
          </label>
          <input
            id="input-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Kinetic Zenith Tourbillon Watch"
            className="w-full bg-[#0A0800] border border-white/15 focus:border-[#FFD700] rounded-xl px-4 py-3 text-xs text-white outline-none transition-all placeholder-gray-600"
          />
        </div>

        {/* TARGET & TOKEN TYPE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* STABLECOIN TYPE */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase font-mono text-[#FFA500] font-bold tracking-wider block">
              Escrow Stablecoin Token
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["USDC", "EURC"] as const).map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => setTokenSymbol(sym)}
                  className={`py-2.5 rounded-xl text-xs font-display font-bold uppercase border cursor-pointer transition-all ${
                    tokenSymbol === sym
                      ? "bg-[#FFD700] border-[#FFD700] text-black shadow-[0_0_12px_rgba(255,215,0,0.5)]"
                      : "bg-[#0A0800] border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* TARGET GOAL */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase font-mono text-[#FFA500] font-bold tracking-wider block">
              Target Escrow Goal ({tokenSymbol})
            </label>
            <input
              id="input-target"
              type="number"
              required
              min="10"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full bg-[#0A0800] border border-white/15 focus:border-[#FFD700] rounded-xl px-4 py-3 text-xs text-white outline-none transition-all placeholder-gray-600 font-orbitron font-bold"
            />
          </div>
        </div>

        {/* DURATION DAYS */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase font-mono text-[#FFA500] font-bold tracking-wider block">
            Escrow Accumulation Window (Days)
          </label>
          <select
            id="input-duration"
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            className="w-full bg-[#0A0800] border border-white/15 focus:border-[#FFD700] rounded-xl px-4 py-3 text-xs text-white outline-none transition-all cursor-pointer font-bold"
          >
            <option value="15">15 Days (Accelerated Assembly)</option>
            <option value="30">30 Days (Standard Validation)</option>
            <option value="45">45 Days (Extended Manufacturing)</option>
            <option value="60">60 Days (Complex Cast Prototyping)</option>
          </select>
        </div>

        {/* LONG DESCRIPTION */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase font-mono text-[#FFA500] font-bold tracking-wider block">
            Blueprint Architectural Long Description & Release Milestones
          </label>
          <textarea
            id="input-desc"
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain the gear trains, manufacturing tolerance, materials (gold-anodized cobalt, aerospace titanium, etc.) and what you will deliver on milestone triggers."
            className="w-full bg-[#0A0800] border border-white/15 focus:border-[#FFD700] rounded-xl px-4 py-3 text-xs text-white outline-none transition-all placeholder-gray-600 leading-relaxed resize-none"
          />
        </div>

        {/* TERMS BOX */}
        <div className="p-3.5 bg-black/50 border border-yellow-500/10 text-yellow-500 rounded-xl flex items-start gap-2 text-[10px] font-sans leading-normal">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> Broadcaster pledges remain locked in decentralized smart custody. Funding withdrawals occur strictly on milestone verification or failed campaign expiration. Double check tolerances before uploading.
          </span>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={submitting}
          className="arcmeta-btn-primary w-full py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-black"
        >
          {submitting ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
              <span>Broadcasting Ledger Contract...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-black" />
              <span>Initialize On-Chain Campaign</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}
