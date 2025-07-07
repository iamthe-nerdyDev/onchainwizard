import AppClient from "../client";
import { z } from "zod";
import qs from "querystring";
import { omit } from "lodash";

const client = new AppClient().getInstance();

export const getWalletNativeBalanceSchema = z
  .function()
  .args(
    z
      .string()
      .describe(
        "The Solana wallet address (base58 encoded public key) to check native SOL balance for"
      )
  )
  .returns(
    z
      .object({
        solana: z
          .string()
          .describe(
            "The wallet's SOL balance formatted as a decimal string (e.g., '1.5' for 1.5 SOL)"
          ),
        lamports: z
          .string()
          .describe(
            "The wallet's balance in lamports (smallest unit of SOL, where 1 SOL = 1,000,000,000 lamports)"
          ),
      })
      .describe("Native SOL balance information for the specified wallet")
  );

export const getWalletNativeBalance = async (address: string) => {
  const { error, message, data } = await client.get(
    `/moralis/wallet/${address}/native-balance`
  );

  if (error) throw new Error(message);
  return data as NativeBalance;
};

export const getWalletNFTsSchema = z
  .function()
  .args(
    z
      .string()
      .describe("The Solana wallet address to retrieve NFT holdings for")
  )
  .returns(
    z
      .array(
        z
          .object({
            associatedTokenAddress: z
              .string()
              .describe(
                "The associated token account address that holds this NFT for the owner"
              ),
            mint: z
              .string()
              .describe(
                "The unique mint address that identifies this specific NFT on the blockchain"
              ),
            name: z
              .string()
              .describe(
                "The display name of the NFT as defined in its metadata"
              ),
            symbol: z
              .string()
              .describe("The ticker symbol or short identifier for this NFT"),
            decimals: z
              .number()
              .describe(
                "Number of decimal places for the token (typically 0 for NFTs since they're non-divisible)"
              ),
            tokenStandard: z
              .number()
              .describe(
                "The token standard specification number (e.g., Metaplex Token Standard)"
              ),
            amount: z
              .string()
              .describe(
                "The quantity of this token held (usually '1' for NFTs)"
              ),
            amountRaw: z
              .string()
              .describe("The raw amount value without decimal formatting"),
            possibleSpam: z
              .boolean()
              .describe(
                "Flag indicating whether this NFT has been flagged as potential spam or fraudulent content"
              ),
            media: z
              .object({
                status: z
                  .string()
                  .describe(
                    "The current status of media processing (e.g., 'ready', 'processing', 'failed')"
                  ),
                mimetype: z
                  .string()
                  .describe(
                    "The MIME type of the NFT's primary media file (e.g., 'image/png', 'video/mp4')"
                  ),
                originalMediaUrl: z
                  .string()
                  .describe(
                    "The original URL where the NFT's media content is hosted"
                  ),
                updatedAt: z
                  .string()
                  .describe(
                    "ISO timestamp of when the media information was last updated"
                  ),
                mediaCollection: z
                  .object({
                    low: z
                      .object({
                        height: z
                          .number()
                          .describe(
                            "Height in pixels of the low-resolution version"
                          ),
                        width: z
                          .number()
                          .describe(
                            "Width in pixels of the low-resolution version"
                          ),
                        url: z
                          .string()
                          .describe(
                            "URL to access the low-resolution version of the media"
                          ),
                      })
                      .describe(
                        "Low-resolution version of the NFT media for faster loading"
                      ),
                    medium: z
                      .object({
                        height: z
                          .number()
                          .describe(
                            "Height in pixels of the medium-resolution version"
                          ),
                        width: z
                          .number()
                          .describe(
                            "Width in pixels of the medium-resolution version"
                          ),
                        url: z
                          .string()
                          .describe(
                            "URL to access the medium-resolution version of the media"
                          ),
                      })
                      .describe(
                        "Medium-resolution version of the NFT media for balanced quality and loading speed"
                      ),
                    high: z
                      .object({
                        height: z
                          .number()
                          .describe(
                            "Height in pixels of the high-resolution version"
                          ),
                        width: z
                          .number()
                          .describe(
                            "Width in pixels of the high-resolution version"
                          ),
                        url: z
                          .string()
                          .describe(
                            "URL to access the high-resolution version of the media"
                          ),
                      })
                      .describe(
                        "High-resolution version of the NFT media for maximum quality"
                      ),
                  })
                  .describe(
                    "Collection of different resolution versions of the NFT media for various display contexts"
                  ),
              })
              .describe(
                "Comprehensive media information including URLs and processing status for the NFT's visual content"
              ),
            totalSupply: z
              .string()
              .describe(
                "The total number of tokens that exist for this mint (typically '1' for unique NFTs)"
              ),
            attributes: z
              .array(
                z
                  .object({
                    traitType: z
                      .string()
                      .describe(
                        "The category or type of this trait (e.g., 'Background', 'Eyes', 'Rarity')"
                      ),
                    value: z
                      .string()
                      .describe(
                        "The specific value for this trait (e.g., 'Blue', 'Laser Eyes', 'Legendary')"
                      ),
                  })
                  .describe(
                    "Individual trait or attribute that defines a characteristic of this NFT"
                  )
              )
              .describe(
                "Array of traits and attributes that define the unique characteristics and rarity of this NFT"
              ),
            collection: z
              .object({
                collectionAddress: z
                  .string()
                  .describe(
                    "The unique address that identifies the collection this NFT belongs to"
                  ),
                name: z
                  .string()
                  .describe("The display name of the NFT collection"),
                description: z
                  .string()
                  .describe(
                    "Detailed description of the collection's theme, purpose, or story"
                  ),
                imageOriginalUrl: z
                  .string()
                  .describe(
                    "URL to the original collection artwork or logo image"
                  ),
                externalUrl: z
                  .string()
                  .nullable()
                  .describe(
                    "Optional external website URL for the collection (project homepage, social media, etc.)"
                  ),
                metaplexMint: z
                  .string()
                  .describe(
                    "The Metaplex mint address associated with this collection"
                  ),
                sellerFeeBasisPoints: z
                  .number()
                  .describe(
                    "The royalty fee in basis points (1/100th of a percent) that creators receive on secondary sales"
                  ),
              })
              .describe(
                "Detailed information about the collection that this NFT is part of"
              ),
            firstCreated: z
              .object({
                mintTimestamp: z
                  .string()
                  .nullable()
                  .describe(
                    "ISO timestamp of when this NFT was first minted on the blockchain"
                  ),
                mintBlockNumber: z
                  .string()
                  .nullable()
                  .describe(
                    "The block number in which this NFT was first minted"
                  ),
                mintTransaction: z
                  .string()
                  .nullable()
                  .describe(
                    "The transaction hash/signature of the minting transaction"
                  ),
              })
              .describe(
                "Historical information about when and how this NFT was originally created"
              ),
            creators: z
              .array(
                z
                  .object({
                    address: z
                      .string()
                      .describe("The wallet address of the creator or artist"),
                    share: z
                      .number()
                      .describe(
                        "The percentage share of royalties this creator receives (0-100)"
                      ),
                    verified: z
                      .boolean()
                      .describe(
                        "Whether this creator's signature has been verified on the NFT"
                      ),
                  })
                  .describe(
                    "Individual creator or collaborator who contributed to this NFT"
                  )
              )
              .describe(
                "Array of verified creators and their royalty share percentages for this NFT"
              ),
          })
          .describe(
            "Complete NFT information including metadata, media, ownership, and collection details"
          )
      )
      .describe("Array of all NFTs currently held by the specified wallet")
  );

