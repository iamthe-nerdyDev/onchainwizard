import jupiter from "../jupiter";
import { omit } from "lodash";
import bs58 from "bs58";
import prisma from "../prisma";
import axios from "axios";
import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";

const RPC_URL = process.env.RPC_URL!;
const BASE_URL = process.env.NEXTAUTH_URL!;
const connection = new Connection(RPC_URL);

export class OnchainWallet {
  baseUrl = process.env.NEXTAUTH_URL;

  static async getDecimals(mint: string): Promise<number> {
    const info = await connection.getParsedAccountInfo(new PublicKey(mint));
    return (info.value?.data as any).parsed.info.decimals as number;
  }

  async buyToken(params: OrderParams & { pk: string }) {
    const buyResponse = await jupiter.order(omit(params, "pk"));

    if (!buyResponse || !buyResponse.transaction) return undefined;
    return await jupiter.execute(params.pk, {
      transactionBase64: buyResponse.transaction,
      requestId: buyResponse.requestId,
    });
  }

  async sendToken(params: SendTokenParams) {
    if (params.runAt) {
      if (!params.userId) throw new Error("userId is missing");
      return await prisma.job.create({
        data: {
          webhookUrl: `${this.baseUrl}/api/webhook`,
          runAt: params.runAt,
          tokenAddress: params.mint,
          userId: params.userId,
          tokenType: "SPL",
          data: params.recipients,
        },
      });
    }

    const keypair = Keypair.fromSecretKey(bs58.decode(params.pk));
    const transaction = new Transaction();

    const decimals = await OnchainWallet.getDecimals(params.mint);
    for (const recipient of params.recipients) {
      const { address, amount } = recipient;

      const sourceAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        keypair,
        new PublicKey(params.mint),
        keypair.publicKey
      );

      const destinationAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        keypair,
        new PublicKey(params.mint),
        new PublicKey(address)
      );

      transaction.add(
        createTransferInstruction(
          sourceAccount.address,
          destinationAccount.address,
          keypair.publicKey,
          amount * Math.pow(10, decimals)
        )
      );
    }

    const latestBlockHash = await connection.getLatestBlockhash("confirmed");
    transaction.recentBlockhash = await latestBlockHash.blockhash;
    return await sendAndConfirmTransaction(connection, transaction, [keypair]);
  }

  async sendNative(params: Omit<SendTokenParams, "mint">) {
    if (params.runAt) {
      if (!params.userId) throw new Error("userId is missing");
      return await prisma.job.create({
        data: {
          webhookUrl: `${this.baseUrl}/api/webhook`,
          runAt: params.runAt,
          userId: params.userId,
          tokenType: "NATIVE",
          data: params.recipients,
        },
      });
    }

    const keypair = Keypair.fromSecretKey(bs58.decode(params.pk));
    const transaction = new Transaction();

    for (const recipient of params.recipients) {
      const { address, amount } = recipient;
      const recipientPubkey = new PublicKey(address);

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: recipientPubkey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
    }

    const latestBlockHash = await connection.getLatestBlockhash("confirmed");
    transaction.recentBlockhash = await latestBlockHash.blockhash;
    return await sendAndConfirmTransaction(connection, transaction, [keypair]);
  }

  async sendNft(
    params: Omit<SendTokenParams, "recipients" | "runAt"> & {
      recipient: string;
    }
  ) {
    const keypair = Keypair.fromSecretKey(bs58.decode(params.pk));
    const transaction = new Transaction();
    const recipientPubkey = new PublicKey(params.recipient);

    const [senderTokenAccount, recipientTokenAccount] = await Promise.all([
      getAssociatedTokenAddress(new PublicKey(params.mint), keypair.publicKey),
      getAssociatedTokenAddress(new PublicKey(params.mint), recipientPubkey),
    ]);

    const recipientAccountInfo = await connection.getAccountInfo(
      recipientTokenAccount
    );
    if (!recipientAccountInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          keypair.publicKey,
          recipientTokenAccount,
          recipientPubkey,
          new PublicKey(params.mint)
        )
      );
    }

    transaction.add(
      createTransferInstruction(
        senderTokenAccount,
        recipientTokenAccount,
        keypair.publicKey,
        1
      )
    );

    return await sendAndConfirmTransaction(connection, transaction, [keypair]);
  }

  async mintNft(params: MintNFTParams & { pk: string }) {
    const metadata = {
      name: params.name,
      description: params.description,
      image: params.imageUri,
      attributes: params.attributes,
      properties: {
        files: [
          {
            type: params.imgType,
            uri: params.imageUri,
          },
        ],
      },
    };

    const { uuid } = await prisma.nft.create({ data: metadata });
    const uri = `${BASE_URL}/api/nft/${uuid}`;

    const { data } = await axios.post(
      "https://api.tatum.io/v3/nft/mint",
      {
        chain: "SOL",
        metadata: {
          name: params.name,
          symbol: params.symbol,
          sellerFeeBasisPoints: 0,
          uri,
          mutable: true,
        },
        to: params.recipient,
      },
      {
        headers: {
          "x-api-key": process.env.TATUM_API_KEY,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return data as {
      txId: { txId: string; nftAddress: string; nftAccountAddress: string };
    };
  }

  async generateImage(prompt: string) {
    const { data } = await axios.post(
      "https://api.deepai.org/api/text2img",
      { text: prompt },
      {
        headers: {
          "api-key": process.env.DEEPAI_API_KEY,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return data as {
      id: string;
      output_url: string;
      share_url: string;
      backend_request_id: string;
    };
  }
}

export default new OnchainWallet();
