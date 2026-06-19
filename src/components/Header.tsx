import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAccount, useDisconnect, useReadContract } from "wagmi";
import { Sun, Moon } from "lucide-react";
import { useArcMeta } from "../contexts/ProjectContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Custom Brand Logo Component with requested styling:
// - Icon: Two hands shaking made of golden coins/circles representing community funding
// - Golden gradient #FFD700 to #FFA500
// - Bright shine effect on hands
// - Subtle golden glow around icon
// - Text: "Arc" white heavy bold + "Meta" gold-to-orange gradient
// - Font: Exo 2 Black weight (900)
// - Letter spacing: tight -1px
// - Add coin sparkle animation on logo
// - Size: navbar 40px height
// - Support everywhere (navbar, favicon, loading screen, og image)
export const ArcMetaLogo = ({ size = "normal" }: { size?: "normal" | "large" }) => {
  const isLarge = size === "large";

  // Check light mode safely
  const isLight = typeof document !== "undefined" && document.documentElement.classList.contains("light");

  const heightClass = isLarge ? "h-20 md:h-24" : "h-10";
  const iconSizeClass = isLarge ? "w-20 h-20 md:w-24 md:h-24" : "w-10 h-10";
  const textSizeClass = isLarge ? "text-4xl md:text-6xl" : "text-2xl";
  const gapClass = isLarge ? "gap-4" : "gap-2";

  return (
    <div className={`flex items-center ${gapClass} group font-['Exo_2'] font-black select-none cursor-pointer ${heightClass}`}>
      <div className={`relative ${iconSizeClass} flex items-center justify-center shrink-0`}>
        {/* Subtle golden glow around icon */}
        <div className="absolute inset-0 rounded-full bg-[#FFD700]/15 blur-lg pointer-events-none" />

        {/* Shaking hands SVG made of golden coins/circles */}
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full relative z-10 drop-shadow-[0_0_12px_rgba(255,215,0,0.6)] overflow-visible"
        >
          <defs>
            <linearGradient id="goldCoinsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FFA500" />
            </linearGradient>
            <linearGradient id="logoShineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Left Hand Arm - Chain of Golden Coins representing community funding */}
          <circle cx="11" cy="43" r="4.2" fill="url(#goldCoinsGrad)" stroke="#1A0D00" strokeWidth="0.5" />
          <circle cx="17" cy="39" r="4.8" fill="url(#goldCoinsGrad)" stroke="#1A0D00" strokeWidth="0.5" />
          <circle cx="23" cy="35" r="5.2" fill="url(#goldCoinsGrad)" stroke="#1A0D00" strokeWidth="0.5" />
          <circle cx="29" cy="31" r="5.8" fill="url(#goldCoinsGrad)" stroke="#FFA500" strokeWidth="1.5" className="animate-coin-sparkle" />
          <circle cx="34" cy="27" r="4.2" fill="url(#goldCoinsGrad)" stroke="#1A0D00" strokeWidth="0.5" />

          {/* Right Hand Arm - Chain of Golden Coins representing community funding */}
          <circle cx="53" cy="21" r="4.2" fill="url(#goldCoinsGrad)" stroke="#1A0D00" strokeWidth="0.5" />
          <circle cx="47" cy="25" r="4.8" fill="url(#goldCoinsGrad)" stroke="#1A0D00" strokeWidth="0.5" />
          <circle cx="41" cy="29" r="5.2" fill="url(#goldCoinsGrad)" stroke="#1A0D00" strokeWidth="0.5" />
          <circle cx="35" cy="33" r="5.8" fill="url(#goldCoinsGrad)" stroke="#FFA500" strokeWidth="1.5" className="animate-coin-sparkle" />
          <circle cx="29" cy="37" r="4.2" fill="url(#goldCoinsGrad)" stroke="#1A0D00" strokeWidth="0.5" />

          {/* Clasping Hand Fingers Interlocking Coins */}
          <circle cx="26" cy="32" r="3.5" fill="url(#goldCoinsGrad)" stroke="#1A0D00" strokeWidth="0.75" />
          <circle cx="30" cy="34" r="3.8" fill="url(#goldCoinsGrad)" stroke="#1A0D00" strokeWidth="0.75" />
          <circle cx="34" cy="30" r="3.8" fill="url(#goldCoinsGrad)" stroke="#1A0D00" strokeWidth="0.75" />
          <circle cx="36" cy="34" r="3.5" fill="url(#goldCoinsGrad)" stroke="#1A0D00" strokeWidth="0.75" />

          {/* Golden sparkles/stars that pulse beautifully */}
          <g className="animate-coin-sparkle">
            <path d="M19 14 Q19 17 22 17 Q19 17 19 20 Q19 17 16 17 Q19 17 19 14 Z" fill="#FFF" className="drop-shadow-[0_0_5px_rgba(255,255,255,0.95)]" />
          </g>
          <g className="animate-coin-sparkle" style={{ animationDelay: "0.5s" }}>
            <path d="M46 39 Q46 42 49 42 Q46 42 46 45 Q46 42 43 42 Q46 42 46 39 Z" fill="#FFD700" className="drop-shadow-[0_0_5px_rgba(255,215,0,0.95)]" />
          </g>
          <g className="animate-coin-sparkle" style={{ animationDelay: "1.1s" }}>
            <circle cx="32" cy="32" r="1.5" fill="#FFF" className="drop-shadow-[0_0_6px_rgba(255,255,255,0.95)]" />
          </g>

          {/* Bright shine effect that sweeps across */}
          <rect x="-10" y="5" width="80" height="50" fill="url(#logoShineGrad)" transform="rotate(-30 32 30)" className="pointer-events-none">
            <animateTransform
              attributeName="transform"
              type="translate"
              from="-120"
              to="120"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>

      {/* Brand Name Text: "Arc" in white + "Meta" in Gold-to-Orange Gradient. Font: Exo 2 900 weight, tight -1px letter spacing */}
      <div className={`flex items-center ${textSizeClass} select-none font-[900] tracking-[-1px]`}>
        <span className={isLight ? "text-black" : "text-white"}>Arc</span>
        <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent ml-0.5">Meta</span>
      </div>
    </div>
  );
};

