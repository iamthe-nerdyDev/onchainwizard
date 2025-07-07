import { BadRequestError, UnauthorizedError } from "@/lib/adapters/errors";
import onchainwallet from "@/lib/adapters/onchainwallet";
import prisma from "@/lib/adapters/prisma";
import Wallet from "@/lib/adapters/wallet";
import session from "@/lib/middleware/session";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const userId = await session();
    if (!userId) throw UnauthorizedError();

    const body = await req.json();
    const {
      name,
      symbol,
      imageUri,
      description,
      imgType,
      recipient,
      attributes,
    } = z
      .object({
        name: z.string(),
        symbol: z.string(),
        imageUri: z.string().url(),
        description: z.string(),
        imgType: z.string(),
        recipient: z.string(),
        attributes: z.array(
          z.object({ trait_type: z.string(), value: z.string() })
        ),
      })
      .parse(body);

    const wallet = await prisma.wallet.findFirst({ where: { userId } });
    if (!wallet) throw BadRequestError("Wallet not created!");

    const response = await onchainwallet.mintNft({
      pk: Wallet.decryptKey(wallet.pk),
      name,
      symbol,
      imageUri,
      description,
      imgType,
      attributes,
      recipient,
    });

    return NextResponse.json({
      success: true,
      message: "NFT minted!",
      data: response,
    });
  } catch (e) {
    return processError(e);
  }
}
