type OrderParams = {
  inputMint: string;
  outputMint: string;
  amount: string;
  taker: string;
  referralAccount?: string;
  referralFee?: number;
};

type OrderResponse = {
  swapType: "aggregator" | "rfq";
  requestId: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: string;
  routePlan: [
    {
      swapInfo: {
        ammKey: string;
        label: string;
        inputMint: string;
        outputMint: string;
        inAmount: string;
        outAmount: string;
        feeAmount: string;
        feeMint: string;
      };
      percent: number;
    },
  ];
  transaction: string | null;
  inputMint: string;
  outputMint: string;
  feeMint: string;
  feeBps: number;
  prioritizationFeeLamports: number;
  gasless: boolean;
  totalTime: number;
  quoteId: string;
  maker: string;
  expireAt: string;
  platformFee: {
    amount: string;
    feeBps: number;
  };
  dynamicSlippageReport: {
    slippageBps: number;
    categoryName: string;
    heuristicMaxSlippageBps: number;
  };
};

type ExecuteResponse = {
  status: "Success" | "Failed";
  signature: string;
  slot: string;
  code: number;
  error?: string;
  inputAmountResult?: string;
  outputAmountResult?: string;
  swapEvents?: {
    inputMint: string;
    inputAmount: string;
    outputMint: string;
    outputAmount: string;
  }[];
};

type SearchResponse = [
  {
    id: string;
    name: string;
    symbol: string;
    icon: string | null;
    decimals: number;
    twitter: string | null;
    telegram: string | null;
    website: string | null;
    dev: string | null;
    circSupply: number | null;
    totalSupply: number | null;
    tokenProgram: string;
    launchpad: string | null;
    partnerConfig: string | null;
    graduatedPool: string | null;
    graduatedAt: string | null;
    holderCount: number | null;
    fdv: number | null;
    mcap: number | null;
    usdPrice: number | null;
    priceBlockId: number | null;
    liquidity: number | null;
    stats5m: {
      priceChange: number | null;
      holderChange: number | null;
      liquidityChange: number | null;
      volumeChange: number | null;
      buyVolume: number | null;
      sellVolume: number | null;
      buyOrganicVolume: number | null;
      sellOrganicVolume: number | null;
      numBuys: number | null;
      numSells: number | null;
      numTraders: number | null;
      numOrganicBuyers: number | null;
      numNetBuyers: number | null;
    } | null;
    stats1h: {
      priceChange: number | null;
      holderChange: number | null;
      liquidityChange: number | null;
      volumeChange: number | null;
      buyVolume: number | null;
      sellVolume: number | null;
      buyOrganicVolume: number | null;
      sellOrganicVolume: number | null;
      numBuys: number | null;
      numSells: number | null;
      numTraders: number | null;
      numOrganicBuyers: number | null;
      numNetBuyers: number | null;
    } | null;
    stats6h: {
      priceChange: number | null;
      holderChange: number | null;
      liquidityChange: number | null;
      volumeChange: number | null;
      buyVolume: number | null;
      sellVolume: number | null;
      buyOrganicVolume: number | null;
      sellOrganicVolume: number | null;
      numBuys: number | null;
      numSells: number | null;
      numTraders: number | null;
      numOrganicBuyers: number | null;
      numNetBuyers: number | null;
    } | null;
    stats24h: {
      priceChange: number | null;
      holderChange: number | null;
      liquidityChange: number | null;
      volumeChange: number | null;
      buyVolume: number | null;
      sellVolume: number | null;
      buyOrganicVolume: number | null;
      sellOrganicVolume: number | null;
      numBuys: number | null;
      numSells: number | null;
      numTraders: number | null;
      numOrganicBuyers: number | null;
      numNetBuyers: number | null;
    };
    firstPool: {
      id: string;
      createdAt: string;
    } | null;
    audit: {
      isSus: boolean;
      mintAuthorityDisabled: boolean;
      freezeAuthorityDisabled: boolean;
      topHoldersPercentage: number | null;
      devBalancePercentage: number | null;
      devMigrations: number | null;
    } | null;
    organicScore: number | null;
    organicScoreLabel: "high" | "medium" | "low";
    isVerified: boolean;
    cexes: string[] | null;
    tags: string[] | null;
    updatedAt: string;
  },
];
