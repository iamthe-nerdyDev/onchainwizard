import { omit } from "lodash";
import AppClient from "../client";
import qs from "querystring";
import { z } from "zod";

const client = new AppClient().getInstance();

export const getOHLVCByPairAddressSchema = z
  .function()
  .args(
    z
      .object({
        pairAddress: z
          .string()
          .describe(
            "The unique address of the trading pair/pool to retrieve OHLCV data for (e.g., Raydium, Orca, or Jupiter pair address)"
          ),
        timeframe: z
          .enum([
            "10s",
            "30s",
            "1m",
            "5m",
            "10m",
            "30m",
            "1h",
            "4h",
            "12h",
            "1d",
            "1w",
            "1M",
          ])
          .describe(
            "The time interval for each candlestick/bar (10s=10 seconds, 30s=30 seconds, 1m=1 minute, 5m=5 minutes, 10m=10 minutes, 30m=30 minutes, 1h=1 hour, 4h=4 hours, 12h=12 hours, 1d=1 day, 1w=1 week, 1M=1 month)"
          ),
        currency: z
          .enum(["usd", "native"])
          .describe(
            "The currency denomination for price data (usd=US Dollar values, native=denominated in the native quote token of the pair)"
          ),
        fromDate: z
          .string()
          .describe(
            "Start date for the OHLCV data range in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)"
          ),
        toDate: z
          .string()
          .describe(
            "End date for the OHLCV data range in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)"
          ),
        limit: z
          .number()
          .optional()
          .describe(
            "Maximum number of OHLCV records to return (typically 1-1000, depending on timeframe and date range)"
          ),
        cursor: z
          .string()
          .optional()
          .describe(
            "Pagination cursor for retrieving the next set of results when dealing with large datasets"
          ),
      })
      .describe(
        "Parameters for retrieving OHLCV (Open, High, Low, Close, Volume) candlestick data for a specific trading pair"
      )
  )
  .returns(
    z
      .object({
        cursor: z
          .string()
          .nullable()
          .describe(
            "Pagination cursor for retrieving the next set of results, null if no more data available"
          ),
        page: z
          .number()
          .describe(
            "Current page number in the paginated response (typically starts at 1)"
          ),
        pairAddress: z
          .string()
          .describe("The trading pair address that was queried for OHLCV data"),
        tokenAddress: z
          .string()
          .describe(
            "The primary token address in the trading pair (usually the base token)"
          ),
        timeframe: z
          .enum([
            "10s",
            "30s",
            "1m",
            "5m",
            "10m",
            "30m",
            "1h",
            "4h",
            "12h",
            "1d",
            "1w",
            "1M",
          ])
          .describe("The time interval used for aggregating the OHLCV data"),
        currency: z
          .enum(["usd", "native"])
          .describe(
            "The currency denomination used for the price data in the response"
          ),
        result: z
          .array(
            z
              .object({
                timestamp: z
                  .string()
                  .describe(
                    "ISO 8601 timestamp marking the start of this OHLCV period/candlestick"
                  ),
                open: z
                  .number()
                  .describe(
                    "Opening price at the beginning of the time period (first trade price)"
                  ),
                high: z
                  .number()
                  .describe("Highest price reached during the time period"),
                low: z
                  .number()
                  .describe("Lowest price reached during the time period"),
                close: z
                  .number()
                  .describe(
                    "Closing price at the end of the time period (last trade price)"
                  ),
                volume: z
                  .number()
                  .describe(
                    "Total trading volume during the time period (amount of tokens traded)"
                  ),
                trades: z
                  .number()
                  .describe(
                    "Total number of individual trades executed during the time period"
                  ),
              })
              .describe(
                "Individual OHLCV candlestick data point representing price action and volume for a specific time period"
              )
          )
          .describe(
            "Array of OHLCV data points ordered chronologically, suitable for creating candlestick charts and technical analysis"
          ),
      })
      .describe(
        "Complete OHLCV dataset for the specified trading pair, including metadata and pagination information"
      )
  );

