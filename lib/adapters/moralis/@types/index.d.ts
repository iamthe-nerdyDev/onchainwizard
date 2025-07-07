type TokenMetadata = {
  mint: string;
  standard: string;
  name: string;
  symbol: string;
  decimals: string;
  tokenStandard?: number;
  metaplex?: {
    metadataUri: string;
    masterEdition: boolean;
    isMutable: boolean;
    sellerFeeBasisPoints: number;
    updateAuthority: string;
    primarySaleHappened: number;
  };
  fullyDilutedValue?: string;
  totalSupply?: string;
  totalSupplyFormatted?: string;
  links?: {
    [key: string]: string;
    // reddit: "https://www.reddit.com";
    // telegram: "https://t.me/ProjectSerum";
    // twitter: "https://twitter.com/projectserum";
    // website: "https://portal.projectserum.com/";
    // github: "https://github.com/project-serum/serum-dex";
    // medium: "https://projectserum.medium.com/";
    // moralis: "https://moralis.com/chain/solana/token/price/SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt";
  };
  description?: string | null;
  isVerifiedContract: boolean;
  possibleSpam: boolean;
};

type NativeBalance = {
  solana: string;
  lamports: string;
};

type TokenBalance = {
  associatedTokenAddress: string;
  mint: string;
  amountRaw: string;
  amount: string;
  decimals: number;
  tokenStandard: number;
  name: string;
  symbol: string;
  logo: string;
  isVerifiedContract: boolean;
  possibleSpam: boolean;
};

type PumpFunToken = {
  tokenAddress: string;
  name: string;
  symbol: string;
  logo: null | string;
  decimals: string;
  priceNative: string;
  priceUsd: string;
  liquidity: string;
  fullyDilutedValuation: string | null;
  createdAt?: string;
  graduatedAt?: string;
  bondingCurveProgress?: number;
};

type TokenTopHolder = {
  balance: string;
  balanceFormatted: string;
  isContract: boolean;
  ownerAddress: string;
  usdValue: string;
  percentageRelativeToTotalSupply: number;
};

type TokenHoldersStat = {
  totalHolders: number;
  holdersByAcquisition: {
    swap: number;
    transfer: number;
    airdrop: number;
  };
  holderChange: {
    "5min": {
      change: number;
      changePercent: number;
    };
    "1h": {
      change: number;
      changePercent: number;
    };
    "6h": {
      change: number;
      changePercent: number;
    };
    "24h": {
      change: number;
      changePercent: number;
    };
    "3d": {
      change: number;
      changePercent: number;
    };
    "7d": {
      change: number;
      changePercent: number;
    };
    "30d": {
      change: number;
      changePercent: number;
    };
  };
  holderDistribution: {
    whales: number;
    sharks: number;
    dolphins: number;
    fish: number;
    octopus: number;
    crabs: number;
    shrimps: number;
  };
  holderSupply: {
    top10: {
      supply: "string";
      supplyPercent: number;
    };
    top25: {
      supply: "string";
      supplyPercent: number;
    };
    top50: {
      supply: "string";
      supplyPercent: number;
    };
    top100: {
      supply: "string";
      supplyPercent: number;
    };
    top250: {
      supply: "string";
      supplyPercent: number;
    };
    top500: {
      supply: "string";
      supplyPercent: number;
    };
  };
};

type TokenActions = {
  transactionHash: string;
  transactionType: "buy" | "sell" | "addLiquidity" | "removeLiquidity";
  transactionIndex: number;
  subCategory: "accumulation" | "partialSell" | "sellAll" | null;
  blockTimestamp: string;
  blockNumber: number;
  walletAddress: string;
  baseTokenAmount: string;
  quoteTokenAmount: string;
  baseTokenPriceUsd: number;
  quoteTokenPriceUsd: number;
  baseQuotePrice: string;
  totalValueUsd: number;
};

