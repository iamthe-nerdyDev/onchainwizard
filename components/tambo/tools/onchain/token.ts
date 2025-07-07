import { Job } from "@/generated/prisma";
import AppClient from "../client";
import { z } from "zod";

const client = new AppClient().getInstance();

export const sendTokenSchema = z
  .function()
  .args(
    z
      .object({
        mint: z
          .string()
          .describe(
            "The mint address (public key) of the token to be transferred. This uniquely identifies the specific token on the blockchain."
          ),
        runAt: z
          .string()
          .optional()
          .describe(
            "Optional ISO 8601 timestamp string specifying when the transaction should be executed. If provided, the transaction will be scheduled as a job for future execution. If omitted, the transaction will be executed immediately."
          ),
        recipients: z
          .array(
            z.object({
              address: z
                .string()
                .min(1, "Recipient address cannot be empty")
                .describe(
                  "The blockchain wallet address of the recipient who will receive the native tokens. Must be a valid address format for the solana blockchain."
                ),
              amount: z
                .number()
                .positive("Amount must be greater than zero")
                .describe("The amount of tokens to send to this recipient."),
            })
          )
          .min(1, "At least one recipient is required")
          .max(5, "Maximum 5 recipients allowed per transaction")
          .describe(
            "Array of recipient objects, each containing an address and amount. Supports batch transfers to multiple recipients in a single transaction."
          ),
      })
      .describe(
        "Payload for sending native blockchain tokens to one or more recipients"
      )
  )
  .returns(
    z
      .union([
        z.object({
          signature: z
            .string()
            .describe(
              "The blockchain transaction signature returned when the transaction is executed immediately. This can be used to track the transaction on the blockchain explorer."
            ),
        }),
        z.object({
          job: z
            .custom<Job>()
            .describe(
              "The job object returned when the transaction is scheduled for future execution using the runAt parameter. Contains job metadata including status, scheduling information, and execution details."
            ),
        }),
      ])
      .describe(
        "The return value varies based on execution mode: returns a signature object for immediate execution, or a job object for scheduled execution."
      )
  )
  .describe(
    "Sends SPL tokens to one or more recipients. Supports both immediate execution and scheduled execution for future delivery. Returns either a transaction signature for immediate execution or a job object for scheduled execution."
  );

export const sendToken = async (payload: {
  runAt?: string;
  mint: string;
  recipients: { address: string; amount: number }[];
}) => {
  const { error, message, data } = await client.post(
    "/onchain/token/send",
    payload
  );

  if (error) throw new Error(message);
  return data as {
    signature?: string;
    job?: Job;
  };
};

const TokenStatsSchema = z.object({
  priceChange: z
    .number()
    .nullable()
    .describe("Percentage change in token price over the time period"),
  holderChange: z
    .number()
    .nullable()
    .describe("Change in the number of token holders over the time period"),
  liquidityChange: z
    .number()
    .nullable()
    .describe("Change in token liquidity over the time period"),
  volumeChange: z
    .number()
    .nullable()
    .describe("Change in trading volume over the time period"),
  buyVolume: z
    .number()
    .nullable()
    .describe("Total volume of buy orders over the time period"),
  sellVolume: z
    .number()
    .nullable()
    .describe("Total volume of sell orders over the time period"),
  buyOrganicVolume: z
    .number()
    .nullable()
    .describe("Volume of organic (non-bot) buy orders over the time period"),
  sellOrganicVolume: z
    .number()
    .nullable()
    .describe("Volume of organic (non-bot) sell orders over the time period"),
  numBuys: z
    .number()
    .nullable()
    .describe("Total number of buy transactions over the time period"),
  numSells: z
    .number()
    .nullable()
    .describe("Total number of sell transactions over the time period"),
  numTraders: z
    .number()
    .nullable()
    .describe("Total number of unique traders over the time period"),
  numOrganicBuyers: z
    .number()
    .nullable()
    .describe("Number of organic (non-bot) buyers over the time period"),
  numNetBuyers: z
    .number()
    .nullable()
    .describe(
      "Net number of buyers (buyers minus sellers) over the time period"
    ),
});

const TokenAuditSchema = z.object({
  isSus: z
    .boolean()
    .describe("Whether the token has been flagged as suspicious"),
  mintAuthorityDisabled: z
    .boolean()
    .describe(
      "Whether the mint authority has been disabled (good for preventing infinite minting)"
    ),
  freezeAuthorityDisabled: z
    .boolean()
    .describe(
      "Whether the freeze authority has been disabled (good for preventing token freezing)"
    ),
  topHoldersPercentage: z
    .number()
    .nullable()
    .describe("Percentage of total supply held by top holders"),
  devBalancePercentage: z
    .number()
    .nullable()
    .describe("Percentage of total supply held by the developer/creator"),
  devMigrations: z
    .number()
    .nullable()
    .describe("Number of times the developer has migrated tokens"),
});