export const getOHLVCByPairAddress = async (filter: {
  pairAddress: string;
  timeframe: MoralisTimeFrame;
  currency: "usd" | "native";
  fromDate: string;
  toDate: string;
  limit?: number;
  cursor?: string;
}) => {
  const query = qs.stringify(omit(filter, "pairAddress"));
  const { error, message, data } = await client.get(
    `/moralis/pair/${filter.pairAddress}/ohlvc?${query}`
  );

  if (error) throw new Error(message);
  return data as {
    cursor: null | string;
    page: 1;
    pairAddress: string;
    tokenAddress: string;
    timeframe: MoralisTimeFrame;
    currency: "usd" | "native";
    result: OHLCV[];
  };
};

export const getPairSnipersSchema = z
  .function()
  .args(
    z
      .object({
        address: z
          .string()
          .describe(
            "The trading pair address to analyze for sniper bot activity"
          ),
        blocksAfterCreation: z
          .number()
          .optional()
          .describe(
            "Maximum number of blocks after token creation to consider as 'sniping' activity (default: typically 5-10 blocks, representing very early purchases)"
          ),
      })
      .describe(
        "Parameters for identifying and analyzing sniper bot activity on a trading pair"
      )
  )
  .returns(
    z
      .object({
        blockNumber: z
          .number()
          .describe(
            "The current block number when this analysis was performed"
          ),
        blockTimestamp: z
          .string()
          .describe(
            "ISO timestamp of the current block when analysis was performed"
          ),
        transactionHash: z
          .string()
          .describe("Reference transaction hash for the analysis context"),
        result: z
          .array(
            z
              .object({
                walletAddress: z
                  .string()
                  .describe(
                    "The wallet address identified as engaging in sniping activity"
                  ),
                snipedTransactions: z
                  .array(
                    z
                      .object({
                        transactionHash: z
                          .string()
                          .describe("Transaction hash of the sniping purchase"),
                        transactionTimestamp: z
                          .string()
                          .describe(
                            "ISO timestamp when the sniping transaction occurred"
                          ),
                        blocksAfterCreation: z
                          .number()
                          .describe(
                            "Number of blocks after token creation when this snipe occurred (lower = faster/better snipe)"
                          ),
                      })
                      .describe(
                        "Individual sniping transaction details showing speed and timing"
                      )
                  )
                  .describe(
                    "Array of all sniping transactions performed by this wallet"
                  ),
                sellTransactions: z
                  .array(
                    z
                      .object({
                        transactionHash: z
                          .string()
                          .describe("Transaction hash of the sell transaction"),
                        transactionTimestamp: z
                          .string()
                          .describe(
                            "ISO timestamp when the sell transaction occurred"
                          ),
                        blocksAfterCreation: z
                          .number()
                          .describe(
                            "Number of blocks after token creation when this sell occurred"
                          ),
                      })
                      .describe(
                        "Individual sell transaction details showing exit timing"
                      )
                  )
                  .describe(
                    "Array of all sell transactions performed by this wallet for the sniped tokens"
                  ),
                totalSellTransactions: z
                  .number()
                  .describe(
                    "Total count of sell transactions executed by this sniper"
                  ),
                totalSnipedTransactions: z
                  .number()
                  .describe(
                    "Total count of sniping transactions executed by this wallet"
                  ),
                totalTokensSniped: z
                  .number()
                  .describe(
                    "Total quantity of tokens acquired through sniping activities"
                  ),
                totalSnipedUsd: z
                  .number()
                  .describe(
                    "Total USD value of tokens acquired through sniping at purchase prices"
                  ),
                totalTokensSold: z
                  .number()
                  .describe(
                    "Total quantity of tokens sold from sniped positions"
                  ),
                totalSoldUsd: z
                  .number()
                  .describe(
                    "Total USD value received from selling sniped tokens"
                  ),
                currentBalance: z
                  .number()
                  .describe(
                    "Current token balance still held by this sniper wallet"
                  ),
                currentBalanceUsdValue: z
                  .number()
                  .describe(
                    "Current USD value of tokens still held by this sniper"
                  ),
                realizedProfitPercentage: z
                  .number()
                  .describe(
                    "Percentage profit/loss realized from completed buy/sell cycles"
                  ),
                realizedProfitUsd: z
                  .number()
                  .describe(
                    "Absolute USD profit/loss realized from completed trading cycles"
                  ),
              })
              .describe(
                "Comprehensive sniper analysis for an individual wallet, including transaction history, performance metrics, and current positions"
              )
          )
          .describe(
            "Array of all identified sniper wallets with their complete trading analysis and performance metrics"
          ),
      })
      .describe(
        "Complete sniper bot analysis for a trading pair, identifying early buyers and their trading performance"
      )
  );

