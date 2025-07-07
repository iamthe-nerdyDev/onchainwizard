import AppClient from "../client";
import { z } from "zod";
import qs from "querystring";
import { omit } from "lodash";

const client = new AppClient().getInstance();

export const getTokenAggregatedPairStatsSchema = z
  .function()
  .args(
    z
      .string()
      .describe(
        "The contract address of the token to get aggregated pair statistics for"
      )
  )
  .returns(
    z
      .object({
        totalLiquidityUsd: z
          .number()
          .describe("Total liquidity across all pairs in USD"),
        totalActivePairs: z
          .number()
          .describe("Number of active trading pairs for this token"),
        totalActiveDexes: z
          .number()
          .describe(
            "Number of active decentralized exchanges trading this token"
          ),
        totalBuyers: z
          .object({
            "5min": z
              .number()
              .describe("Number of unique buyers in last 5 minutes"),
            "1h": z.number().describe("Number of unique buyers in last 1 hour"),
            "4h": z
              .number()
              .describe("Number of unique buyers in last 4 hours"),
            "24h": z
              .number()
              .describe("Number of unique buyers in last 24 hours"),
          })
          .describe("Unique buyer counts across different time periods"),
        totalBuyVolume: z
          .object({
            "5min": z
              .number()
              .describe("Total buy volume in USD in last 5 minutes"),
            "1h": z.number().describe("Total buy volume in USD in last 1 hour"),
            "4h": z
              .number()
              .describe("Total buy volume in USD in last 4 hours"),
            "24h": z
              .number()
              .describe("Total buy volume in USD in last 24 hours"),
          })
          .describe("Buy volume in USD across different time periods"),
        totalSellers: z
          .object({
            "5min": z
              .number()
              .describe("Number of unique sellers in last 5 minutes"),
            "1h": z
              .number()
              .describe("Number of unique sellers in last 1 hour"),
            "4h": z
              .number()
              .describe("Number of unique sellers in last 4 hours"),
            "24h": z
              .number()
              .describe("Number of unique sellers in last 24 hours"),
          })
          .describe("Unique seller counts across different time periods"),
        totalSellVolume: z
          .object({
            "5min": z
              .number()
              .describe("Total sell volume in USD in last 5 minutes"),
            "1h": z
              .number()
              .describe("Total sell volume in USD in last 1 hour"),
            "4h": z
              .number()
              .describe("Total sell volume in USD in last 4 hours"),
            "24h": z
              .number()
              .describe("Total sell volume in USD in last 24 hours"),
          })
          .describe("Sell volume in USD across different time periods"),
        totalSwaps: z
          .object({
            "5min": z
              .number()
              .describe("Total number of swaps in last 5 minutes"),
            "1h": z.number().describe("Total number of swaps in last 1 hour"),
            "4h": z.number().describe("Total number of swaps in last 4 hours"),
            "24h": z
              .number()
              .describe("Total number of swaps in last 24 hours"),
          })
          .describe("Total swap counts across different time periods"),
        totalVolume: z
          .object({
            "5min": z
              .number()
              .describe("Total trading volume in USD in last 5 minutes"),
            "1h": z
              .number()
              .describe("Total trading volume in USD in last 1 hour"),
            "4h": z
              .number()
              .describe("Total trading volume in USD in last 4 hours"),
            "24h": z
              .number()
              .describe("Total trading volume in USD in last 24 hours"),
          })
          .describe(
            "Total trading volume in USD across different time periods"
          ),
      })
      .describe(
        "Aggregated statistics for all trading pairs of the specified token"
      )
  );

export const getTokenAggregatedPairStats = async (tokenAddress: string) => {
  const { error, message, data } = await client.get(
    `/moralis/token/${tokenAddress}/aggregated-pair-stats`
  );

  if (error) throw new Error(message);
  return data as AggregatedTokenPairStats;
};

