export interface Reward {
  id: number;
  title: string;
  description: string;
  cost: number;
  estimatedDelivery: string;
}

export interface Update {
  id: number;
  date: string;
  title: string;
  content: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Comment {
  id: number;
  name: string;
  amount: number;
  comment: string;
  time: string;
}

export interface EnhancedProject {
  id: number;
  creator: string;
  title: string;
  description: string;
  tagline: string;
  targetAmount: bigint;
  raisedAmount: bigint;
  deadline: bigint;
  finalized: boolean;
  cancelled: boolean;
  token: string;
  tokenSymbol: "USDC" | "EURC";
  backers: number;
  daysLeft: number;
  faq: FAQItem[];
  rewards: Reward[];
  updates: Update[];
  comments: Comment[];
  imagePrompt?: string; // Prompt for any image generation or rendering
  imageBlobUrl?: string; // Generated image representation
}

export interface PlatformStates {
  isConnected: boolean;
  address: string | null;
  activeUserAddress: string | null;
  projects: EnhancedProject[];
  totalProjects: number;
  totalBackers: number;
  totalRaisedUSDC: number;
  totalRaisedEURC: number;
  backersMap: Record<number, string[]>;
  userContributions: Record<number, bigint>;
}