export const searchTokenSchema = z
  .function()
  .args(
    z
      .string()
      .min(1, "Search query cannot be empty")
      .describe(
        "Search query to find tokens. Can be token name, symbol, or mint address. For example: 'BONK', 'TRUMP', 'FART', 'DOGE' or a specific mint address."
      )
  )
  .returns(
    z
      .array(
        z.object({
          id: z.string().describe("Unique identifier for the token"),
          name: z
            .string()
            .describe("Full name of the token (e.g., 'Bonk Inu')"),
          symbol: z.string().describe("Token symbol/ticker (e.g., 'BONK')"),
          icon: z
            .string()
            .nullable()
            .describe("URL to the token's icon/logo image"),
          decimals: z
            .number()
            .describe(
              "Number of decimal places for the token (typically 6 or 9 for Solana tokens)"
            ),
          twitter: z
            .string()
            .nullable()
            .describe("Twitter/X account URL for the token project"),
          telegram: z
            .string()
            .nullable()
            .describe("Telegram group/channel URL for the token project"),
          website: z
            .string()
            .nullable()
            .describe("Official website URL for the token project"),
          dev: z
            .string()
            .nullable()
            .describe("Developer/creator wallet address"),
          circSupply: z
            .number()
            .nullable()
            .describe("Circulating supply of the token"),
          totalSupply: z
            .number()
            .nullable()
            .describe("Total supply of the token"),
          tokenProgram: z
            .string()
            .describe(
              "Solana token program address (usually Token Program or Token-2022)"
            ),
          launchpad: z
            .string()
            .nullable()
            .describe("Launchpad platform used to launch the token"),
          partnerConfig: z
            .string()
            .nullable()
            .describe("Partner configuration details"),
          graduatedPool: z
            .string()
            .nullable()
            .describe(
              "Pool address if the token has graduated from a bonding curve"
            ),
          graduatedAt: z
            .string()
            .nullable()
            .describe(
              "ISO timestamp when the token graduated from bonding curve"
            ),
          holderCount: z
            .number()
            .nullable()
            .describe("Total number of unique token holders"),
          fdv: z.number().nullable().describe("Fully Diluted Valuation in USD"),
          mcap: z.number().nullable().describe("Market capitalization in USD"),
          usdPrice: z
            .number()
            .nullable()
            .describe("Current price of the token in USD"),
          priceBlockId: z
            .number()
            .nullable()
            .describe("Block ID when the price was last updated"),
          liquidity: z
            .number()
            .nullable()
            .describe("Total liquidity available for trading in USD"),
          stats5m: TokenStatsSchema.nullable().describe(
            "Trading statistics for the last 5 minutes"
          ),
          stats1h: TokenStatsSchema.nullable().describe(
            "Trading statistics for the last 1 hour"
          ),
          stats6h: TokenStatsSchema.nullable().describe(
            "Trading statistics for the last 6 hours"
          ),
          stats24h: TokenStatsSchema.describe(
            "Trading statistics for the last 24 hours"
          ),
          firstPool: z
            .object({
              id: z
                .string()
                .describe("Pool ID where the token was first traded"),
              createdAt: z
                .string()
                .describe("ISO timestamp when the first pool was created"),
            })
            .nullable()
            .describe(
              "Information about the first trading pool created for this token"
            ),
          audit: TokenAuditSchema.nullable().describe(
            "Security audit information for the token"
          ),
          organicScore: z
            .number()
            .nullable()
            .describe("Organic activity score (0-100, higher is better)"),
          organicScoreLabel: z
            .enum(["high", "medium", "low"])
            .describe("Human-readable label for the organic score"),
          isVerified: z
            .boolean()
            .describe("Whether the token has been verified by the platform"),
          cexes: z
            .array(z.string())
            .nullable()
            .describe(
              "List of centralized exchanges where the token is listed"
            ),
          tags: z
            .array(z.string())
            .nullable()
            .describe("Tags/categories associated with the token"),
          updatedAt: z
            .string()
            .describe("ISO timestamp when the token data was last updated"),
        })
      )
      .describe(
        "Array of token search results with comprehensive metadata and statistics"
      )
  )
  .describe(
    "Searches for tokens by name, symbol, or mint address. Returns detailed information about matching tokens including price, liquidity, holder statistics, and security audit data."
  );

export const searchToken = async (query: string) => {
  const { error, message, data } = await client.get(
    `/onchain/token/search?query=${query}`
  );

  if (error) throw new Error(message);
  return data as SearchResponse;
};

