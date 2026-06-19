import React from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider, useArcMeta } from "./contexts/ProjectContext";
import Header, { ArcMetaLogo } from "./components/Header";
import Home from "./pages/Home";
import MyProjects from "./pages/MyProjects";
import MyAudits from "./pages/MyAudits";
import MyDao from "./pages/MyDao";
import CreateProject from "./pages/CreateProject";
import ProjectDetail from "./pages/ProjectDetail";
import { Info, CheckCircle, AlertTriangle } from "lucide-react";

// RainbowKit imports
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  trustWallet,
  rainbowWallet,
} from "@rainbow-me/rainbowkit/wallets";

// Configure Wallets supporting MetaMask, WalletConnect, Coinbase Wallet, Trust Wallet, and Rainbow Wallet options
const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended Wallets",
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
        coinbaseWallet,
        trustWallet,
        rainbowWallet,
      ],
    },
  ],
  {
    appName: "ArcMeta",
    projectId: "5e28470d26229855f103db5f862b035d",
  }
);

// 1. Configure Wagmi v2 client with RainbowKit connectors
const config = createConfig({
  connectors,
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// 2. Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Floating Custom Toast Notification Component
function ToastNotification() {
  const { toast } = useArcMeta();

  if (!toast || !toast.show) return null;

  return (
    <div 
      id="arcmeta-toast"
      className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl border flex items-center gap-3 animate-[slideIn_0.3s_ease-out] shadow-2xl max-w-sm backdrop-blur-md"
      style={{
        background: toast.success ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
        borderColor: toast.success ? "rgba(16, 185, 129, 0.6)" : "rgba(239, 68, 68, 0.6)",
        boxShadow: toast.success ? "0 0 25px rgba(16, 185, 129, 0.3)" : "0 0 25px rgba(239, 68, 68, 0.3)"
      }}
    >
      {toast.success ? (
        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
      )}
      <span className="text-xs font-mono text-white leading-normal">
        {toast.text}
      </span>
    </div>
  );
}

// Brand New Loading Screen / Splash Screen Component
function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const { theme } = useArcMeta();
  const [visible, setVisible] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [status, setStatus] = React.useState("Initializing secure escrows...");

  React.useEffect(() => {
    const statuses = [
      "Initializing secure escrows...",
      "Calibrating multi-party safe custody...",
      "Compiling cryptographic blueprints...",
      "Connecting to Arc Testnet ledger...",
      "Welcome to ArcMeta!"
    ];

    let statusIndex = 0;
    const statusInterval = setInterval(() => {
      if (statusIndex < statuses.length - 1) {
        statusIndex++;
        setStatus(statuses[statusIndex]);
      }
    }, 350);

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          clearInterval(statusInterval);
          setTimeout(() => {
            setVisible(false);
            setTimeout(onFinish, 600); // Allow smooth fade out transition
          }, 300);
          return 100;
        }
        return p + 4;
      });
    }, 50);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, [onFinish]);

  const bgStyle = theme === "light" ? "bg-[#EDE8D8] text-black" : "bg-[#0A0800] text-white";

  return (
    <div
      id="splash-loading-overlay"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-700 ${bgStyle} ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-8 max-w-md w-full px-6 text-center">
        {/* Render large instance of the brand-new goldcoin handshake logo */}
        <div className="transform scale-110 md:scale-125 transition-transform duration-300">
          <ArcMetaLogo size="large" />
        </div>

        {/* Futuristic Mechanical Interactive Progress Area */}
        <div className="w-full mt-6 flex flex-col items-center">
          <div className="w-64 h-1.5 rounded-full overflow-hidden bg-black/10 dark:bg-white/10 relative">
            <div 
              className={`h-full transition-all duration-100 ${
                theme === "light" ? "bg-black" : "bg-[#FFD700]"
              }`} 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <p className="mt-4 text-[10px] font-mono tracking-widest opacity-70 uppercase animate-pulse">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}

// Inner application wrapper matching layouts
function AppContent() {
  const [loading, setLoading] = React.useState(true);

  return (
    <>
      {loading && <SplashScreen onFinish={() => setLoading(false)} />}
      <div id="arcmeta-layout" className="relative min-h-screen flex flex-col z-10 select-none">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-projects" element={<MyProjects />} />
            <Route path="/my-audits" element={<MyAudits />} />
            <Route path="/my-dao" element={<MyDao />} />
            <Route path="/create" element={<CreateProject />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
          </Routes>
        </main>
        <ToastNotification />
      </div>
    </>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ProjectProvider>
            <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AppContent />
            </HashRouter>
          </ProjectProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
