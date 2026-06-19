// Contract address on Sepolia/Arbitrum or simulated networks
export const ARCMETA_CONTRACT_ADDRESS = "0xa046Ab279a4D92188d1936d77A877cb7a4Ce3B10";

export const OWNER_WALLET = "0xaAbD1146639bBDe2F677CD6303Cec089B5F319D7";

export const TOKENS = {
  USDC: {
    symbol: "USDC" as const,
    name: "USD Coin",
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Mock Sepolia USDC
    decimals: 6,
  },
  EURC: {
    symbol: "EURC" as const,
    name: "Euro Coin",
    address: "0x826551890f4c2e6503b14f6116a902379c723871", // Mock Sepolia EURC
    decimals: 6,
  },
};

export const ERC20_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const ARCMETA_ABI = [
  {
    inputs: [],
    name: "projectCounter",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "_title", type: "string" },
      { name: "_description", type: "string" },
      { name: "_targetAmount", type: "uint256" },
      { name: "_duration", type: "uint256" },
      { name: "_token", type: "address" },
    ],
    name: "createProject",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_projectId", type: "uint256" },
      { name: "_amount", type: "uint256" },
    ],
    name: "contribute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_projectId", type: "uint256" }],
    name: "finalize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_projectId", type: "uint256" }],
    name: "cancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_projectId", type: "uint256" }],
    name: "claimRefund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_projectId", type: "uint256" }],
    name: "getProjectBackers",
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPlatformStats",
    outputs: [
      { name: "_totalRaised", type: "uint256" },
      { name: "_totalBackers", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "", type: "uint256" },
      { name: "", type: "address" },
    ],
    name: "contributions",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