export const getTokenShieldSchema = z
  .function()
  .args(
    z
      .string()
      .min(1, "Mint address cannot be empty")
      .describe(
        "The mint address (public key) of the token to analyze for security risks and warnings."
      )
  )
  .returns(
    z
      .array(
        z.object({
          type: z
            .enum([
              "NOT_VERIFIED",
              "HAS_MINT_AUTHORITY",
              "HAS_FREEZE_AUTHORITY",
              "NEW_LISTING",
              "LOW_ORGANIC_ACTIVITY",
              "NOT_SELLABLE",
              "HAS_PERMANENT_DELEGATE",
              "VERY_LOW_TRADING_ACTIVITY",
              "HIGH_SUPPLY_CONCENTRATION",
              "NON_TRANSFERABLE",
              "MUTABLE_TRANSFER_FEES",
              "SUSPICIOUS_DEV_ACTIVITY",
              "SUSPICIOUS_TOP_HOLDER_ACTIVITY",
              "HIGH_SINGLE_OWNERSHIP",
              "{}%_TRANSFER_FEES",
              "LOW_LIQUIDITY",
            ])
            .describe("Type of security warning or risk identified"),
          message: z
            .string()
            .describe("Human-readable description of the security concern"),
          severity: z
            .enum(["info", "warning", "critical"])
            .describe(
              "Severity level of the security concern (info = low risk, warning = medium risk, critical = high risk)"
            ),
        })
      )
      .describe("Array of security warnings and risk assessments for the token")
  )
  .describe(
    "Analyzes a token for security risks, suspicious activities, and potential red flags. Returns an array of warnings with severity levels to help users make informed decisions."
  );

export const getTokenShield = async (mint: string) => {
  const { error, message, data } = await client.get(
    `/onchain/token/shield?mint=${mint}`
  );

  if (error) throw new Error(message);
  return data as {
    type:
      | "NOT_VERIFIED"
      | "HAS_MINT_AUTHORITY"
      | "HAS_FREEZE_AUTHORITY"
      | "NEW_LISTING"
      | "LOW_ORGANIC_ACTIVITY"
      | "NOT_SELLABLE"
      | "HAS_PERMANENT_DELEGATE"
      | "VERY_LOW_TRADING_ACTIVITY"
      | "HIGH_SUPPLY_CONCENTRATION"
      | "NON_TRANSFERABLE"
      | "MUTABLE_TRANSFER_FEES"
      | "SUSPICIOUS_DEV_ACTIVITY"
      | "SUSPICIOUS_TOP_HOLDER_ACTIVITY"
      | "HIGH_SINGLE_OWNERSHIP"
      | "{}%_TRANSFER_FEES"
      | "LOW_LIQUIDITY";
    message: string;
    severity: "info" | "warning" | "critical";
  }[];
};

export const swapTokenSchema = z
  .function()
  .args(
    z
      .object({
        inputMint: z
          .string()
          .min(1, "Input mint address cannot be empty")
          .describe(
            "The mint address of the token you want to swap FROM. Use 'So11111111111111111111111111111111111111112' for native SOL."
          ),
        outputMint: z
          .string()
          .min(1, "Output mint address cannot be empty")
          .describe(
            "The mint address of the token you want to swap TO. Use 'So11111111111111111111111111111111111111112' for native SOL."
          ),
        amount: z
          .string()
          .min(1, "Amount cannot be empty")
          .describe("The amount of input tokens to swap."),
      })
      .describe(
        "Token swap configuration specifying input token, output token, and amount"
      )
  )
  .returns(
    z
      .object({
        status: z
          .enum(["Success", "Failed"])
          .describe("Whether the swap transaction was successful or failed"),
        signature: z
          .string()
          .describe(
            "Blockchain transaction signature for the swap transaction"
          ),
        slot: z
          .string()
          .describe("Solana slot number where the transaction was processed"),
        code: z
          .number()
          .describe(
            "Response code indicating the result of the swap operation"
          ),
        error: z
          .string()
          .optional()
          .describe("Error message if the swap failed"),
        inputAmountResult: z
          .string()
          .optional()
          .describe("Actual amount of input tokens that were swapped"),
        outputAmountResult: z
          .string()
          .optional()
          .describe("Actual amount of output tokens that were received"),
        swapEvents: z
          .array(
            z.object({
              inputMint: z
                .string()
                .describe("Mint address of the input token in this swap event"),
              inputAmount: z
                .string()
                .describe("Amount of input tokens in this swap event"),
              outputMint: z
                .string()
                .describe(
                  "Mint address of the output token in this swap event"
                ),
              outputAmount: z
                .string()
                .describe("Amount of output tokens in this swap event"),
            })
          )
          .optional()
          .describe(
            "Array of individual swap events that occurred during the transaction"
          ),
      })
      .describe(
        "Token swap execution result with transaction details and amounts"
      )
  )
  .describe(
    "Executes a token swap transaction on Solana. Swaps a specified amount of one token for another token at current market rates. Returns transaction signature and swap details."
  );

export const swapToken = async (payload: {
  inputMint: string;
  outputMint: string;
  amount: string;
}) => {
  const { error, message, data } = await client.post(
    "/onchain/token/swap",
    payload
  );

  if (error) throw new Error(message);
  return data as ExecuteResponse;
};