export const getTokenAnalyticsSchema = z
  .function()
  .args(
    z
      .string()
      .describe(
        "The contract address of the token to get detailed analytics for"
      )
  )
  .returns(
    z
      .object({
        tokenAddress: z.string().describe("The contract address of the token"),
        totalBuyVolume: z
          .object({
            "5m": z
              .number()
              .describe("Total buy volume in USD in last 5 minutes"),
            "1h": z.number().describe("Total buy volume in USD in last 1 hour"),
            "6h": z
              .number()
              .describe("Total buy volume in USD in last 6 hours"),
            "24h": z
              .number()
              .describe("Total buy volume in USD in last 24 hours"),
          })
          .describe("Buy volume in USD across different time periods"),
        totalSellVolume: z
          .object({
            "5m": z
              .number()
              .describe("Total sell volume in USD in last 5 minutes"),
            "1h": z
              .number()
              .describe("Total sell volume in USD in last 1 hour"),
            "6h": z
              .number()
              .describe("Total sell volume in USD in last 6 hours"),
            "24h": z
              .number()
              .describe("Total sell volume in USD in last 24 hours"),
          })
          .describe("Sell volume in USD across different time periods"),
        totalBuyers: z
          .object({
            "5m": z
              .number()
              .describe("Number of unique buyers in last 5 minutes"),
            "1h": z.number().describe("Number of unique buyers in last 1 hour"),
            "6h": z
              .number()
              .describe("Number of unique buyers in last 6 hours"),
            "24h": z
              .number()
              .describe("Number of unique buyers in last 24 hours"),
          })
          .describe("Unique buyer counts across different time periods"),
        totalSellers: z
          .object({
            "5m": z
              .number()
              .describe("Number of unique sellers in last 5 minutes"),
            "1h": z
              .number()
              .describe("Number of unique sellers in last 1 hour"),
            "6h": z
              .number()
              .describe("Number of unique sellers in last 6 hours"),
            "24h": z
              .number()
              .describe("Number of unique sellers in last 24 hours"),
          })
          .describe("Unique seller counts across different time periods"),
        totalBuys: z
          .object({
            "5m": z
              .number()
              .describe("Total number of buy transactions in last 5 minutes"),
            "1h": z
              .number()
              .describe("Total number of buy transactions in last 1 hour"),
            "6h": z
              .number()
              .describe("Total number of buy transactions in last 6 hours"),
            "24h": z
              .number()
              .describe("Total number of buy transactions in last 24 hours"),
          })
          .describe("Buy transaction counts across different time periods"),
        totalSells: z
          .object({
            "5m": z
              .number()
              .describe("Total number of sell transactions in last 5 minutes"),
            "1h": z
              .number()
              .describe("Total number of sell transactions in last 1 hour"),
            "6h": z
              .number()
              .describe("Total number of sell transactions in last 6 hours"),
            "24h": z
              .number()
              .describe("Total number of sell transactions in last 24 hours"),
          })
          .describe("Sell transaction counts across different time periods"),
        uniqueWallets: z
          .object({
            "5m": z
              .number()
              .describe(
                "Number of unique wallets that traded in last 5 minutes"
              ),
            "1h": z
              .number()
              .describe("Number of unique wallets that traded in last 1 hour"),
            "6h": z
              .number()
              .describe("Number of unique wallets that traded in last 6 hours"),
            "24h": z
              .number()
              .describe(
                "Number of unique wallets that traded in last 24 hours"
              ),
          })
          .describe("Unique wallet counts across different time periods"),
        pricePercentChange: z
          .object({
            "5m": z
              .number()
              .describe("Price percentage change in last 5 minutes"),
            "1h": z.number().describe("Price percentage change in last 1 hour"),
            "6h": z
              .number()
              .describe("Price percentage change in last 6 hours"),
            "24h": z
              .number()
              .describe("Price percentage change in last 24 hours"),
          })
          .describe("Price percentage changes across different time periods"),
        usdPrice: z.string().describe("Current price of the token in USD"),
        totalLiquidityUsd: z
          .string()
          .describe("Total liquidity available for the token in USD"),
        totalFullyDilutedValuation: z
          .string()
          .describe("Market cap if all tokens were in circulation"),
      })
      .describe(
        "Comprehensive analytics data for the specified token including volume, buyers, sellers, and price metrics"
      )
  );

export const getTokenAnalytics = async (tokenAddress: string) => {
  const { error, message, data } = await client.get(
    `/moralis/token/${tokenAddress}/analytics`
  );

  if (error) throw new Error(message);
  return data as TokenAnalytics;
};

