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
  exchangeAddress: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
  exchangeName: "Raydium AMM v4";
  exchangeLogo: "https://entities-logos.s3.amazonaws.com/raydium.png";
  pairAddress: "8tzS7SkUZyHPQY7gLqsMCXZ5EDCgjESUHcB17tiR1h3Z";
  pairLabel: "SRM/USDC";
  usdPrice: 0.012604;
  usdPrice24hrPercentChange: -1.6848673946957815;
  usdPrice24hrUsdChange: -0.00021599999999999918;
  volume24hrNative: 13.243716;
  volume24hrUsd: 1960.062178;
  liquidityUsd: 63106.897187;
  baseToken: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt";
  quoteToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
  inactivePair: false;
  pair: [
    {
      tokenAddress: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt";
      tokenName: "Serum";
      tokenSymbol: "SRM";
      tokenLogo: "https://logo.moralis.io/solana-mainnet_SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt_e7445e31c3869105.webp";
      tokenDecimals: "6";
      pairTokenType: "token0";
      liquidityUsd: 31589.725586;
    },
    {
      tokenAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
      tokenName: "USD Coin";
      tokenSymbol: "USDC";
      tokenLogo: "https://logo.moralis.io/solana-mainnet_EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v_809d0dcb3d691dcff4b688115e11652c.webp";
      tokenDecimals: "6";
      pairTokenType: "token1";
      liquidityUsd: 31517.171601;
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
  creators: { address: string; share: numnber; verified: boolean };
  [];
  properties: {
    creators: { address: string; share: number }[];
    files: { uri: string; type: string }[];
  };
};