export default function Header() {
  const { pathname } = useLocation();
  const { theme, toggleTheme, showToast, usdcBalance, eurcBalance } = useArcMeta();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  // Fetch real USDC balance on Arc network:
  const { data: usdcRawBalance } = useReadContract({
    address: '0x3600000000000000000000000000000000000000' as `0x${string}`,
    abi: [{
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ name: '', type: 'uint256' }]
    }] as const,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 3000,
    }
  });

  // Fetch real EURC balance on Arc network:
  const { data: eurcRawBalance } = useReadContract({
    address: '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a' as `0x${string}`,
    abi: [{
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ name: '', type: 'uint256' }]
    }] as const,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 3000,
    }
  });

  const displayUsdc = isConnected && address && usdcRawBalance !== undefined
    ? Number(usdcRawBalance) / 1000000
    : usdcBalance;

  const displayEurc = isConnected && address && eurcRawBalance !== undefined
    ? Number(eurcRawBalance) / 1000000
    : eurcBalance;

  // Dynamic favicon & metadata injector to meet "Use everywhere: navbar, favicon, loading screen, og image"
  React.useEffect(() => {
    const faviconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFD700" />
            <stop offset="100%" stop-color="#FFA500" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="#0A0800" stroke="#FFD700" stroke-width="2" />
        <circle cx="11" cy="43" r="3.5" fill="url(#g)" />
        <circle cx="17" cy="39" r="4" fill="url(#g)" />
        <circle cx="23" cy="35" r="4.5" fill="url(#g)" />
        <circle cx="29" cy="31" r="5" fill="url(#g)" />
        <circle cx="34" cy="27" r="3.5" fill="url(#g)" />
        <circle cx="53" cy="21" r="3.5" fill="url(#g)" />
        <circle cx="47" cy="25" r="4" fill="url(#g)" />
        <circle cx="41" cy="29" r="4.5" fill="url(#g)" />
        <circle cx="35" cy="33" r="5" fill="url(#g)" />
        <circle cx="29" cy="37" r="3.5" fill="url(#g)" />
        <circle cx="26" cy="32" r="3" fill="url(#g)" />
        <circle cx="30" cy="34" r="3" fill="url(#g)" />
        <circle cx="34" cy="30" r="3" fill="url(#g)" />
        <circle cx="36" cy="34" r="3" fill="url(#g)" />
      </svg>
    `;
    const blob = new Blob([faviconSvg], { type: "image/svg+xml" });
    const blobUrl = URL.createObjectURL(blob);

    // Apply favicon
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = blobUrl;

    // Apply OG metadata image
    let ogImg = document.querySelector("meta[property='og:image']") as HTMLMetaElement;
    if (!ogImg) {
      ogImg = document.createElement("meta");
      ogImg.setAttribute("property", "og:image");
      document.head.appendChild(ogImg);
    }
    ogImg.content = blobUrl;
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header 
      id="main-header"
      className={`sticky top-0 z-50 backdrop-blur-md px-4 md:px-8 py-3.5 transition-colors duration-200 border-b-2 ${
        theme === "light" ? "bg-[#DDD8C8]/90 border-black" : "bg-black/80 border-[#FFD700]"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* NEW BRAND LOGO */}
        <Link id="logo-link" to="/">
          <ArcMetaLogo />
        </Link>

        {/* NAVIGATION LINKS */}
        <nav id="header-nav" className="hidden md:flex items-center gap-6 font-display text-sm tracking-wide">
          <Link
            id="nav-explore"
            to="/"
            className={`transition-all duration-200 outline-none pb-1 border-b-2 ${
              isActive("/") 
                ? (theme === "light" ? "text-black border-black font-black" : "text-[#FFD700] border-[#FFD700] font-black") 
                : (theme === "light" ? "text-gray-700 hover:text-black border-transparent font-medium" : "text-gray-300 hover:text-[#FFD700] border-transparent font-medium")
            }`}
          >
            Explore Projects
          </Link>
          <Link
            id="nav-my-escrow"
            to="/my-projects"
            className={`transition-all duration-200 outline-none pb-1 border-b-2 ${
              isActive("/my-projects") 
                ? (theme === "light" ? "text-black border-black font-black" : "text-[#FFD700] border-[#FFD700] font-black") 
                : (theme === "light" ? "text-gray-700 hover:text-black border-transparent font-medium" : "text-gray-300 hover:text-[#FFD700] border-transparent font-medium")
            }`}
          >
            My Escrows
          </Link>
          <Link
            id="nav-my-audits"
            to="/my-audits"
            className={`transition-all duration-200 outline-none pb-1 border-b-2 ${
              isActive("/my-audits") 
                ? (theme === "light" ? "text-black border-black font-black" : "text-[#FFD700] border-[#FFD700] font-black") 
                : (theme === "light" ? "text-gray-700 hover:text-black border-transparent font-medium" : "text-gray-300 hover:text-[#FFD700] border-transparent font-medium")
            }`}
          >
            My Audits
          </Link>
          <Link
            id="nav-my-dao"
            to="/my-dao"
            className={`transition-all duration-200 outline-none pb-1 border-b-2 ${
              isActive("/my-dao") 
                ? (theme === "light" ? "text-black border-black font-black" : "text-[#FFD700] border-[#FFD700] font-black") 
                : (theme === "light" ? "text-gray-700 hover:text-black border-transparent font-medium" : "text-gray-300 hover:text-[#FFD700] border-transparent font-medium")
            }`}
          >
            My DAO
          </Link>
          <Link
            id="nav-create"
            to="/create"
            className={`transition-all duration-200 outline-none pb-1 border-b-2 ${
              isActive("/create") 
                ? (theme === "light" ? "text-black border-black font-black" : "text-[#FFD700] border-[#FFD700] font-black") 
                : (theme === "light" ? "text-gray-700 hover:text-black border-transparent font-medium" : "text-gray-300 hover:text-[#FFD700] border-transparent font-medium")
            }`}
          >
            Submit Blueprints
          </Link>
        </nav>

        {/* WEB3 CONTROLS & THEME TOGGLE */}
        <div id="web3-control-block" className="flex flex-wrap items-center justify-center gap-3">
          {/* Light/Dark Mode Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center outline-none shrink-0 ${
              theme === "light" ? "bg-black/5 hover:bg-black/10 border-black/25 text-black" : "border-white/10 hover:bg-white/5 text-[#FFD700]"
            }`}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-black" />
            ) : (
              <Sun className="w-4 h-4 text-[#FFD700]" />
            )}
          </button>

          {/* Premium Custom Connect Wallet / Connected State Display */}
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              if (!connected) {
                return (
                  <button
                    id="arcmeta-connect-btn"
                    onClick={openConnectModal}
                    type="button"
                    className={`px-5 py-2 rounded-xl font-bold transition-all outline-none flex items-center justify-center cursor-pointer text-xs uppercase tracking-wider ${
                      theme === "light" 
                        ? "bg-black text-white hover:bg-[#1A1A1A] shadow-[0_0_15px_rgba(0,0,0,0.3)]" 
                        : "bg-[#FFD700] text-black hover:bg-amber-400 shadow-[0_0_14px_rgba(255,215,0,0.35)]"
                    }`}
                  >
                    Connect Wallet
                  </button>
                );
              }

              const truncateAddress = (addr: string) => {
                return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
              };

              const handleCopy = () => {
                navigator.clipboard.writeText(account.address);
                showToast("Wallet address copied!", true);
              };

              return (
                <div
                  id="premium-wallet-card"
                  className="relative group overflow-hidden flex flex-col md:flex-row items-stretch md:items-center gap-6 select-none transition-all duration-300 border shadow-md"
                  style={{
                    background: theme === "light" ? "#000000" : "rgba(255,215,0,0.10)",
                    border: theme === "light" ? "2px solid #FFD700" : "2px solid rgba(255,215,0,0.7)",
                    boxShadow: theme === "light" ? "0 0 15px rgba(0,0,0,0.3)" : "0 0 25px rgba(255,215,0,0.4)",
                    borderRadius: "16px",
                    padding: "12px 20px",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  {/* Card sweep shine animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:translate-x-[150%] transition-transform duration-1000 pointer-events-none" />

                  {/* Left Column: Network and status */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <div className="flex items-center text-xs font-semibold leading-none">
                      <span className="relative flex h-2 w-2 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF88]"></span>
                      </span>
                      <span id="arcmeta-connected-status" className={theme === "light" ? "text-white font-black" : "text-[#00FF88] font-bold"}>
                        Connected to Arc Testnet
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id="arcmeta-address-btn"
                        onClick={handleCopy}
                        title="Click to copy address"
                        className={`text-xs font-mono font-bold py-1 px-2 rounded transition-all cursor-pointer ${
                          theme === "light" 
                            ? "bg-black/5 hover:bg-black/15 border border-black/20 hover:border-black text-black" 
                            : "bg-black/20 hover:bg-black/40 border border-[#FFD700]/30 hover:border-[#FFD700] text-[#FFD700] hover:text-[#FFA500]"
                        }`}
                      >
                        {truncateAddress(account.address)}
                      </button>
                      <button
                        id="arcmeta-disconnect-btn"
                        onClick={() => disconnect()}
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded transition-all cursor-pointer ${
                          theme === "light"
                            ? "bg-red-600/10 hover:bg-red-600/20 text-red-700 hover:text-red-800 border border-red-600/20"
                            : "bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/15"
                        }`}
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className={`hidden md:block w-[1.5px] h-9 self-center ${theme === "light" ? "bg-black/10" : "bg-white/10"}`} />

                  {/* Right Column: USDC & EURC Balances */}
                  <div className="flex items-center flex-wrap gap-4.5 shrink-0">
                    {/* USDC Balance Card Section */}
                    <div className={`flex items-center gap-2 ${theme === "light" ? "bg-black/5" : "bg-black/15"} px-2.5 py-1.5 rounded-xl border ${theme === "light" ? "border-black/5" : "border-white/5"}`}>
                       <div className="w-5 h-5 rounded-full bg-[#2775CA] flex items-center justify-center text-white font-black text-[10px] shadow-sm shrink-0" title="USDC Logo">
                         $
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">USDC Balance</span>
                         <span className="font-orbitron font-black text-lg text-[#00FF88] md:text-xl leading-none pt-0.5" style={{ color: "#00FF88" }}>
                           {displayUsdc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                         </span>
                       </div>
                    </div>

                    {/* EURC Balance Card Section */}
                    <div className={`flex items-center gap-2 ${theme === "light" ? "bg-black/5" : "bg-black/15"} px-2.5 py-1.5 rounded-xl border ${theme === "light" ? "border-black/5" : "border-white/5"}`}>
                       <div className="w-5 h-5 rounded-full bg-[#00BFFF] flex items-center justify-center text-white font-black text-[10px] shadow-sm shrink-0" title="EURC Logo">
                         €
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">EURC Balance</span>
                         <span className="font-orbitron font-black text-lg text-[#00BFFF] md:text-xl leading-none pt-0.5" style={{ color: "#00BFFF" }}>
                           {displayEurc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                         </span>
                       </div>
                    </div>
                  </div>
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  );
}