export const getTokenHoldersStatsSchema = z
  .function()
  .args(
    z
      .string()
      .describe(
        "The contract address of the token to get holder statistics for"
      )
  )
  .returns(
    z
      .object({
        totalHolders: z
          .number()
          .describe("Total number of unique holders of this token"),
        holdersByAcquisition: z
          .object({
            swap: z
              .number()
              .describe("Number of holders who acquired tokens through swaps"),
            transfer: z
              .number()
              .describe(
                "Number of holders who acquired tokens through transfers"
              ),
            airdrop: z
              .number()
              .describe(
                "Number of holders who acquired tokens through airdrops"
              ),
          })
          .describe("Breakdown of holders by how they acquired their tokens"),
        holderChange: z
          .object({
            "5min": z
              .object({
                change: z.number().describe("Absolute change in holder count"),
                changePercent: z
                  .number()
                  .describe("Percentage change in holder count"),
              })
              .describe("Holder count change in last 5 minutes"),
            "1h": z
              .object({
                change: z.number().describe("Absolute change in holder count"),
                changePercent: z
                  .number()
                  .describe("Percentage change in holder count"),
              })
              .describe("Holder count change in last 1 hour"),
            "6h": z
              .object({
                change: z.number().describe("Absolute change in holder count"),
                changePercent: z
                  .number()
                  .describe("Percentage change in holder count"),
              })
              .describe("Holder count change in last 6 hours"),
            "24h": z
              .object({
                change: z.number().describe("Absolute change in holder count"),
                changePercent: z
                  .number()
                  .describe("Percentage change in holder count"),
              })
              .describe("Holder count change in last 24 hours"),
            "3d": z
              .object({
                change: z.number().describe("Absolute change in holder count"),
                changePercent: z
                  .number()
                  .describe("Percentage change in holder count"),
              })
              .describe("Holder count change in last 3 days"),
            "7d": z
              .object({
                change: z.number().describe("Absolute change in holder count"),
                changePercent: z
                  .number()
                  .describe("Percentage change in holder count"),
              })
              .describe("Holder count change in last 7 days"),
            "30d": z
              .object({
                change: z.number().describe("Absolute change in holder count"),
                changePercent: z
                  .number()
                  .describe("Percentage change in holder count"),
              })
              .describe("Holder count change in last 30 days"),
          })
          .describe("Holder count changes across different time periods"),
        holderDistribution: z
          .object({
            whales: z
              .number()
              .describe("Number of whale holders (largest positions)"),
            sharks: z
              .number()
              .describe("Number of shark holders (large positions)"),
            dolphins: z
              .number()
              .describe("Number of dolphin holders (medium-large positions)"),
            fish: z
              .number()
              .describe("Number of fish holders (medium positions)"),
            octopus: z
              .number()
              .describe("Number of octopus holders (small-medium positions)"),
            crabs: z
              .number()
              .describe("Number of crab holders (small positions)"),
            shrimps: z
              .number()
              .describe("Number of shrimp holders (smallest positions)"),
          })
          .describe("Distribution of holders by portfolio size categories"),
        holderSupply: z
          .object({
            top10: z
              .object({
                supply: z
                  .string()
                  .describe("Total supply held by top 10 holders"),
                supplyPercent: z
                  .number()
                  .describe(
                    "Percentage of total supply held by top 10 holders"
                  ),
              })
              .describe("Supply concentration in top 10 holders"),
            top25: z
              .object({
                supply: z
                  .string()
                  .describe("Total supply held by top 25 holders"),
                supplyPercent: z
                  .number()
                  .describe(
                    "Percentage of total supply held by top 25 holders"
                  ),
              })
              .describe("Supply concentration in top 25 holders"),
            top50: z
              .object({
                supply: z
                  .string()
                  .describe("Total supply held by top 50 holders"),
                supplyPercent: z
                  .number()
                  .describe(
                    "Percentage of total supply held by top 50 holders"
                  ),
              })
              .describe("Supply concentration in top 50 holders"),
            top100: z
              .object({
                supply: z
                  .string()
                  .describe("Total supply held by top 100 holders"),
                supplyPercent: z
                  .number()
                  .describe(
                    "Percentage of total supply held by top 100 holders"
                  ),
              })
              .describe("Supply concentration in top 100 holders"),
            top250: z
              .object({
                supply: z
                  .string()
                  .describe("Total supply held by top 250 holders"),
                supplyPercent: z
                  .number()
                  .describe(
                    "Percentage of total supply held by top 250 holders"
                  ),
              })
              .describe("Supply concentration in top 250 holders"),
            top500: z
              .object({
                supply: z
                  .string()
                  .describe("Total supply held by top 500 holders"),
                supplyPercent: z
                  .number()
                  .describe(
                    "Percentage of total supply held by top 500 holders"
                  ),
              })
              .describe("Supply concentration in top 500 holders"),
          })
          .describe(
            "Token supply concentration statistics for different holder tiers"
          ),
      })
      .describe(
        "Comprehensive holder statistics including distribution, changes over time, and supply concentration"
      )
  );