export const getPairSnipers = async (filter: {
  address: string;
  blocksAfterCreation?: number;
}) => {
  const query = qs.stringify(omit(filter, "address"));
  const { error, message, data } = await client.get(
    `/moralis/pair/${filter.address}/snipers?${query}`
  );

  if (error) throw new Error(message);
  return data as {
    blockNumber: number;
    blockTimestamp: string;
    transactionHash: string;
    result: TokenSniper[];
  };
};

export const getPairStatisticsSchema = z
  .function()
  .args(
    z
      .string()
      .describe(
        "The trading pair address to retrieve comprehensive statistics and metrics for"
      )
  )
  .returns(
    z
      .object({
        tokenAddress: z
          .string()
          .describe(
            "The primary token address in the trading pair (base token)"
          ),
        tokenName: z.string().describe("The full name of the primary token"),
        tokenSymbol: z
          .string()
          .describe("The ticker symbol of the primary token"),
        tokenLogo: z.string().describe("URL to the primary token's logo image"),
        pairCreated: z
          .string()
          .nullable()
          .describe(
            "ISO timestamp of when this trading pair was created, null if unknown"
          ),
        pairLabel: z
          .string()
          .describe(
            "Human-readable label for the trading pair (e.g., 'TOKEN/SOL', 'TOKEN/USDC')"
          ),
        pairAddress: z
          .string()
          .describe("The unique address of this trading pair/pool"),
        exchange: z
          .string()
          .describe("The name of the decentralized exchange hosting this pair"),
        exchangeAddress: z
          .string()
          .describe("The smart contract address of the exchange"),
        exchangeLogo: z.string().describe("URL to the exchange's logo image"),
        exchangeUrl: z
          .string()
          .nullable()
          .describe("The exchange's website URL, null if not available"),
        currentUsdPrice: z
          .string()
          .describe("Current price of the token in USD"),
        currentNativePrice: z
          .string()
          .describe(
            "Current price of the token in the native currency of the pair"
          ),
        totalLiquidityUsd: z
          .string()
          .describe("Total liquidity available in the pair denominated in USD"),
        pricePercentChange: z
          .object({
            "5min": z
              .number()
              .describe("Price percentage change over the last 5 minutes"),
            "1h": z
              .number()
              .describe("Price percentage change over the last 1 hour"),
            "4h": z
              .number()
              .describe("Price percentage change over the last 4 hours"),
            "24h": z
              .number()
              .describe("Price percentage change over the last 24 hours"),
          })
          .describe(
            "Price movement percentages across different time intervals"
          ),
        liquidityPercentChange: z
          .object({
            "5min": z
              .number()
              .describe("Liquidity percentage change over the last 5 minutes"),
            "1h": z
              .number()
              .describe("Liquidity percentage change over the last 1 hour"),
            "4h": z
              .number()
              .describe("Liquidity percentage change over the last 4 hours"),
            "24h": z
              .number()
              .describe("Liquidity percentage change over the last 24 hours"),
          })
          .describe(
            "Liquidity movement percentages across different time intervals"
          ),
        buys: z
          .object({
            "5min": z
              .number()
              .describe("Number of buy transactions in the last 5 minutes"),
            "1h": z
              .number()
              .describe("Number of buy transactions in the last 1 hour"),
            "4h": z
              .number()
              .describe("Number of buy transactions in the last 4 hours"),
            "24h": z
              .number()
              .describe("Number of buy transactions in the last 24 hours"),
          })
          .describe("Buy transaction counts across different time intervals"),
        sells: z
          .object({
            "5min": z
              .number()
              .describe("Number of sell transactions in the last 5 minutes"),
            "1h": z
              .number()
              .describe("Number of sell transactions in the last 1 hour"),
            "4h": z
              .number()
              .describe("Number of sell transactions in the last 4 hours"),
            "24h": z
              .number()
              .describe("Number of sell transactions in the last 24 hours"),
          })
          .describe("Sell transaction counts across different time intervals"),
        totalVolume: z
          .object({
            "5min": z
              .number()
              .describe("Total trading volume (USD) in the last 5 minutes"),
            "1h": z
              .number()
              .describe("Total trading volume (USD) in the last 1 hour"),
            "4h": z
              .number()
              .describe("Total trading volume (USD) in the last 4 hours"),
            "24h": z
              .number()
              .describe("Total trading volume (USD) in the last 24 hours"),
          })
          .describe("Total trading volume across different time intervals"),
        buyVolume: z
          .object({
            "5min": z
              .number()
              .describe("Buy volume (USD) in the last 5 minutes"),
            "1h": z.number().describe("Buy volume (USD) in the last 1 hour"),
            "4h": z.number().describe("Buy volume (USD) in the last 4 hours"),
            "24h": z.number().describe("Buy volume (USD) in the last 24 hours"),
          })
          .describe("Buy-side trading volume across different time intervals"),
        sellVolume: z
          .object({
            "5min": z
              .number()
              .describe("Sell volume (USD) in the last 5 minutes"),
            "1h": z.number().describe("Sell volume (USD) in the last 1 hour"),
            "4h": z.number().describe("Sell volume (USD) in the last 4 hours"),
            "24h": z
              .number()
              .describe("Sell volume (USD) in the last 24 hours"),
          })
          .describe("Sell-side trading volume across different time intervals"),
        buyers: z
          .object({
            "5min": z
              .number()
              .describe("Number of unique buyers in the last 5 minutes"),
            "1h": z
              .number()
              .describe("Number of unique buyers in the last 1 hour"),
            "4h": z
              .number()
              .describe("Number of unique buyers in the last 4 hours"),
            "24h": z
              .number()
              .describe("Number of unique buyers in the last 24 hours"),
          })
          .describe("Unique buyer counts across different time intervals"),
        sellers: z
          .object({
            "5min": z
              .number()
              .describe("Number of unique sellers in the last 5 minutes"),
            "1h": z
              .number()
              .describe("Number of unique sellers in the last 1 hour"),
            "4h": z
              .number()
              .describe("Number of unique sellers in the last 4 hours"),
            "24h": z
              .number()
              .describe("Number of unique sellers in the last 24 hours"),
          })
          .describe("Unique seller counts across different time intervals"),
      })
      .describe(
        "Comprehensive trading pair statistics including price movements, volume analysis, and trader activity metrics"
      )
  );

