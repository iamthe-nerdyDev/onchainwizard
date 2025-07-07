import { Keypair, VersionedTransaction } from "@solana/web3.js";
import JupiterClient from "./client";
import bs58 from "bs58";
import { toQueryString } from "@/lib/utils";

class Jupiter {
  constructor(private client = new JupiterClient().getInstance()) {}

  /**
   *
   * @description Request for a base64-encoded unsigned swap transaction to be used in 'execute'
   */
  async order(params: OrderParams) {
    const query = toQueryString(params);
    const { error, data } = await this.client.get(`/order?${query}`);

    if (error) return undefined;
    return data as OrderResponse;
  }

  /**
   *
   * @description Execute the signed transaction and get the execution status
   */
  async execute(
    key: string,
    payload: { transactionBase64: string; requestId: string }
  ) {
    const wallet = Keypair.fromSecretKey(bs58.decode(key));
    const transaction = VersionedTransaction.deserialize(
      Buffer.from(payload.transactionBase64, "base64")
    );

    transaction.sign([wallet]);
    const signedTransaction = Buffer.from(transaction.serialize()).toString(
      "base64"
    );

    const { error, data } = await this.client.post("/execute", {
      signedTransaction,
      requestId: payload.requestId,
    });

    if (data.error) throw new Error(data.error);
    if (error) return undefined;
    return data as ExecuteResponse;
  }

  /**
   *
   * @description Request for token information and warnings of mint
   */
  async shield(tokenAddress: string) {
    const query = toQueryString({ mints: tokenAddress });
    const { error, data } = await this.client.get(`/shield?${query}`);

    if (error) return undefined;
    return data as {
      warnings: {
        [key: string]: {
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
    };
  }

  async search(name: string) {
    const query = toQueryString({ query: name });
    const { error, data } = await this.client.get(`/search?${query}`);

    if (error) return undefined;
    return data as SearchResponse;
  }
}

export default new Jupiter();