export const getTokenHoldersStats = async (tokenAddress: string) => {
  const { error, message, data } = await client.get(
    `/moralis/token/${tokenAddress}/holders-stats`
  );

  if (error) throw new Error(message);
  return data as TokenHoldersStat;
};

export const getTokenTopHoldersSchema = z
  .function()
  .args(
    z
      .object({
        tokenAddress: z
          .string()
          .describe("The contract address of the token to get top holders for"),
        limit: z
          .number()
          .optional()
          .describe("Maximum number of top holders to return"),
        cursor: z
          .string()
          .optional()
          .describe("Pagination cursor for fetching the next page of results"),
      })
      .describe("Filter parameters for fetching top holders of a token")
  )
  .returns(
    z
      .object({
        result: z
          .array(
            z.object({
              balance: z
                .string()
                .describe(
                  "Token balance in smallest unit (e.g., lamports for SOL)"
                ),
              balanceFormatted: z
                .string()
                .describe(
                  "Human-readable formatted balance (e.g., '1.5' for 1.5 tokens)"
                ),
              isContract: z
                .boolean()
                .describe("Whether this holder address is a smart contract"),
              ownerAddress: z
                .string()
                .describe("The wallet address of the token holder"),
              usdValue: z
                .string()
                .describe("USD value of the holder's token balance"),
              percentageRelativeToTotalSupply: z
                .number()
                .describe(
                  "Percentage of total token supply held by this address"
                ),
            })
          )
          .describe(
            "Array of top token holders with their balances and metadata"
          ),
        pageSize: z
          .number()
          .describe("Number of holders returned in this response"),
        page: z.number().describe("Current page number"),
        cursor: z
          .string()
          .nullable()
          .describe(
            "Cursor for the next page of results, null if no more pages"
          ),
        totalSupply: z.string().describe("Total supply of the token"),
      })
      .describe(
        "Paginated list of top token holders with their balances and ownership percentages"
      )
  );

export const getTokenTopHolders = async (filter: {
  tokenAddress: string;
  limit?: number;
  cursor?: string;
}) => {
  const query = qs.stringify(omit(filter, "tokenAddress"));
  const { error, message, data } = await client.get(
    `/moralis/token/${filter.tokenAddress}/top-holders?${query}`
  );

  if (error) throw new Error(message);
  return data as {
    result: TokenTopHolder[];
    pageSize: number;
    page: number;
    cursor: string | null;
    totalSupply: string;
  };
};