type TokenSwap = {
  transactionHash: string;
  transactionType: "buy" | "sell";
  transactionIndex: number;
  subCategory: "accumulation" | "partialSell" | "sellAll" | null;
  blockTimestamp: string;
  blockNumber: number;
  walletAddress: string;
  pairAddress: string;
  pairLabel: string;
  exchangeAddress: string;
  exchangeName: string;
  exchangeLogo: string;
  baseToken: string;
  quoteToken: string;
  bought: {
    address: string;
    name: string;
    symbol: string;
    logo: string;
    amount: string;
    usdPrice: number;
    usdAmount: number;
    tokenType: "token0" | "token1";
  };
  sold: {
    address: string;
    name: string;
    symbol: string;
    logo: string;
    amount: string;
    usdPrice: number;
    usdAmount: number;
    tokenType: "token0" | "token1";
  };
  baseQuotePrice: string;
  totalValueUsd: number;
};

type TokenPair = {
  exchangeAddress: string;
  exchangeName: string;
  exchangeLogo: string;
  pairAddress: string;
  pairLabel: string;
  usdPrice: number;
  usdPrice24hrPercentChange: number;
  usdPrice24hrUsdChange: number;
  volume24hrNative: number;
  volume24hrUsd: number;
  liquidityUsd: number;
  baseToken: string;
  quoteToken: string;
  inactivePair: false;
  pair: [
    {
      tokenAddress: string;
      tokenName: string;
      tokenSymbol: string;
      tokenLogo: string;
      tokenDecimals: string;
      pairTokenType: "token0" | "token1";
      liquidityUsd: number;
    },
    {
      tokenAddress: string;
      tokenName: string;
      tokenSymbol: string;
      tokenLogo: string;
      tokenDecimals: string;
      pairTokenType: "token0" | "token1";
      liquidityUsd: number;
    },
  ];
};

type TokenPairStat = {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenLogo: string;
  pairCreated: string | null;
  pairLabel: string;
  pairAddress: string;
  exchange: string;
  exchangeAddress: string;
  exchangeLogo: string;
  exchangeUrl: null | string;
  currentUsdPrice: string;
  currentNativePrice: string;
  totalLiquidityUsd: string;
  pricePercentChange: {
    "5min": number;
    "1h": number;
    "4h": number;
    "24h": number;
  };
  liquidityPercentChange: {
    "5min": number;
    "1h": number;
    "4h": number;
    "24h": number;
  };
  buys: {
    "5min": number;
    "1h": number;
    "4h": number;
    "24h": number;
  };
  sells: {
    "5min": number;
    "1h": number;
    "4h": number;
    "24h": number;
  };
  totalVolume: {
    "5min": number;
    "1h": number;
    "4h": number;
    "24h": number;
  };
  buyVolume: {
    "5min": number;
    "1h": number;
    "4h": number;
    "24h": number;
  };
  sellVolume: {
    "5min": number;
    "1h": number;
    "4h": number;
    "24h": number;
  };
  buyers: {
    "5min": number;
    "1h": number;
    "4h": number;
    "24h": number;
  };
  sellers: {
    "5min": number;
    "1h": number;
    "4h": number;
    "24h": number;
  };
};

type AggregatedTokenPairStats = {
  totalLiquidityUsd: number;
  totalActivePairs: number;
  totalActiveDexes: number;
  totalBuyers: {
    "5min": number;
    "1h": number;
    "4h": number;
    "24h": number;
  };
  totalBuyVolume: {
    "5min": number;
    "1h": number;
    "4h": number;
    "24h": number;
  };
  totalSellers: {
    "5min": number;
    "1h": number;
    "4h": number;
    "24h": number;
  };
  totalSellVolume: {
    "5min": number;
    "1h": number;
    "4h": number;
    "24h": number;
  };
  totalSwaps: {
    "5min": number;
    "1h": number;
    "4h": number;
    "24h": number;
  };
  totalVolume: {
    "5min": number;
    "1h": number;
    "4h": number;
    "24h": number;
  };
};