export const getWalletNFTs = async (address: string) => {
  const { error, message, data } = await client.get(
    `/moralis/wallet/${address}/nfts`
  );

  if (error) throw new Error(message);
  return data as WalletNFT[];
};

export const getWalletTokenBalancesSchema = z
  .function()
  .args(
    z
      .string()
      .describe("The Solana wallet address to retrieve token balances for")
  )
  .returns(
    z
      .array(
        z
          .object({
            associatedTokenAddress: z
              .string()
              .describe(
                "The associated token account address that holds this token for the owner"
              ),
            mint: z
              .string()
              .describe(
                "The unique mint address that identifies this specific token on the blockchain"
              ),
            amountRaw: z
              .string()
              .describe(
                "The raw token amount in the token's smallest unit (before applying decimal places)"
              ),
            amount: z
              .string()
              .describe(
                "The formatted token amount after applying decimal places (human-readable)"
              ),
            decimals: z
              .number()
              .describe(
                "Number of decimal places this token uses (e.g., 6 for USDC, 9 for most SPL tokens)"
              ),
            tokenStandard: z
              .number()
              .describe(
                "The token standard specification number (e.g., SPL Token Standard)"
              ),
            name: z
              .string()
              .describe(
                "The full display name of the token (e.g., 'USD Coin', 'Solana')"
              ),
            symbol: z
              .string()
              .describe("The ticker symbol of the token (e.g., 'USDC', 'SOL')"),
            logo: z
              .string()
              .describe("URL to the token's logo image for display purposes"),
            isVerifiedContract: z
              .boolean()
              .describe(
                "Whether this token contract has been verified and is considered legitimate"
              ),
            possibleSpam: z
              .boolean()
              .describe(
                "Flag indicating whether this token has been flagged as potential spam or fraudulent"
              ),
          })
          .describe(
            "Individual token balance information including metadata and verification status"
          )
      )
      .describe(
        "Array of all token balances (excluding NFTs) currently held by the specified wallet"
      )
  );