export const getTokenMetadataSchema = z
  .function()
  .args(
    z
      .string()
      .describe(
        "The contract address of the token to get metadata information for"
      )
  )
  .returns(
    z
      .object({
        mint: z.string().describe("The mint address of the token"),
        standard: z.string().describe("Token standard (e.g., 'Metaplex')"),
        name: z.string().describe("The human-readable name of the token"),
        symbol: z.string().describe("The ticker symbol of the token"),
        decimals: z
          .string()
          .describe("Number of decimal places supported by the token"),
        tokenStandard: z
          .number()
          .optional()
          .describe("Numeric representation of the token standard"),
        metaplex: z
          .object({
            metadataUri: z
              .string()
              .describe("URI to the token's metadata JSON"),
            masterEdition: z
              .boolean()
              .describe("Whether this is a master edition NFT"),
            isMutable: z
              .boolean()
              .describe("Whether the token metadata can be changed"),
            sellerFeeBasisPoints: z
              .number()
              .describe("Seller fee in basis points for secondary sales"),
            updateAuthority: z
              .string()
              .describe("Address authorized to update the token metadata"),
            primarySaleHappened: z
              .number()
              .describe("Whether the primary sale has occurred"),
          })
          .optional()
          .describe("Metaplex-specific metadata for NFTs and tokens"),
        fullyDilutedValue: z
          .string()
          .optional()
          .describe("Market cap if all tokens were in circulation"),
        totalSupply: z
          .string()
          .optional()
          .describe("Total supply of the token in smallest units"),
        totalSupplyFormatted: z
          .string()
          .optional()
          .describe("Human-readable formatted total supply"),
        links: z
          .record(z.string())
          .optional()
          .describe("Social media and website links associated with the token"),
        description: z
          .string()
          .nullable()
          .optional()
          .describe("Description of the token project"),
        isVerifiedContract: z
          .boolean()
          .describe("Whether the token contract has been verified"),
        possibleSpam: z
          .boolean()
          .describe("Whether the token is flagged as possible spam"),
      })
      .describe(
        "Comprehensive metadata information for the specified token including basic info, links, and verification status"
      )
  );

export const getTokenMetadata = async (tokenAddress: string) => {
  const { error, message, data } = await client.get(
    `/moralis/token/${tokenAddress}/metadata`
  );

  if (error) throw new Error(message);
  return data as TokenMetadata;
};

export const getTokenPriceSchema = z
  .function()
  .args(
    z
      .string()
      .describe(
        "The contract address of the token to get current price information for"
      )
  )
  .returns(
    z
      .object({
        tokenAddress: z.string().describe("The contract address of the token"),
        pairAddress: z
          .string()
          .describe("The contract address of the trading pair"),
        exchangeName: z
          .string()
          .describe("Name of the exchange where this price is from"),
        exchangeAddress: z
          .string()
          .describe("Contract address of the exchange"),
        nativePrice: z
          .object({
            value: z.string().describe("Price in native blockchain currency"),
            symbol: z
              .string()
              .describe("Symbol of the native currency (e.g., 'SOL')"),
            name: z.string().describe("Name of the native currency"),
            decimals: z
              .number()
              .describe("Decimal places of the native currency"),
          })
          .describe("Price information in native blockchain currency"),
        usdPrice: z.number().describe("Current price of the token in USD"),
        usdPrice24h: z
          .number()
          .describe("Price of the token in USD 24 hours ago"),
        usdPrice24hrUsdChange: z
          .number()
          .describe("Absolute USD price change in the last 24 hours"),
        usdPrice24hrPercentChange: z
          .number()
          .describe("Percentage price change in the last 24 hours"),
        logo: z.string().describe("URL to the token's logo image"),
        name: z.string().describe("The human-readable name of the token"),
        symbol: z.string().describe("The ticker symbol of the token"),
        isVerifiedContract: z
          .boolean()
          .describe("Whether the token contract has been verified"),
      })
      .describe(
        "Current price information for the specified token including USD price, 24h changes, and exchange details"
      )
  );

export const getTokenPrice = async (tokenAddress: string) => {
  const { error, message, data } = await client.get(
    `/moralis/token/${tokenAddress}/price`
  );

  if (error) throw new Error(message);
  return data as TokenPrice;
};

