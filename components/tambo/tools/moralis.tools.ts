import { TamboTool } from "@tambo-ai/react";
import { getNFT, getNFTSchema } from "./moralis/nft";
import {
  getOHLVCByPairAddress,
  getOHLVCByPairAddressSchema,
  getPairAddressTransactions,
  getPairAddressTransactionsSchema,
  getPairSnipers,
  getPairSnipersSchema,
  getPairStatistics,
  getPairStatisticsSchema,
} from "./moralis/pair";
import {
  getPumpFunBondingTokens,
  getPumpFunBondingTokensSchema,
  getPumpFunGraduatedTokens,
  getPumpFunGraduatedTokensSchema,
  getPumpFunLatestTokens,
  getPumpFunLatestTokensSchema,
  getPumpFunTokenBondingStatus,
  getPumpFunTokenBondingStatusSchema,
} from "./moralis/pumpfun";
import {
  getTokenAggregatedPairStats,
  getTokenAggregatedPairStatsSchema,
  getTokenAnalytics,
  getTokenAnalyticsSchema,
  getTokenHoldersStats,
  getTokenHoldersStatsSchema,
  getTokenMetadata,
  getTokenMetadataSchema,
  getTokenPairs,
  getTokenPairsSchema,
  getTokenPrice,
  getTokenPriceSchema,
  getTokenSwaps,
  getTokenSwapsSchema,
  getTokenTopHolders,
  getTokenTopHoldersSchema,
} from "./moralis/token";
import {
  getWalletNativeBalance,
  getWalletNativeBalanceSchema,
  getWalletNFTs,
  getWalletNFTsSchema,
  getWalletTokenBalances,
  getWalletTokenBalancesSchema,
  getWalletTokenSwaps,
  getWalletTokenSwapsSchema,
} from "./moralis/wallet";

export const moralisTools: TamboTool[] = [
  {
    name: "getNFT",
    description:
      "A tool to get NFT information including metadata, media, ownership, and collection details",
    tool: getNFT,
    toolSchema: getNFTSchema,
  },
  {
    name: "getOHLVCByPairAddress",
    description:
      "A tool to get OHLCV(Open, High, Low, Close, and Volume) dataset for the specified trading pair",
    tool: getOHLVCByPairAddress,
    toolSchema: getOHLVCByPairAddressSchema,
  },
  {
    name: "getPairSnipers",
    description:
      "A tool to get sniper bot analysis for a trading pair, identifying early buyers and their trading performance",
    tool: getPairSnipers,
    toolSchema: getPairSnipersSchema,
  },
  {
    name: "getPairStatistics",
    description:
      "A tool to get trading pair statistics including price movements, volume analysis, and trader activity metrics",
    tool: getPairStatistics,
    toolSchema: getPairStatisticsSchema,
  },
  {
    name: "getPairAddressTransactions",
    description:
      "A tool to get transaction history for a trading pair with metadata, pagination, and token information",
    tool: getPairAddressTransactions,
    toolSchema: getPairAddressTransactionsSchema,
  },
  {
    name: "getPumpFunTokenBondingStatus",
    description:
      "A tool to get bonding curve status for the specified Pump(dot)Fun token",
    tool: getPumpFunTokenBondingStatus,
    toolSchema: getPumpFunTokenBondingStatusSchema,
  },
  {
    name: "getPumpFunBondingTokens",
    description:
      "A tool to get the list of tokens currently in bonding curve phase on Pump(dot)Fun",
    tool: getPumpFunBondingTokens,
    toolSchema: getPumpFunBondingTokensSchema,
  },
  {
    name: "getPumpFunGraduatedTokens",
    description:
      "A tool to get the list of tokens that have successfully graduated from Pump(dot)Fun bonding curve and are now trading on regular DEXs",
    tool: getPumpFunGraduatedTokens,
    toolSchema: getPumpFunGraduatedTokensSchema,
  },
  {
    name: "getPumpFunLatestTokens",
    description:
      "A tool to get the list of the most recently created tokens on Pump(dot)Fun exchange for discovering new launches",
    tool: getPumpFunLatestTokens,
    toolSchema: getPumpFunLatestTokensSchema,
  },
  {
    name: "getTokenAggregatedPairStats",
    description:
      "A tool to get an aggregated statistics for all trading pairs of the specified token",
    tool: getTokenAggregatedPairStats,
    toolSchema: getTokenAggregatedPairStatsSchema,
  },
  {
    name: "getTokenAnalytics",
    description:
      "A tool to get a comprehensive analytics data for the specified token including volume, buyers, sellers, and price metrics",
    tool: getTokenAnalytics,
    toolSchema: getTokenAnalyticsSchema,
  },
  {
    name: "getTokenHoldersStats",
    description:
      "A tool to get a comprehensive holder statistics including distribution, changes over time, and supply concentration",
    tool: getTokenHoldersStats,
    toolSchema: getTokenHoldersStatsSchema,
  },
  {
    name: "getTokenTopHolders",
    description:
      "A tool to get the list of top token holders with their balances and ownership percentages",
    tool: getTokenTopHolders,
    toolSchema: getTokenTopHoldersSchema,
  },
  {
    name: "getTokenMetadata",
    description:
      "A tool to get the metadata information for the specified token including basic info, links, and verification status",
    tool: getTokenMetadata,
    toolSchema: getTokenMetadataSchema,
  },
  {
    name: "getTokenPrice",
    description:
      "A tool to get price information for the specified token including USD price, 24h changes, and exchange details",
    tool: getTokenPrice,
    toolSchema: getTokenPriceSchema,
  },
  {
    name: "getTokenPairs",
    description:
      "A tool to get the list of trading pairs for the specified token with liquidity and volume information",
    tool: getTokenPairs,
    toolSchema: getTokenPairsSchema,
  },
  {
    name: "getTokenSwaps",
    description:
      "A tool to get the list of swap transactions for the specified token with detailed buy/sell information",
    tool: getTokenSwaps,
    toolSchema: getTokenSwapsSchema,
  },
  {
    name: "getWalletNativeBalance",
    description:
      "A tool that returns the native SOL balance information for the specified wallet",
    tool: getWalletNativeBalance,
    toolSchema: getWalletNativeBalanceSchema,
  },
  {
    name: "getWalletNFTs",
    description: "A tool to get NFTs currently held by the specified wallet",
    tool: getWalletNFTs,
    toolSchema: getWalletNFTsSchema,
  },
  {
    name: "getWalletTokenBalances",
    description:
      "A tool to get token balances (excluding NFTs) currently held by the specified wallet",
    tool: getWalletTokenBalances,
    toolSchema: getWalletTokenBalancesSchema,
  },
  {
    name: "getWalletTokenSwaps",
    description: "A tool to get the specified wallet token swap history",
    tool: getWalletTokenSwaps,
    toolSchema: getWalletTokenSwapsSchema,
  },
];
