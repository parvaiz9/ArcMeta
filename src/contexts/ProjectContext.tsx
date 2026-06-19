import React, { createContext, useContext, useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, usePublicClient } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { 
  ARCMETA_CONTRACT_ADDRESS, 
  ARCMETA_ABI, 
  OWNER_WALLET, 
  TOKENS, 
  ERC20_ABI 
} from "../web3";
import { EnhancedProject, Reward, Update, FAQItem, Comment } from "../types";

// Setup Initial Seed Projects
const PRESEEDED_PROJECTS: Partial<EnhancedProject>[] = [
  {
    id: 0,
    creator: OWNER_WALLET,
    title: "Kinetic Zenith Tourbillon Watch",
    tagline: "Spectacular hand-assembled tourbillon escapement with sandblasted anodized cobalt plates.",
    description: "The Kinetic Zenith is a celebration of classic mechanical chronometry. Combining a bespoke triple-axis tourbillon with contemporary aerospace materials, this titanium-cased timepiece features open-heart mechanical architecture, showing every transfer of torque from mainspring to gears. We require funding to machine the ultra-strict 2-micron gears, finish the balance assemblies, and produce a pilot series of 50 individually numbered movements.",
    targetAmount: 50000000000n, // $50,000, 6 decimals
    raisedAmount: 39500000000n, // $39,500, 6 decimals
    tokenSymbol: "USDC",
    token: TOKENS.USDC.address,
    backers: 124,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 86400 * 18), // 18 days left
    finalized: false,
    cancelled: false,
    faq: [
      { question: "Is this watch water resistant?", answer: "Yes, the aerospace titanium enclosure is rated up to 10 ATM / 100 meters, utilizing custom Viton high-temperature seals." },
      { question: "Where is the manufacturing taking place?", answer: "All precision gear cutting and polishing is performed in our boutique micro-machining workshop in Neuchâtel, Switzerland." }
    ],
    rewards: [
      { id: 1, title: "Anodized Cobalt Escapement Plate", description: "Receive a real sandblasted anodized cobalt escapement plate from our validation prototypes. Fits beautifully as a desk kinetic coin.", cost: 150, estimatedDelivery: "September 2026" },
      { id: 2, title: "The Zenith Timepiece (Early Bird)", description: "One Kinetic Zenith timepiece, complete with bespoke bespoke skeleton window and matching blue viton band.", cost: 1250, estimatedDelivery: "January 2027" }
    ],
    updates: [
      { id: 1, date: "2026-06-15", title: "Micro-gear tolerance validation report", content: "Our wire-EDM cutter successfully achieved a 1.5-micron tolerance on the cobalt balance teeth today! Frictional power loss is down 8.5%." }
    ],
    comments: [
      { id: 1, name: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", amount: 1250, comment: "Incredible attention to hand assembly. Pledged for early bird!", time: "2 days ago" },
      { id: 2, name: simulatedWalletFallbackAddress(), amount: 150, comment: "This mechanical chronograph is gorgeous. Backing this mechanical dream!", time: "1 day ago" }
    ]
  },
  {
    id: 1,
    creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    title: "Archimedes Helix Hydraulic Pump",
    tagline: "High-yield bronze screw hydro-lifter for gravity micro-hydro energy projects.",
    description: "Harnessing ancient mechanical principles for off-grid power, the Archimedes Helix represents a high-efficiency hydraulic motor and pump designed for low-head water channels. Machined from ultra-durable manganese bronze and stainless steel, this double-flighted screw runs on heavy ceramic seal bearings, operating without fossil fuels or vulnerable microchips. Funding will enable sand-casting of the generator turbine plates and fluid dynamics testing.",
    targetAmount: 35000000000n, // $35,000
    raisedAmount: 36200000000n, // $36,200 (Funded!)
    tokenSymbol: "EURC",
    token: TOKENS.EURC.address,
    backers: 82,
    deadline: BigInt(Math.floor(Date.now() / 1000) - 86400 * 3), // Finished 3 days ago (funded)
    finalized: true,
    cancelled: false,
    faq: [
      { question: "What is the optimal flow rate?", answer: "This design thrives in lower heads (1.5 to 4 meters) with a volumetric flow of 45-80 liters per second." }
    ],
    rewards: [
      { id: 1, title: "Bespoke Scale Cast Model", description: "Desktop scale manganese-cast screw turbine model showing kinetic mechanical fluid flow when turned.", cost: 300, estimatedDelivery: "November 2026" }
    ],
    updates: [
      { id: 1, date: "2026-06-18", title: "Casting mold finalised!", content: "Sand molds are now complete. We have initialized raw manganese-bronze melting logs. Ready for final pours once funding escrow unlocks." }
    ],
    comments: [
      { id: 1, name: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", amount: 300, comment: "Exactly what is needed for sustainable gravity irrigation channels.", time: "4 days ago" }
    ]
  },
  {
    id: 2,
    creator: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    title: "Anorthoscopic Projection Wheel",
    tagline: "Optical shutter wheel mechanism utilizing precision titanium counter-weights.",
    description: "An optical homage to early kinetic mechanical design. Built using a gear-train differential that syncs an exterior multi-aperture shutter disk with an internal counter-rotating projector disk, this device recreates pristine optical motion without modern screen technologies. We have prototyped the laser cutting templates and seek capital to machine brass gears and precision laser-mark standard phenakistiscope illustration slots.",
    targetAmount: 20000000000n, // $20,000
    raisedAmount: 4800000000n, // $4,800
    tokenSymbol: "USDC",
    token: TOKENS.USDC.address,
    backers: 19,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 86400 * 45), // 45 days left
    finalized: false,
    cancelled: false,
    faq: [
      { question: "Are illustration discs swap-able?", answer: "Yes! There is a rapid-release spring clip in the central spindle, making disk swap-out take under 3 seconds." }
    ],
    rewards: [
      { id: 1, title: "Interactive Shutter Disk Core", description: "Hand-machined projection shutter with precision ball bearings to spin freely as an executive accessory.", cost: 80, estimatedDelivery: "August 2026" }
    ],
    updates: [],
    comments: []
  },
  {
    id: 3,
    creator: OWNER_WALLET,
    title: "Sterling Cycle Cryo-Engine",
    tagline: "Ultra-precise beta-type Stirling thermo-coupler with zero-friction seals.",
    description: "A mechanical marvel for thermal fluid physics. This beta-type Stirling cryo-cooler runs in reverse: by spinning the drive crankshaft via water or gravity power, it produces sub-zero temperatures (-40°C) inside a sealed helium chamber using only thermal mechanical compression. This engine features zero-wear graphite pistons and ultra-precise borosilicate glass heat exchangers. We require crowdfunding to procure the specialized heat tubes and vacuum-sealing rigs.",
    targetAmount: 40000000000n, // $40,000
    raisedAmount: 0n, // $0
    tokenSymbol: "EURC",
    token: TOKENS.EURC.address,
    backers: 0,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 86400 * 4), // 4 days left
    finalized: false,
    cancelled: true, // Cancelled / Failed campaign example
    faq: [],
    rewards: [
      { id: 1, title: "Cryo-Exchanger Glass Sleeve", description: "Get our special vacuum-sealed high-purity borosilicate structural temperature sleeve.", cost: 100, estimatedDelivery: "October 2026" }
    ],
    updates: [],
    comments: []
  }
];