export const getTokenPairsSchema = z
  .function()
  .args(
    z
      .object({
        tokenAddress: z
          .string()
          .describe(
            "The contract address of the token to get trading pairs for"
          ),
        limit: z
          .number()
          .optional()
          .describe("Maximum number of pairs to return"),
        cursor: z
          .string()
          .optional()
          .describe("Pagination cursor for fetching the next page of results"),
      })
      .describe("Filter parameters for fetching trading pairs of a token")
  )
  .returns(
    z
      .object({
        results: z
          .array(
            z.object({
              exchangeAddress: z
                .string()
                .describe("Contract address of the exchange"),
              exchangeName: z.string().describe("Name of the exchange"),
              exchangeLogo: z.string().describe("URL to the exchange's logo"),
              pairAddress: z
                .string()
                .describe("Contract address of the trading pair"),
              pairLabel: z
                .string()
                .describe(
                  "Human-readable label for the trading pair (e.g., 'TOKEN/SOL')"
                ),
              usdPrice: z
                .number()
                .describe("Current price of the token in USD on this pair"),
              usdPrice24hrPercentChange: z
                .number()
                .describe("24-hour percentage price change for this pair"),
              usdPrice24hrUsdChange: z
                .number()
                .describe("24-hour absolute USD price change for this pair"),
              volume24hrNative: z
                .number()
                .describe("24-hour trading volume in native currency"),
              volume24hrUsd: z
                .number()
                .describe("24-hour trading volume in USD"),
              liquidityUsd: z
                .number()
                .describe("Total liquidity in USD for this pair"),
              baseToken: z
                .string()
                .describe("Address of the base token in the pair"),
              quoteToken: z
                .string()
                .describe("Address of the quote token in the pair"),
              inactivePair: z
                .literal(false)
                .describe(
                  "Whether the pair is inactive (always false for returned pairs)"
                ),
              pair: z
                .tuple([
                  z.object({
                    tokenAddress: z
                      .string()
                      .describe("Address of the first token"),
                    tokenName: z.string().describe("Name of the first token"),
                    tokenSymbol: z
                      .string()
                      .describe("Symbol of the first token"),
                    tokenLogo: z
                      .string()
                      .describe("Logo URL of the first token"),
                    tokenDecimals: z
                      .string()
                      .describe("Decimal places of the first token"),
                    pairTokenType: z
                      .enum(["token0", "token1"])
                      .describe("Position of token in the pair"),
                    liquidityUsd: z
                      .number()
                      .describe("Liquidity in USD for this token"),
                  }),
                  z.object({
                    tokenAddress: z
                      .string()
                      .describe("Address of the second token"),
                    tokenName: z.string().describe("Name of the second token"),
                    tokenSymbol: z
                      .string()
                      .describe("Symbol of the second token"),
                    tokenLogo: z
                      .string()
                      .describe("Logo URL of the second token"),
                    tokenDecimals: z
                      .string()
                      .describe("Decimal places of the second token"),
                    pairTokenType: z
                      .enum(["token0", "token1"])
                      .describe("Position of token in the pair"),
                    liquidityUsd: z
                      .number()
                      .describe("Liquidity in USD for this token"),
                  }),
                ])
                .describe("Detailed information about both tokens in the pair"),
            })
          )
          .describe("Array of trading pairs for the specified token"),
        pageSize: z
          .number()
          .describe("Number of pairs returned in this response"),
        page: z.number().describe("Current page number"),
        cursor: z
          .string()
          .nullable()
          .describe(
            "Cursor for the next page of results, null if no more pages"
          ),
      })
      .describe(
        "Paginated list of trading pairs for the specified token with liquidity and volume information"
      )
  );

export const getTokenPairs = async (filter: {
  tokenAddress: string;
  limit?: number;
  cursor?: string;
}) => {
  const query = qs.stringify(omit(filter, "tokenAddress"));
  const { error, message, data } = await client.get(
    `/moralis/token/${filter.tokenAddress}/pairs?${query}`
  );

  if (error) throw new Error(message);
  return data as {
    results: TokenPair[];
    pageSize: number;
    page: number;
    cursor: null | string;
  };
};