export const getPairStatistics = async (pairAddress: string) => {
  const { error, message, data } = await client.get(
    `/moralis/pair/${pairAddress}/stats`
  );

  if (error) throw new Error(message);
  return data as TokenPairStat;
};

export const getPairAddressTransactionsSchema = z
  .function()
  .args(
    z
      .object({
        pairAddress: z
          .string()
          .describe(
            "The trading pair address to retrieve transaction history for"
          ),
        fromDate: z
          .string()
          .optional()
          .describe(
            "Start date for filtering transactions (ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ)"
          ),
        toDate: z
          .string()
          .optional()
          .describe(
            "End date for filtering transactions (ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ)"
          ),
        order: z
          .enum(["ASC", "DESC"])
          .optional()
          .describe(
            "Sort order for transactions by timestamp (ASC: oldest first, DESC: newest first)"
          ),
        transactionTypes: z
          .enum(["buy", "sell", "addLiquidity", "removeLiquidity"])
          .optional()
          .describe(
            "Filter by specific transaction type (buy: token purchases, sell: token sales, addLiquidity: liquidity provision, removeLiquidity: liquidity withdrawal)"
          ),
        limit: z
          .number()
          .optional()
          .describe(
            "Maximum number of transactions to return (default: 25, max: 100)"
          ),
        cursor: z
          .string()
          .optional()
          .describe("Pagination cursor for retrieving the next set of results"),
      })
      .describe(
        "Filter parameters for retrieving trading pair transaction history"
      )
  )
  .returns(
    z
      .object({
        result: z
          .array(
            z
              .object({
                transactionHash: z
                  .string()
                  .describe(
                    "The unique transaction signature/hash on the blockchain"
                  ),
                transactionType: z
                  .enum(["buy", "sell", "addLiquidity", "removeLiquidity"])
                  .describe(
                    "The type of transaction (buy: purchase, sell: sale, addLiquidity: providing liquidity, removeLiquidity: withdrawing liquidity)"
                  ),
                transactionIndex: z
                  .number()
                  .describe("The index of this transaction within the block"),
                subCategory: z
                  .enum(["accumulation", "partialSell", "sellAll"])
                  .nullable()
                  .describe(
                    "Classification of trading behavior (accumulation: building position, partialSell: reducing position, sellAll: complete exit, null: not applicable)"
                  ),
                blockTimestamp: z
                  .string()
                  .describe(
                    "ISO timestamp of when this transaction was confirmed on the blockchain"
                  ),
                blockNumber: z
                  .number()
                  .describe(
                    "The block number in which this transaction was included"
                  ),
                walletAddress: z
                  .string()
                  .describe(
                    "The wallet address that initiated this transaction"
                  ),
                baseTokenAmount: z
                  .string()
                  .describe(
                    "The amount of base token involved in this transaction"
                  ),
                quoteTokenAmount: z
                  .string()
                  .describe(
                    "The amount of quote token involved in this transaction"
                  ),
                baseTokenPriceUsd: z
                  .number()
                  .describe(
                    "The USD price of the base token at the time of transaction"
                  ),
                quoteTokenPriceUsd: z
                  .number()
                  .describe(
                    "The USD price of the quote token at the time of transaction"
                  ),
                baseQuotePrice: z
                  .string()
                  .describe(
                    "The exchange rate between base and quote tokens at the time of transaction"
                  ),
                totalValueUsd: z
                  .number()
                  .describe("The total USD value of the entire transaction"),
              })
              .describe(
                "Individual transaction details with complete trading information, prices, and metadata"
              )
          )
          .describe(
            "Array of transactions matching the specified filters, ordered by timestamp"
          ),
        pageSize: z
          .number()
          .describe("Number of transactions returned in this page"),
        page: z.number().describe("Current page number (starting from 1)"),
        cursor: z
          .string()
          .nullable()
          .describe(
            "Pagination cursor for retrieving the next set of results, null if no more results"
          ),
        exchangeLogo: z.string().describe("URL to the exchange's logo image"),
        exchangeName: z
          .string()
          .describe(
            "The name of the decentralized exchange where these transactions occurred"
          ),
        exchangeAddress: z
          .string()
          .describe("The smart contract address of the exchange"),
        pairAddress: z
          .string()
          .describe(
            "The trading pair address for which transactions were retrieved"
          ),
        pairLabel: z
          .string()
          .describe(
            "Human-readable label for the trading pair (e.g., 'TOKEN/SOL')"
          ),
        baseToken: z
          .object({
            address: z.string().describe("The mint address of the base token"),
            name: z.string().describe("The full name of the base token"),
            symbol: z.string().describe("The ticker symbol of the base token"),
            logo: z.string().describe("URL to the base token's logo image"),
            decimals: z
              .string()
              .describe("Number of decimal places for the base token"),
          })
          .describe(
            "Detailed information about the base token in the trading pair"
          ),
        quoteToken: z
          .object({
            address: z.string().describe("The mint address of the quote token"),
            name: z.string().describe("The full name of the quote token"),
            symbol: z.string().describe("The ticker symbol of the quote token"),
            logo: z.string().describe("URL to the quote token's logo image"),
            decimals: z
              .string()
              .describe("Number of decimal places for the quote token"),
          })
          .describe(
            "Detailed information about the quote token in the trading pair"
          ),
      })
      .describe(
        "Complete transaction history for a trading pair with metadata, pagination, and token information"
      )
  );

export const getPairAddressTransactions = async (filter: {
  pairAddress: string;
  fromDate?: string;
  toDate?: string;
  order?: "ASC" | "DESC";
  transactionTypes?: "buy" | "sell" | "addLiquidity" | "removeLiquidity";
  limit?: number;
  cursor?: string;
}) => {
  const query = qs.stringify(omit(filter, "pairAddress"));
  const { error, message, data } = await client.get(
    `/moralis/pair/${filter.pairAddress}/transactions?${query}`
  );

  if (error) throw new Error(message);
  return data as {
    result: TokenActions[];
    pageSize: number;
    page: number;
    cursor: string | null;
    exchangeLogo: string;
    exchangeName: string;
    exchangeAddress: string;
    pairAddress: string;
    pairLabel: string;
    baseToken: {
      address: string;
      name: string;
      symbol: string;
      logo: string;
      decimals: string;
    };
    quoteToken: {
      address: string;
      name: string;
      symbol: string;
      logo: string;
      decimals: string;
    };
  };
};