export const getWalletTokenBalances = async (address: string) => {
  const { error, message, data } = await client.get(
    `/moralis/wallet/${address}/nfts`
  );

  if (error) throw new Error(message);
  return data as TokenBalance[];
};

export const getWalletTokenSwapsSchema = z
  .function()
  .args(
    z
      .object({
        address: z
          .string()
          .describe(
            "The Solana wallet address to retrieve token swap history for"
          ),
        limit: z
          .number()
          .optional()
          .describe("Maximum number of swap records to return (max: 100)"),
        cursor: z
          .string()
          .optional()
          .describe("Pagination cursor for retrieving the next set of results"),
        fromDate: z
          .string()
          .optional()
          .describe(
            "Start date for filtering swaps (ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ)"
          ),
        toDate: z
          .string()
          .optional()
          .describe(
            "End date for filtering swaps (ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ)"
          ),
        order: z
          .enum(["ASC", "DESC"])
          .optional()
          .describe(
            "Sort order for results by timestamp (ASC: oldest first, DESC: newest first)"
          ),
        transactionTypes: z
          .enum(["buy", "sell"])
          .optional()
          .describe("Filter by transaction type (buy or sell)"),
        tokenAddress: z
          .string()
          .optional()
          .describe("Filter swaps by a specific token mint address"),
      })
      .describe("Filter parameters for retrieving wallet token swap history")
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
                    "The unique transaction signature/hash on the Solana blockchain"
                  ),
                transactionType: z
                  .enum(["buy", "sell"])
                  .describe(
                    "Whether this transaction was a buy or sell from the wallet's perspective"
                  ),
                transactionIndex: z
                  .number()
                  .describe("The index of this transaction within the block"),
                subCategory: z
                  .enum(["accumulation", "partialSell", "sellAll"])
                  .nullable()
                  .describe(
                    "Classification of the transaction pattern (accumulation: buying, partialSell: selling some, sellAll: selling entire position)"
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
                  .describe("The wallet address that performed this swap"),
                pairAddress: z
                  .string()
                  .describe(
                    "The address of the trading pair/pool where this swap occurred"
                  ),
                pairLabel: z
                  .string()
                  .describe(
                    "Human-readable label for the trading pair (e.g., 'SOL/USDC')"
                  ),
                exchangeAddress: z
                  .string()
                  .describe(
                    "The smart contract address of the decentralized exchange (DEX)"
                  ),
                exchangeName: z
                  .string()
                  .describe(
                    "The name of the decentralized exchange (e.g., 'Raydium', 'Orca', 'Jupiter')"
                  ),
                exchangeLogo: z
                  .string()
                  .describe("URL to the exchange's logo image"),
                baseToken: z
                  .string()
                  .describe(
                    "The mint address of the base token in the trading pair"
                  ),
                quoteToken: z
                  .string()
                  .describe(
                    "The mint address of the quote token in the trading pair"
                  ),
                bought: z
                  .object({
                    address: z
                      .string()
                      .describe(
                        "The mint address of the token that was acquired"
                      ),
                    name: z
                      .string()
                      .describe("The full name of the token that was acquired"),
                    symbol: z
                      .string()
                      .describe(
                        "The ticker symbol of the token that was acquired"
                      ),
                    logo: z
                      .string()
                      .describe(
                        "URL to the logo of the token that was acquired"
                      ),
                    amount: z
                      .string()
                      .describe(
                        "The formatted amount of tokens acquired (human-readable)"
                      ),
                    usdPrice: z
                      .number()
                      .describe(
                        "The USD price per token at the time of the swap"
                      ),
                    usdAmount: z
                      .number()
                      .describe("The total USD value of tokens acquired"),
                    tokenType: z
                      .enum(["token0", "token1"])
                      .describe(
                        "Whether this was token0 or token1 in the pair"
                      ),
                  })
                  .describe(
                    "Details about the token that was purchased/acquired in this swap"
                  ),
                sold: z
                  .object({
                    address: z
                      .string()
                      .describe("The mint address of the token that was sold"),
                    name: z
                      .string()
                      .describe("The full name of the token that was sold"),
                    symbol: z
                      .string()
                      .describe("The ticker symbol of the token that was sold"),
                    logo: z
                      .string()
                      .describe("URL to the logo of the token that was sold"),
                    amount: z
                      .string()
                      .describe(
                        "The formatted amount of tokens sold (human-readable)"
                      ),
                    usdPrice: z
                      .number()
                      .describe(
                        "The USD price per token at the time of the swap"
                      ),
                    usdAmount: z
                      .number()
                      .describe("The total USD value of tokens sold"),
                    tokenType: z
                      .enum(["token0", "token1"])
                      .describe(
                        "Whether this was token0 or token1 in the pair"
                      ),
                  })
                  .describe(
                    "Details about the token that was sold/given up in this swap"
                  ),
                baseQuotePrice: z
                  .string()
                  .describe(
                    "The exchange rate between the base and quote tokens at the time of swap"
                  ),
                totalValueUsd: z
                  .number()
                  .describe(
                    "The total USD value of the entire swap transaction"
                  ),
              })
              .describe(
                "Individual token swap transaction with complete details about tokens exchanged, prices, and metadata"
              )
          )
          .describe(
            "Array of token swap transactions matching the specified filters"
          ),
        pageSize: z
          .number()
          .describe("Number of results returned in this page"),
        page: z.number().describe("Current page number (starting from 1)"),
        cursor: z
          .string()
          .nullable()
          .describe(
            "Pagination cursor for retrieving the next set of results, null if no more results"
          ),
      })
      .describe(
        "Paginated response containing wallet token swap history with metadata for pagination"
      )
  );

export const getWalletTokenSwaps = async (filter: {
  address: string;
  limit?: number;
  cursor?: string;
  fromDate?: string;
  toDate?: string;
  order?: "ASC" | "DESC";
  transactionTypes?: "buy" | "sell";
  tokenAddress?: string;
}) => {
  const query = qs.stringify(omit(filter, "address"));
  const { error, message, data } = await client.get(
    `/moralis/wallet/${filter.address}/swaps?${query}`
  );

  if (error) throw new Error(message);
  return data as {
    result: TokenSwap[];
    pageSize: number;
    page: number;
    cursor: string | null;
  };
};
