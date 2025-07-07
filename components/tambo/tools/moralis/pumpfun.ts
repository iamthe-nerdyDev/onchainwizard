import AppClient from "../client";
import { z } from "zod";
import { toQueryString } from "@/lib/utils";

const client = new AppClient().getInstance();

export const getPumpFunTokenBondingStatusSchema = z
  .function()
  .args(
    z
      .string()
      .describe(
        "The contract address of the Pump(dot)Fun token to check bonding curve status for"
      )
  )
  .returns(
    z
      .object({
        mint: z.string().describe("The mint address of the token"),
        bondingProgress: z
          .number()
          .min(0)
          .max(100)
          .describe(
            "Current bonding curve progress as a percentage (0-100), where 100 means the token is ready to graduate"
          ),
      })
      .describe(
        "Current bonding curve status for the specified Pump(dot)Fun token"
      )
  );

export const getPumpFunTokenBondingStatus = async (tokenAddress: string) => {
  const { error, message, data } = await client.get(
    `/moralis/pumpfun/${tokenAddress}/status`
  );

  if (error) throw new Error(message);
  return data as { mint: string; bondingProgress: number };
};

export const getPumpFunBondingTokensSchema = z
  .function()
  .args(
    z
      .object({
        limit: z
          .number()
          .optional()
          .describe("Maximum number of tokens to return per page)"),
        cursor: z
          .string()
          .optional()
          .describe("Pagination cursor for fetching the next page of results"),
      })
      .describe(
        "Filter parameters for fetching tokens currently in bonding curve phase"
      )
  )
  .returns(
    z
      .object({
        result: z
          .array(
            z.object({
              tokenAddress: z
                .string()
                .describe(
                  "The unique contract address of the token on the blockchain"
                ),
              name: z
                .string()
                .describe(
                  "The human-readable name of the token (e.g., 'Dogecoin')"
                ),
              symbol: z
                .string()
                .describe("The ticker symbol of the token (e.g., 'DOGE')"),
              logo: z
                .string()
                .nullable()
                .describe(
                  "URL to the token's logo image, null if no logo is available"
                ),
              decimals: z
                .string()
                .describe(
                  "Number of decimal places supported by the token (as string)"
                ),
              priceNative: z
                .string()
                .describe(
                  "Current price of the token in native blockchain currency (SOL for Solana)"
                ),
              priceUsd: z
                .string()
                .describe("Current price of the token in USD"),
              liquidity: z
                .string()
                .describe("Total liquidity available for the token in USD"),
              fullyDilutedValuation: z
                .string()
                .nullable()
                .describe(
                  "Market cap if all tokens were in circulation, null if not calculable"
                ),
              createdAt: z
                .string()
                .optional()
                .describe(
                  "ISO timestamp when the token was created on PumpFun"
                ),
              graduatedAt: z
                .string()
                .optional()
                .describe(
                  "ISO timestamp when the token graduated from bonding curve, undefined if not graduated"
                ),
              bondingCurveProgress: z
                .number()
                .optional()
                .describe(
                  "Progress percentage (0-100) of the bonding curve completion"
                ),
            })
          )
          .describe("Array of PumpFun tokens currently in bonding curve phase"),
        pageSize: z
          .number()
          .describe("Number of tokens returned in this response"),
        page: z.number().describe("Current page number"),
        cursor: z
          .string()
          .nullable()
          .describe(
            "Cursor for the next page of results, null if no more pages available"
          ),
      })
      .describe(
        "Paginated list of tokens currently in bonding curve phase on Pump(dot)Fun"
      )
  );

export const getPumpFunBondingTokens = async (filter: {
  limit?: number;
  cursor?: string;
}) => {
  const query = toQueryString(filter);
  const { error, message, data } = await client.get(
    `/moralis/pumpfun/bonding?${query}`
  );

  if (error) throw new Error(message);
  return data as {
    result: PumpFunToken[];
    pageSize: number;
    page: number;
    cursor: string | null;
  };
};

