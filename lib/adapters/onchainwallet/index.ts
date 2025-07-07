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
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  generateSigner,
  keypairIdentity,
  percentAmount,
} from "@metaplex-foundation/umi";
import { nftStorageUploader } from "@metaplex-foundation/umi-uploader-nft-storage";

const RPC_URL = process.env.RPC_URL!;
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
    const umi = createUmi(RPC_URL);
    const creatorWallet = umi.eddsa.createKeypairFromSecretKey(
      bs58.decode(params.pk)
    );
    const creator = createSignerFromKeypair(umi, creatorWallet);
    umi.use(keypairIdentity(creator));
    umi.use(mplTokenMetadata());
    umi.use(nftStorageUploader({ token: process.env.NFTSTORAGE_API_KEY! }));

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

    const metadataUri = await umi.uploader.uploadJson(metadata);
    const mint = generateSigner(umi);
    return await createNft(umi, {
      mint,
      name: params.name,
      symbol: params.symbol,
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(0),
      creators: [{ address: creator.publicKey, verified: true, share: 100 }],
    }).sendAndConfirm(umi);
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