export const getTokenSwapsSchema = z
  .function()
  .args(
    z
      .object({
        tokenAddress: z
          .string()
          .describe(
            "The contract address of the token to get swap transactions for"
          ),
        limit: z
          .number()
          .optional()
          .describe("Maximum number of swaps to return"),
        cursor: z
          .string()
          .optional()
          .describe("Pagination cursor for fetching the next page of results"),
        fromDate: z
          .string()
          .optional()
          .describe("Start date for filtering swaps (ISO 8601 format)"),
        toDate: z
          .string()
          .optional()
          .describe("End date for filtering swaps (ISO 8601 format)"),
        order: z
          .enum(["ASC", "DESC"])
          .optional()
          .describe(
            "Sort order for the results (ascending or descending by timestamp)"
          ),
        transactionTypes: z
          .enum(["buy", "sell"])
          .optional()
          .describe("Filter by transaction type (buy or sell)"),
      })
      .describe("Filter parameters for fetching swap transactions of a token")
  )
  .returns(
    z
      .object({
        result: z
          .array(
            z.object({
              transactionHash: z
                .string()
                .describe("Hash of the blockchain transaction"),
              transactionType: z
                .enum(["buy", "sell"])
                .describe("Type of transaction (buy or sell)"),
              transactionIndex: z
                .number()
                .describe("Index of the transaction within the block"),
              subCategory: z
                .enum(["accumulation", "partialSell", "sellAll"])
                .nullable()
                .describe(
                  "Sub-category of the transaction based on trading pattern"
                ),
              blockTimestamp: z
                .string()
                .describe("ISO timestamp when the transaction was confirmed"),
              blockNumber: z
                .number()
                .describe("Block number containing this transaction"),
              walletAddress: z
                .string()
                .describe("Address of the wallet that initiated the swap"),
              pairAddress: z
                .string()
                .describe("Contract address of the trading pair"),
              pairLabel: z
                .string()
                .describe("Human-readable label for the trading pair"),
              exchangeAddress: z
                .string()
                .describe("Contract address of the exchange"),
              exchangeName: z.string().describe("Name of the exchange"),
              exchangeLogo: z.string().describe("URL to the exchange's logo"),
              baseToken: z
                .string()
                .describe("Address of the base token in the pair"),
              quoteToken: z
                .string()
                .describe("Address of the quote token in the pair"),
              bought: z
                .object({
                  address: z
                    .string()
                    .describe("Address of the token that was bought"),
                  name: z
                    .string()
                    .describe("Name of the token that was bought"),
                  symbol: z
                    .string()
                    .describe("Symbol of the token that was bought"),
                  logo: z
                    .string()
                    .describe("Logo URL of the token that was bought"),
                  amount: z.string().describe("Amount of tokens bought"),
                  usdPrice: z
                    .number()
                    .describe("USD price per token at time of purchase"),
                  usdAmount: z
                    .number()
                    .describe("Total USD value of tokens bought"),
                  tokenType: z
                    .enum(["token0", "token1"])
                    .describe("Position of token in the pair"),
                })
                .describe("Details of the token that was bought in the swap"),
              sold: z
                .object({
                  address: z
                    .string()
                    .describe("Address of the token that was sold"),
                  name: z.string().describe("Name of the token that was sold"),
                  symbol: z
                    .string()
                    .describe("Symbol of the token that was sold"),
                  logo: z
                    .string()
                    .describe("Logo URL of the token that was sold"),
                  amount: z.string().describe("Amount of tokens sold"),
                  usdPrice: z
                    .number()
                    .describe("USD price per token at time of sale"),
                  usdAmount: z
                    .number()
                    .describe("Total USD value of tokens sold"),
                  tokenType: z
                    .enum(["token0", "token1"])
                    .describe("Position of token in the pair"),
                })
                .describe("Details of the token that was sold in the swap"),
              baseQuotePrice: z
                .string()
                .describe("Exchange rate between base and quote tokens"),
              totalValueUsd: z
                .number()
                .describe("Total USD value of the swap transaction"),
            })
          )
          .describe("Array of swap transactions for the specified token"),
        pageSize: z
          .number()
          .describe("Number of swaps returned in this response"),
        page: z.number().describe("Current page number (0-indexed)"),
        cursor: z
          .string()
          .nullable()
          .describe(
            "Cursor for the next page of results, null if no more pages"
          ),
      })
      .describe(
        "Paginated list of swap transactions for the specified token with detailed buy/sell information"
      )
  );

export const getTokenSwaps = async (filter: {
  tokenAddress: string;
  limit?: number;
  cursor?: string;
  fromDate?: string;
  toDate?: string;
  order?: "ASC" | "DESC";
  transactionTypes?: "buy" | "sell";
}) => {
  const query = qs.stringify(omit(filter, "tokenAddress"));
  const { error, message, data } = await client.get(
    `/moralis/token/${filter.tokenAddress}/swaps?${query}`
  );

  if (error) throw new Error(message);
  return data as {
    result: TokenSwap[];
    pageSize: number;
    page: number;
    cursor: string | null;
  };
};
