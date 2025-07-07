import type { AxiosInstance } from "axios";
import MoralisClient from "./client";
import { toQueryString } from "@/lib/utils";

enum Networks {
  MAINNET = "mainnet",
  DEVNET = "devnet",
}

const network = Networks.MAINNET;

class Token {
  constructor(private client: AxiosInstance) {}

  /**
   *
   * @description Get the global token metadata for a given contract (mint, standard, name, symbol, metaplex).
   */
  async getTokenMetadata(tokenAddress: string) {
    const { error, data } = await this.client.get(
      `/token/${network}/${tokenAddress}/metadata`
    );

    if (error) return undefined;
    return data as TokenMetadata;
  }

  /**
   *
   * @description Gets the native balance owned by a given address.
   */
  async getNativeBalance(address: string) {
    const { error, data } = await this.client.get(
      `/account/${network}/${address}/balance`
    );

    if (error) return undefined;
    return data as NativeBalance;
  }

  /**
   *
   * @description Gets the token balances owned by a given address.
   */
  async getSPLBalances(address: string) {
    const { error, data } = await this.client.get(
      `/account/${network}/${address}/tokens?excludeSpam=false`
    );

    if (error) return undefined;
    return data as TokenBalance[];
  }

  /**
   *
   * @description Returns a list of newly created tokens on pump(dot)fun
   */
  async getLatestPumpFunTokens(limit = 20, cursor?: string) {
    const query = toQueryString({ limit, cursor });
    const { error, data } = await this.client.get(
      `/token/${network}/exchange/pumpfun/new?${query}`
    );

    if (error) return undefined;
    return data as {
      result: PumpFunToken[];
      pageSize: number;
      page: number;
      cursor: string | null;
    };
  }

  /**
   *
   * @description Returns a list of tokens currently in the bonding phase on pump(dot)fun
   */
  async getBondingPumpFunTokens(limit = 20, cursor?: string) {
    const query = toQueryString({ limit, cursor });
    const { error, data } = await this.client.get(
      `/token/${network}/exchange/pumpfun/bonding?${query}`
    );

    if (error) return undefined;
    return data as {
      result: PumpFunToken[];
      pageSize: number;
      page: number;
      cursor: string | null;
    };
  }

  /**
   *
   * @description Returns a list of tokens that have graduated (completed bonding phase) on pump(dot)fun
   */
  async getGraduatedPumpFunTokens(limit = 20, cursor?: string) {
    const query = toQueryString({ limit, cursor });
    const { error, data } = await this.client.get(
      `/token/${network}/exchange/pumpfun/graduated?${query}`
    );

    if (error) return undefined;
    return data as {
      result: PumpFunToken[];
      pageSize: number;
      page: number;
      cursor: string | null;
    };
  }

  /**
   *
   * @description Returns the bonding progress status for a specific token on pump(dot)fun
   */
  async getPumpFunTokenBondingStatus(tokenAddress: string) {
    const { error, data } = await this.client.get(
      `/token/${network}/${tokenAddress}/bonding-status`
    );

    if (error) return undefined;
    return data as { mint: string; bondingProgress: number };
  }

  /**
   *
   * @description Get a list of top token holders for a specific Solana token address
   */
  async getTokenTopHolders(tokenAddress: string, limit = 20, cursor?: string) {
    const query = toQueryString({ limit, cursor });
    const { error, data } = await this.client.get(
      `/token/${network}/${tokenAddress}/top-holders?${query}`
    );

    if (error) return undefined;
    return data as {
      result: TokenTopHolder[];
      pageSize: number;
      page: number;
      cursor: string | null;
      totalSupply: string;
    };
  }

  /**
   *
   * @description Get Solana token holder summary
   */
  async getTokenHoldersStats(tokenAddress: string) {
    const { error, data } = await this.client.get(
      `/token/${network}/holders/${tokenAddress}`
    );

    if (error) return undefined;
    return data as TokenHoldersStat;
  }

  /**
   *
   * @description Get all swap related transactions (buy, sell, add liquidity & remove liquidity) for a specific pair address.
   */
  async getTokenTransactionsByPairAddress(
    pairAddress: string,
    filter: {
      fromDate?: string;
      toDate?: string;
      cursor?: string;
      limit?: number;
      order?: "ASC" | "DESC";
      transactionTypes?: "buy" | "sell" | "addLiquidity" | "removeLiquidity";
    }
  ) {
    const query = toQueryString(filter);
    const { error, data } = await this.client.get(
      `/token/${network}/pairs/${pairAddress}/swaps?${query}`
    );

    if (!error) return undefined;
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
  }

  /**
   *
   * @description Get all swap related transactions (buy, sell) for a specific token address.
   */
  async getTokenSwapsByTokenAddress(
    tokenAddress: string,
    filter: {
      fromDate?: string;
      toDate?: string;
      cursor?: string;
      limit?: number;
      order?: "ASC" | "DESC";
      transactionTypes?: "buy" | "sell";
    }
  ) {
    const query = toQueryString(filter);
    const { error, data } = await this.client.get(
      `/token/${network}/${tokenAddress}/swaps?${query}`
    );

    if (!error) return undefined;
    return data as {
      result: TokenSwap[];
      pageSize: number;
      page: number;
      cursor: string | null;
    };
  }

