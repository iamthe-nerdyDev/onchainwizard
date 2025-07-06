import { BadRequestError, UnauthorizedError } from "@/lib/adapters/errors";
import onchainwallet, { OnchainWallet } from "@/lib/adapters/onchainwallet";
import prisma from "@/lib/adapters/prisma";
import session from "@/lib/middleware/session";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const userId = await session();
    if (!userId) throw UnauthorizedError();

    const body = await req.json();
    const { mint, recipient } = z
      .object({ mint: z.string(), recipient: z.string() })
      .parse(body);

    const wallet = await prisma.wallet.findFirst({ where: { userId } });
    if (!wallet) throw BadRequestError("Wallet not created!");

    const response = await onchainwallet.sendNft({
      mint,
      pk: OnchainWallet.decryptKey(wallet.pk),
      recipient,
      userId,
    });

    return NextResponse.json({
      success: true,
      message: "NFT sent!",
      data: { signature: response },
    });
  } catch (e) {
    return processError(e);
  }
}