function simulatedWalletFallbackAddress(): string {
  return "0xa046Ab279a4D92188d1936d77A877cb7a4Ce3B10";
}

interface ProjectContextType {
  isConnected: boolean;
  address: string | null;
  activeUserAddress: string | null;
  projects: EnhancedProject[];
  isContractLoading: boolean;
  totalProjects: number;
  totalBackers: number;
  totalRaisedUSDC: number;
  totalRaisedEURC: number;
  backersMap: Record<number, string[]>;
  userContributions: Record<number, bigint>;
  simulatedWallet: string | null;
  setSimulatedWallet: (addr: string | null) => void;
  usdcBalance: number;
  eurcBalance: number;
  toast: { show: boolean; text: string; success: boolean } | null;
  showToast: (text: string, success?: boolean) => void;
  approveTokenTx: (tokenSymbol: "USDC" | "EURC", amount: number) => Promise<string>;
  contributeToProjectTx: (projectId: number, amount: number) => Promise<string>;
  createProjectTx: (title: string, desc: string, targetUSD: number, durationDays: number, tokenSymbol: "USDC" | "EURC") => Promise<string>;
  finalizeTx: (projectId: number) => Promise<boolean>;
  cancelTx: (projectId: number) => Promise<boolean>;
  claimRefundTx: (projectId: number) => Promise<boolean>;
  refetchProjects: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { isConnected, address } = useAccount();
  const [simulatedWallet, setSimulatedWallet] = useState<string | null>(() => {
    return localStorage.getItem("arcmeta_simulated_wallet") || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  });

