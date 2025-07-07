import { BadRequestError, UnauthorizedError } from "@/lib/adapters/errors";
import onchainwallet from "@/lib/adapters/onchainwallet";
import prisma from "@/lib/adapters/prisma";
import session from "@/lib/middleware/session";
import processError from "@/lib/processError";
import { Wallet } from "lucide-react";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const userId = await session();
    if (!userId) throw UnauthorizedError();

    const body = await req.json();
    const { inputMint, outputMint, amount } = z
      .object({
        inputMint: z.string(),
        outputMint: z.string(),
        amount: z.string(),
      })
      .parse(body);

    const wallet = await prisma.wallet.findFirst({ where: { userId } });
    if (!wallet) throw BadRequestError("Wallet not created!");

    const response = await onchainwallet.buyToken({
      amount,
      inputMint,
      outputMint,
      pk: Wallet.decryptKey(wallet.pk),
      taker: wallet.address,
    });

    return NextResponse.json({
      success: true,
      message: "Swap completed!",
      data: response,
    });
  } catch (e) {
    return processError(e);
  }
}