  /**
   *
   * @description Get all swap related transactions (buy, sell) for a specific wallet address.
   */
  async getTokenSwapsByWalletAddress(
    address: string,
    filter: {
      fromDate?: string;
      toDate?: string;
      cursor?: string;
      limit?: number;
      order?: "ASC" | "DESC";
      transactionTypes?: "buy" | "sell";
      tokenAddress?: string;
    }
  ) {
    const query = toQueryString(filter);
    const { error, data } = await this.client.get(
      `/account/${network}/${address}/swaps?${query}`
    );

    if (!error) return undefined;
    return data as {
      result: TokenSwap[];
      pageSize: number;
      page: number;
      cursor: string | null;
    };
  }

  /**
   *
   * @description Get the supported pairs for a specific token address
   */
  async getTokenPairs(
    tokenAddress: string,
    filter: { cursor?: string; limit?: number }
  ) {
    const query = toQueryString(filter);
    const { error, data } = await this.client.get(
      `/token/${network}/${tokenAddress}/pairs?${query}`
    );

    if (error) return undefined;
    return data as {
      results: TokenPair[];
      pageSize: number;
      page: number;
      cursor: null | string;
    };
  }

  /**
   *
   * @description Get the pair stats by using pair address
   */
  async getTokenPairStats(pairAddress: string) {
    const { error, data } = await this.client.get(
      `/token/${network}/pairs/${pairAddress}/pairs/stats`
    );

    if (error) return undefined;
    return data as TokenPairStat;
  }

  /**
   *
   * @description Get aggregated statistics across supported pairs of a token.
   */
  async getAggregatedTokenPairStats(tokenAddress: string) {
    const { error, data } = await this.client.get(
      `/token/${network}/${tokenAddress}/pairs/stats`
    );

    if (error) return undefined;
    return data as AggregatedTokenPairStats;
  }

  /**
   *
   * @description Get analytics for a token by token address
   */
  async getTokenAnalytics(tokenAddress: string) {
    const { error, data } = await this.client.get(
      `https://deep-index.moralis.io/api/v2.2/tokens/${tokenAddress}/analytics?chain=solana`
    );

    if (error) return undefined;
    return data as TokenAnalytics;
  }

  /**
   *
   * @description Gets the token price (usd and native) for a given contract address and network. Fetches the price information for the DEX pair with the highest liquidity
   */
  async getTokenPrice(tokenAddress: string) {
    const { error, data } = await this.client.get(
      `/token/${network}/${tokenAddress}/price`
    );

    if (error) return undefined;
    return data as TokenPrice;
  }

  /**
   *
   * @description Gets the candlesticks for a specific pair address
   */
  async getOHLVCByPairAddress(
    pairAddress: string,
    filter: {
      timeframe: MoralisTimeFrame;
      currency: "usd" | "native";
      fromDate: string;
      toDate: string;
      limit?: number;
      cursor?: string;
    }
  ) {
    const query = toQueryString(filter);
    console.log(query);
    const { error, data } = await this.client.get(
      `/token/${network}/pairs/${pairAddress}/ohlcv?${query}`
    );

    if (error) return undefined;
    return data as {
      cursor: null | string;
      page: 1;
      pairAddress: string;
      tokenAddress: string;
      timeframe: MoralisTimeFrame;
      currency: "usd" | "native";
      result: OHLCV[];
    };
  }

  /**
   *
   * @description Get all snipers (wallets that quickly buy and sell tokens) for a specific token pair address
   */
  async getSnipersByPairAddress(
    pairAddress: string,
    filter?: { blocksAfterCreation: number }
  ) {
    const query = toQueryString(filter);
    const { error, data } = await this.client.get(
      `/token/${network}/pairs/${pairAddress}/snipers?${query}`
    );

    if (error) return undefined;
    return data as {
      blockNumber: number;
      blockTimestamp: string;
      transactionHash: string;
      result: TokenSniper[];
    };
  }
}

class NFT {
  constructor(private client: AxiosInstance) {}

  /**
   *
   * @description Gets NFTs owned by a given address.
   */
  async getNFTsByWallet(address: string) {
    const query = toQueryString({
      nftMetadata: true,
      mediaItems: true,
      excludeSpam: false,
    });
    const { error, data } = await this.client.get(
      `/account/${network}/${address}/nft?${query}`
    );

    if (!error) return undefined;
    return data as WalletNFT[];
  }

  /**
   *
   * @description Get the global NFT metadata for a given contract (mint, standard, name, symbol, metaplex).
   */
  async getNFT(address: string) {
    const { error, data } = await this.client.get(
      `/nft/${network}/${address}/metadata`
    );

    if (!error) return undefined;
    return data as WalletNFT;
  }
}

class Moralis {
  token: Token;
  nft: NFT;

  constructor(private client = new MoralisClient()) {
    this.token = new Token(this.client.getInstance());
    this.nft = new NFT(this.client.getInstance());
  }
}

export default new Moralis();