  // USDC & EURC simulating states
  const [usdcBalance, setUsdcBalance] = useState<number>(() => {
    const saved = localStorage.getItem("arcmeta_usdc_balance");
    return saved ? Number(saved) : 10000;
  });

  const [eurcBalance, setEurcBalance] = useState<number>(() => {
    const saved = localStorage.getItem("arcmeta_eurc_balance");
    return saved ? Number(saved) : 5000;
  });

  useEffect(() => {
    localStorage.setItem("arcmeta_usdc_balance", usdcBalance.toString());
  }, [usdcBalance]);

  useEffect(() => {
    localStorage.setItem("arcmeta_eurc_balance", eurcBalance.toString());
  }, [eurcBalance]);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("arcmeta_theme") as "light" | "dark") || "dark";
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    localStorage.setItem("arcmeta_theme", theme);
    if (theme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  const activeUserAddress = isConnected ? (address || null) : null;

  // Clear private states instantly on disconnect
  useEffect(() => {
    if (!isConnected) {
      setUserContributions({});
    }
  }, [isConnected, address]);

  // Track simulated wallet in localstorage
  useEffect(() => {
    if (simulatedWallet) {
      localStorage.setItem("arcmeta_simulated_wallet", simulatedWallet);
    } else {
      localStorage.removeItem("arcmeta_simulated_wallet");
    }
  }, [simulatedWallet]);

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; text: string; success: boolean } | null>(null);
  const showToast = (text: string, success: boolean = true) => {
    setToast({ show: true, text, success });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Local/simulated state for newly created/modified campaigns
  const [localProjects, setLocalProjects] = useState<EnhancedProject[]>(() => {
    const saved = localStorage.getItem("arcmeta_local_projects");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((p: any) => ({
          ...p,
          targetAmount: BigInt(p.targetAmount),
          raisedAmount: BigInt(p.raisedAmount),
          deadline: BigInt(p.deadline),
        }));
      } catch (err) {
        console.error("Failed to parse cached local projects", err);
      }
    }

    // Build default enhanced project objects
    return PRESEEDED_PROJECTS.map((proj) => {
      const isCompleted = proj.deadline ? proj.deadline < BigInt(Math.floor(Date.now() / 1000)) : false;
      const daysLeft = proj.deadline
        ? Math.max(0, Math.floor(Number(proj.deadline - BigInt(Math.floor(Date.now() / 1000))) / 86400))
        : 10;
      return {
        id: proj.id!,
        creator: proj.creator || OWNER_WALLET,
        title: proj.title || "",
        description: proj.description || "",
        tagline: proj.tagline || "",
        targetAmount: proj.targetAmount || 0n,
        raisedAmount: proj.raisedAmount || 0n,
        deadline: proj.deadline || 0n,
        finalized: proj.finalized || false,
        cancelled: proj.cancelled || false,
        token: proj.token || "",
        tokenSymbol: proj.tokenSymbol || "USDC",
        backers: proj.backers || 0,
        daysLeft,
        faq: proj.faq || [],
        rewards: proj.rewards || [],
        updates: proj.updates || [],
        comments: proj.comments || []
      } as EnhancedProject;
    });
  });

  // Keep local storage in sync
  useEffect(() => {
    const serialized = localProjects.map((p) => ({
      ...p,
      targetAmount: p.targetAmount.toString(),
      raisedAmount: p.raisedAmount.toString(),
      deadline: p.deadline.toString(),
    }));
    localStorage.setItem("arcmeta_local_projects", JSON.stringify(serialized));
  }, [localProjects]);

  // --- CONTRACT READ INTEGRATION ---
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const { data: projectCounterData, refetch: refetchCounter } = useReadContract({
    address: ARCMETA_CONTRACT_ADDRESS,
    abi: ARCMETA_ABI,
    functionName: "projectCounter",
  } as any);

  const { data: platformStatsData, refetch: refetchStats } = useReadContract({
    address: ARCMETA_CONTRACT_ADDRESS,
    abi: ARCMETA_ABI,
    functionName: "getPlatformStats",
  } as any);

  // Read raw contract campaigns individually if list is available
  const [onChainProjectsRaw, setOnChainProjectsRaw] = useState<any[]>([]);
  const [backersMap, setBackersMap] = useState<Record<number, string[]>>({});
  const [userContributions, setUserContributions] = useState<Record<number, bigint>>({});
  const [isContractLoading, setIsContractLoading] = useState(false);

  const fetchOnChainData = async () => {
    if (!publicClient) return;
    setIsContractLoading(true);
    try {
      // Read total projects
      const count = await publicClient.readContract({
        address: ARCMETA_CONTRACT_ADDRESS,
        abi: ARCMETA_ABI,
        functionName: "projectCounter",
      } as any) as bigint;
      
      const totalCount = Number(count || 0n);
      const tempProjects: any[] = [];
      const tempBackersMap: Record<number, string[]> = {};
      const tempContributions: Record<number, bigint> = {};

      for (let i = 0; i < totalCount; i++) {
        // Fetch project mapping
        // In on-chain contract, project fields are usually structured
        try {
          // Fallback reading of public variables
          const pData = await publicClient.readContract({
            address: ARCMETA_CONTRACT_ADDRESS,
            abi: ARCMETA_ABI,
            functionName: "getProjectBackers", // replace if getProject struct read is needed
            args: [BigInt(i)]
          } as any) as string[];
          tempBackersMap[i] = pData || [];
        } catch (e) {
          tempBackersMap[i] = [];
        }

        if (activeUserAddress) {
          try {
            const contribVal = await publicClient.readContract({
              address: ARCMETA_CONTRACT_ADDRESS,
              abi: ARCMETA_ABI,
              functionName: "contributions",
              args: [BigInt(i), activeUserAddress as `0x${string}`]
            } as any) as bigint;
            tempContributions[i] = contribVal || 0n;
          } catch (e) {
            tempContributions[i] = 0n;
          }
        } else {
          tempContributions[i] = 0n;
        }
      }

      setBackersMap(tempBackersMap);
      setUserContributions(tempContributions);
    } catch (err) {
      console.warn("Fallback to simulated on-chain mappings inside ProjectContext", err);
    } finally {
      setIsContractLoading(false);
    }
  };

  useEffect(() => {
    fetchOnChainData();
  }, [publicClient, activeUserAddress]);

  const refetchProjects = () => {
    refetchCounter();
    refetchStats();
    fetchOnChainData();
  };

  // Merge on-chain data representation or fallback to loaded mock cache
  const [mergedProjects, setMergedProjects] = useState<EnhancedProject[]>([]);

  useEffect(() => {
    // Merge on-chain mock tracking inside local storage or standard mock context
    const updated = localProjects.map((p) => {
      // If we have backer overrides from chain, merge them
      const chainBackers = backersMap[p.id];
      const hasChainBackers = chainBackers !== undefined;
      const finalBackerCount = hasChainBackers ? Math.max(chainBackers.length, p.backers) : p.backers;

      // Adjust deadline relative count
      const secondsLeft = p.deadline - BigInt(Math.floor(Date.now() / 1000));
      const daysLeft = secondsLeft > 0n ? Math.max(0, Number(secondsLeft / 86400n)) : 0;

      return {
        ...p,
        backers: finalBackerCount,
        daysLeft,
      };
    });

    setMergedProjects(updated);
  }, [localProjects, backersMap]);

  // Cumulative Live Statistics Calculations
  const totalProjects = mergedProjects.length;
  const totalBackers = mergedProjects.reduce((acc, p) => acc + p.backers, 0);

  const totalRaisedUSDC = mergedProjects
    .filter((p) => p.tokenSymbol === "USDC")
    .reduce((acc, p) => acc + Number(p.raisedAmount) / 1000000, 0);

  const totalRaisedEURC = mergedProjects
    .filter((p) => p.tokenSymbol === "EURC")
    .reduce((acc, p) => acc + Number(p.raisedAmount) / 1000000, 0);

  // --- ESCROW TRANSACTION FLOWS ---

  // 1. Approve Spending ERC20 Allowance
  const approveTokenTx = async (tokenSymbol: "USDC" | "EURC", amount: number): Promise<string> => {
    const tokenMetadata = TOKENS[tokenSymbol];
    const unitAmount = parseUnits(amount.toString(), tokenMetadata.decimals);

    if (isConnected && writeContractAsync) {
      try {
        showToast(`Requesting allowance sign for ${amount} ${tokenSymbol}...`, true);
        const hash = await writeContractAsync({
          address: tokenMetadata.address as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [ARCMETA_CONTRACT_ADDRESS as `0x${string}`, unitAmount],
        } as any);
        showToast(`Allowance transaction submitted! Hash: ${hash.slice(0, 10)}...`, true);
        return hash;
      } catch (err: any) {
        console.error("Allowance approval failed", err);
        showToast(`Approval failed: ${err.message || "Rejected"}`, false);
        throw err;
      }
    }

    // Simulated allowance receipt
    showToast(`Simulated! Allowed spending of ${amount} ${tokenSymbol}.`, true);
    return "sim-approve-" + Math.floor(Math.random() * 10000000);
  };

  // 2. Pledge escrow contribution
  const contributeToProjectTx = async (projectId: number, amount: number): Promise<string> => {
    const project = mergedProjects.find((p) => p.id === projectId);
    if (!project) throw new Error("Project not found");

    const tokenSymbol = project.tokenSymbol;
    const tokenMetadata = TOKENS[tokenSymbol];
    const unitAmount = parseUnits(amount.toString(), tokenMetadata.decimals);

    if (isConnected && writeContractAsync) {
      try {
        showToast(`Submitting pledge transaction of ${amount} ${tokenSymbol}...`, true);
        const hash = await writeContractAsync({
          address: ARCMETA_CONTRACT_ADDRESS as `0x${string}`,
          abi: ARCMETA_ABI,
          functionName: "contribute",
          args: [BigInt(projectId), unitAmount],
        } as any);
        showToast(`Escrow pledge completed! Hash: ${hash.slice(0, 10)}...`, true);

        // Sync local representation
        setLocalProjects((prev) =>
          prev.map((p) => {
            if (p.id === projectId) {
              const updatedBackerNames = [
                ...p.comments,
                {
                  id: p.comments.length + 1,
                  name: activeUserAddress || "Anonymous Backer",
                  amount,
                  comment: "Backed this mechanical miracle directly!",
                  time: "Just now"
                }
              ];
              return {
                ...p,
                raisedAmount: p.raisedAmount + unitAmount,
                backers: p.backers + 1,
                comments: updatedBackerNames,
              };
            }
            return p;
          })
        );
        refetchProjects();

        // Reduce simulated balances
        if (tokenSymbol === "USDC") {
          setUsdcBalance((prev) => Math.max(0, prev - amount));
        } else {
          setEurcBalance((prev) => Math.max(0, prev - amount));
        }

        return hash;
      } catch (err: any) {
        console.error("Pledge failed", err);
        showToast(`Pledge failed: ${err.message || "Rejected"}`, false);
        throw err;
      }
    }

    // Simulated Deposit
    setLocalProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedBackerNames = [
            ...p.comments,
            {
              id: p.comments.length + 1,
              name: activeUserAddress || "Simulated Wallet",
              amount,
              comment: "Pledged via simulated Web3 provider!",
              time: "Just now"
            }
          ];
          return {
            ...p,
            raisedAmount: p.raisedAmount + unitAmount,
            backers: p.backers + 1,
            comments: updatedBackerNames,
          };
        }
        return p;
      })
    );

    // Track simulated contributions locally
    setUserContributions((prev) => ({
      ...prev,
      [projectId]: (prev[projectId] || 0n) + unitAmount,
    }));

    // Track simulated balance reduction
    if (tokenSymbol === "USDC") {
      setUsdcBalance((prev) => Math.max(0, prev - amount));
    } else {
      setEurcBalance((prev) => Math.max(0, prev - amount));
    }

    // Track backer maps locally
    setBackersMap((prev) => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), activeUserAddress || "Anonymous"],
    }));

    showToast(`Simulated pledge of ${amount} ${tokenSymbol} completed!`, true);
    return "sim-pledge-" + Math.floor(Math.random() * 10000000);
  };

  // 3. Register Campaign / Create Project
  const createProjectTx = async (
    title: string,
    desc: string,
    targetUSD: number,
    durationDays: number,
    tokenSymbol: "USDC" | "EURC"
  ): Promise<string> => {
    const tokenMetadata = TOKENS[tokenSymbol];
    const tokenUnitTarget = parseUnits(targetUSD.toString(), tokenMetadata.decimals);
    const deadlineStamp = BigInt(Math.floor(Date.now() / 1000) + durationDays * 86400);

    if (isConnected && writeContractAsync) {
      try {
        showToast(`Broadcasting campaign on-chain...`, true);
        const hash = await writeContractAsync({
          address: ARCMETA_CONTRACT_ADDRESS as `0x${string}`,
          abi: ARCMETA_ABI,
          functionName: "createProject",
          args: [title, desc, tokenUnitTarget, BigInt(durationDays * 86400), tokenMetadata.address as `0x${string}`],
        } as any);

        const newId = localProjects.length;
        const newProj: EnhancedProject = {
          id: newId,
          creator: activeUserAddress || OWNER_WALLET,
          title,
          description: desc,
          tagline: desc.slice(0, 100) + "...",
          targetAmount: tokenUnitTarget,
          raisedAmount: 0n,
          deadline: deadlineStamp,
          finalized: false,
          cancelled: false,
          token: tokenMetadata.address,
          tokenSymbol,
          backers: 0,
          daysLeft: durationDays,
          faq: [],
          rewards: [
            { id: 1, title: "Official Campaign Acknowledgement", description: "Receive digital micro-acknowledgement on campaign milestone releases.", cost: Math.floor(targetUSD * 0.01) || 10, estimatedDelivery: "September 2026" }
          ],
          updates: [],
          comments: []
        };

        setLocalProjects((prev) => [...prev, newProj]);
        showToast(`Campaign broadcasted! Tx: ${hash.slice(0, 12)}...`, true);
        refetchProjects();
        return hash;
      } catch (err: any) {
        console.error("Failed to register campaign", err);
        showToast(`Failed to register: ${err.message || "Rejected"}`, false);
        throw err;
      }
    }

    // Simulated creation flow
    const newId = localProjects.length;
    const newProj: EnhancedProject = {
      id: newId,
      creator: activeUserAddress || OWNER_WALLET,
      title,
      description: desc,
      tagline: desc.slice(0, 100) + "...",
      targetAmount: tokenUnitTarget,
      raisedAmount: 0n,
      deadline: deadlineStamp,
      finalized: false,
      cancelled: false,
      token: tokenMetadata.address,
      tokenSymbol,
      backers: 0,
      daysLeft: durationDays,
      faq: [],
      rewards: [
        { id: 1, title: "Campaign Alpha Supporter Core", description: "Collectible scale components or model files.", cost: 25, estimatedDelivery: "September 2026" }
      ],
      updates: [],
      comments: []
    };

    setLocalProjects((prev) => [...prev, newProj]);
    showToast(`Campaign created successfully (Simulated)!`, true);
    return "sim-create-" + Math.floor(Math.random() * 10000000);
  };

  // 4. Finalize / Unlock Escrow (Creator Only)
  const finalizeTx = async (projectId: number): Promise<boolean> => {
    if (isConnected && writeContractAsync) {
      try {
        showToast(`Releasing campaign funds to creator...`, true);
        const hash = await writeContractAsync({
          address: ARCMETA_CONTRACT_ADDRESS as `0x${string}`,
          abi: ARCMETA_ABI,
          functionName: "finalize",
          args: [BigInt(projectId)],
        } as any);
        showToast(`Escrow released successfully! Tx: ${hash.slice(0, 10)}...`, true);

        setLocalProjects((prev) =>
          prev.map((p) => {
            if (p.id === projectId) return { ...p, finalized: true };
            return p;
          })
        );
        refetchProjects();
        return true;
      } catch (err: any) {
        console.error(err);
        showToast(`Failed to release: ${err.message || "Error"}`, false);
        return false;
      }
    }

    // Simulated
    setLocalProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) return { ...p, finalized: true };
        return p;
      })
    );
    showToast(`Escrow released successfully to creator.`, true);
    return true;
  };

  // 5. Cancel Project (Creator / Admin Only)
  const cancelTx = async (projectId: number): Promise<boolean> => {
    if (isConnected && writeContractAsync) {
      try {
        showToast(`Cancelling on-chain campaign...`, true);
        const hash = await writeContractAsync({
          address: ARCMETA_CONTRACT_ADDRESS as `0x${string}`,
          abi: ARCMETA_ABI,
          functionName: "cancel",
          args: [BigInt(projectId)],
        } as any);
        showToast(`Campaign cancelled correctly! Tx: ${hash.slice(0, 10)}...`, true);

        setLocalProjects((prev) =>
          prev.map((p) => {
            if (p.id === projectId) return { ...p, cancelled: true };
            return p;
          })
        );
        refetchProjects();
        return true;
      } catch (err: any) {
        console.error(err);
        showToast(`Cancellation rejected: ${err.message || "Error"}`, false);
        return false;
      }
    }

    // Simulated
    setLocalProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) return { ...p, cancelled: true };
        return p;
      })
    );
    showToast(`Campaign cancelled. Backers are eligible for complete refunds.`, true);
    return true;
  };

  // 6. Claim Refund (Backers Only)
  const claimRefundTx = async (projectId: number): Promise<boolean> => {
    const proj = localProjects.find((p) => p.id === projectId);
    const tokenSymbol = proj?.tokenSymbol || "USDC";
    const refundUnitAmount = userContributions[projectId] || 0n;
    const refundNormalAmt = Number(refundUnitAmount) / 1000000; // 6 decimals standard for USDC/EURC

    if (isConnected && writeContractAsync) {
      try {
        showToast(`Withdrawing contribution stakes from escrow...`, true);
        const hash = await writeContractAsync({
          address: ARCMETA_CONTRACT_ADDRESS as `0x${string}`,
          abi: ARCMETA_ABI,
          functionName: "claimRefund",
          args: [BigInt(projectId)],
        } as any);
        showToast(`Withdrawn successfully! Tx: ${hash.slice(0, 10)}...`, true);

        // Deduct contribution
        setUserContributions((prev) => ({
          ...prev,
          [projectId]: 0n,
        }));

        // Adjust simulated balances
        if (tokenSymbol === "USDC") {
          setUsdcBalance((prev) => prev + refundNormalAmt);
        } else {
          setEurcBalance((prev) => prev + refundNormalAmt);
        }

        refetchProjects();
        return true;
      } catch (err: any) {
        console.error(err);
        showToast(`Refund retrieval failed: ${err.message || "Error"}`, false);
        return false;
      }
    }

    // Simulated
    setUserContributions((prev) => ({
      ...prev,
      [projectId]: 0n,
    }));

    // Adjust simulated balances
    if (tokenSymbol === "USDC") {
      setUsdcBalance((prev) => prev + refundNormalAmt);
    } else {
      setEurcBalance((prev) => prev + refundNormalAmt);
    }

    showToast(`Escrow refund claimed. Token balance updated in wallet.`, true);
    return true;
  };

  return (
    <ProjectContext.Provider
      value={{
        isConnected,
        address: address || null,
        activeUserAddress,
        projects: mergedProjects,
        isContractLoading,
        totalProjects,
        totalBackers,
        totalRaisedUSDC,
        totalRaisedEURC,
        backersMap,
        userContributions,
        simulatedWallet,
        setSimulatedWallet,
        usdcBalance,
        eurcBalance,
        toast,
        showToast,
        approveTokenTx,
        contributeToProjectTx,
        createProjectTx,
        finalizeTx,
        cancelTx,
        claimRefundTx,
        refetchProjects,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useArcMeta() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useArcMeta must be used within a ProjectProvider");
  }
  return context;
}