type TokenAnalytics = {
  tokenAddress: string;
  totalBuyVolume: {
    "5m": number;
    "1h": number;
    "6h": number;
    "24h": number;
  };
  totalSellVolume: {
    "5m": number;
    "1h": number;
    "6h": number;
    "24h": number;
  };
  totalBuyers: {
    "5m": number;
    "1h": number;
    "6h": number;
    "24h": number;
  };
  totalSellers: {
    "5m": number;
    "1h": number;
    "6h": number;
    "24h": number;
  };
  totalBuys: {
    "5m": number;
    "1h": number;
    "6h": number;
    "24h": number;
  };
  totalSells: {
    "5m": number;
    "1h": number;
    "6h": number;
    "24h": number;
  };
  uniqueWallets: {
    "5m": number;
    "1h": number;
    "6h": number;
    "24h": number;
  };
  pricePercentChange: {
    "5m": number;
    "1h": number;
    "6h": number;
    "24h": number;
  };
  usdPrice: string;
  totalLiquidityUsd: string;
  totalFullyDilutedValuation: string;
};

type TokenPrice = {
  tokenAddress: string;
  pairAddress: string;
  exchangeName: string;
  exchangeAddress: string;
  nativePrice: {
    value: string;
    symbol: string;
    name: string;
    decimals: number;
  };
  usdPrice: number;
  usdPrice24h: number;
  usdPrice24hrUsdChange: number;
  usdPrice24hrPercentChange: number;
  logo: string;
  name: string;
  symbol: string;
  isVerifiedContract: boolean;
};

type MoralisTimeFrame =
  | "10s"
  | "30s"
  | "1m"
  | "5m"
  | "10m"
  | "30m"
  | "1h"
  | "4h"
  | "12h"
  | "1d"
  | "1w"
  | "1M";

type OHLCV = {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trades: number;
};

type TokenSniper = {
  walletAddress: string;
  snipedTransactions: {
    transactionHash: string;
    transactionTimestamp: string;
    blocksAfterCreation: number;
  }[];
  sellTransactions: {
    transactionHash: string;
    transactionTimestamp: string;
    blocksAfterCreation: number;
  }[];
  totalSellTransactions: number;
  totalSnipedTransactions: number;
  totalTokensSniped: number;
  totalSnipedUsd: number;
  totalTokensSold: number;
  totalSoldUsd: number;
  currentBalance: number;
  currentBalanceUsdValue: number;
  realizedProfitPercentage: number;
  realizedProfitUsd: number;
};

type WalletNFT = {
  associatedTokenAddress: string;
  mint: string;
  name: string;
  symbol: string;
  decimals: 0;
  tokenStandard: 0;
  amount: string;
  amountRaw: string;
  possibleSpam: false;
  media: {
    status: "success";
    mimetype: string;
    originalMediaUrl: string;
    updatedAt: string;
    mediaCollection: {
      low: {
        height: number;
        width: number;
        url: string;
      };
      medium: {
        height: number;
        width: number;
        url: string;
      };
      high: {
        height: number;
        width: number;
        url: string;
      };
    };
  };
  totalSupply: string;
  attributes: { traitType: string; value: string }[];
  contract: {
    type: string;
    name: string;
    symbol: string;
  };
  collection: {
    collectionAddress: string;
    name: string;
    description: string;
    imageOriginalUrl: string;
    externalUrl: null;
    metaplexMint: string;
    sellerFeeBasisPoints: 0;
  };
  firstCreated: {
    mintTimestamp: null;
    mintBlockNumber: null;
    mintTransaction: null;
  };
  creators: { address: string; share: number; verified: boolean }[];
  properties: {
    creators: { address: string; share: number }[];
    files: { uri: string; type: string }[];
  };
};