export const getPumpFunGraduatedTokensSchema = z
  .function()
  .args(
    z
      .object({
        limit: z
          .number()
          .optional()
          .describe("Maximum number of tokens to return per page)"),
        cursor: z
          .string()
          .optional()
          .describe("Pagination cursor for fetching the next page of results"),
      })
      .describe(
        "Filter parameters for fetching tokens that have graduated from pump(dot)fun bonding curve"
      )
  )
  .returns(
    z
      .object({
        result: z
          .array(
            z.object({
              tokenAddress: z
                .string()
                .describe(
                  "The unique contract address of the token on the blockchain"
                ),
              name: z
                .string()
                .describe(
                  "The human-readable name of the token (e.g., 'Dogecoin')"
                ),
              symbol: z
                .string()
                .describe("The ticker symbol of the token (e.g., 'DOGE')"),
              logo: z
                .string()
                .nullable()
                .describe(
                  "URL to the token's logo image, null if no logo is available"
                ),
              decimals: z
                .string()
                .describe(
                  "Number of decimal places supported by the token (as string)"
                ),
              priceNative: z
                .string()
                .describe(
                  "Current price of the token in native blockchain currency (SOL for Solana)"
                ),
              priceUsd: z
                .string()
                .describe("Current price of the token in USD"),
              liquidity: z
                .string()
                .describe("Total liquidity available for the token in USD"),
              fullyDilutedValuation: z
                .string()
                .nullable()
                .describe(
                  "Market cap if all tokens were in circulation, null if not calculable"
                ),
              createdAt: z
                .string()
                .optional()
                .describe(
                  "ISO timestamp when the token was created on PumpFun"
                ),
              graduatedAt: z
                .string()
                .optional()
                .describe(
                  "ISO timestamp when the token graduated from bonding curve, undefined if not graduated"
                ),
              bondingCurveProgress: z
                .number()
                .optional()
                .describe(
                  "Progress percentage (0-100) of the bonding curve completion"
                ),
            })
          )
          .describe("Array of PumpFun tokens currently in bonding curve phase"),
        pageSize: z
          .number()
          .describe("Number of tokens returned in this response"),
        page: z.number().describe("Current page number"),
        cursor: z
          .string()
          .nullable()
          .describe(
            "Cursor for the next page of results, null if no more pages available"
          ),
      })
      .describe(
        "Paginated list of tokens that have successfully graduated from Pump(dot)Fun bonding curve and are now trading on regular DEXs"
      )
  );

export const getPumpFunGraduatedTokens = async (filter: {
  limit?: number;
  cursor?: string;
}) => {
  const query = toQueryString(filter);
  const { error, message, data } = await client.get(
    `/moralis/pumpfun/graduated?${query}`
  );

  if (error) throw new Error(message);
  return data as {
    result: PumpFunToken[];
    pageSize: number;
    page: number;
    cursor: string | null;
  };
};

export const getPumpFunLatestTokensSchema = z
  .function()
  .args(
    z
      .object({
        limit: z
          .number()
          .optional()
          .describe("Maximum number of tokens to return per page"),
        cursor: z
          .string()
          .optional()
          .describe("Pagination cursor for fetching the next page of results"),
      })
      .describe(
        "Filter parameters for fetching the most recently created tokens"
      )
  )
  .returns(
    z
      .object({
        result: z
          .array(
            z.object({
              tokenAddress: z
                .string()
                .describe(
                  "The unique contract address of the token on the blockchain"
                ),
              name: z
                .string()
                .describe(
                  "The human-readable name of the token (e.g., 'Dogecoin')"
                ),
              symbol: z
                .string()
                .describe("The ticker symbol of the token (e.g., 'DOGE')"),
              logo: z
                .string()
                .nullable()
                .describe(
                  "URL to the token's logo image, null if no logo is available"
                ),
              decimals: z
                .string()
                .describe(
                  "Number of decimal places supported by the token (as string)"
                ),
              priceNative: z
                .string()
                .describe(
                  "Current price of the token in native blockchain currency (SOL for Solana)"
                ),
              priceUsd: z
                .string()
                .describe("Current price of the token in USD"),
              liquidity: z
                .string()
                .describe("Total liquidity available for the token in USD"),
              fullyDilutedValuation: z
                .string()
                .nullable()
                .describe(
                  "Market cap if all tokens were in circulation, null if not calculable"
                ),
              createdAt: z
                .string()
                .optional()
                .describe(
                  "ISO timestamp when the token was created on PumpFun"
                ),
              graduatedAt: z
                .string()
                .optional()
                .describe(
                  "ISO timestamp when the token graduated from bonding curve, undefined if not graduated"
                ),
              bondingCurveProgress: z
                .number()
                .optional()
                .describe(
                  "Progress percentage (0-100) of the bonding curve completion"
                ),
            })
          )
          .describe("Array of PumpFun tokens currently in bonding curve phase"),
        pageSize: z
          .number()
          .describe("Number of tokens returned in this response"),
        page: z.number().describe("Current page number"),
        cursor: z
          .string()
          .nullable()
          .describe(
            "Cursor for the next page of results, null if no more pages available"
          ),
      })
      .describe(
        "Paginated list of the most recently created tokens on Pump(dot)Fun exchange for discovering new launches"
      )
  );

export const getPumpFunLatestTokens = async (filter: {
  limit?: number;
  cursor?: string;
}) => {
  const query = toQueryString(filter);
  const { error, message, data } = await client.get(
    `/moralis/pumpfun/latest?${query}`
  );

  if (error) throw new Error(message);
  return data as {
    result: PumpFunToken[];
    pageSize: number;
    page: number;
    cursor: string | null;
  };
};
