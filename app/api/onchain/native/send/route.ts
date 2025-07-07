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
    const { runAt, recipients } = z
      .object({
        runAt: z.string().time().optional(),
        recipients: z
          .array(z.object({ address: z.string(), amount: z.number() }))
          .max(5),
      })
      .parse(body);

    const wallet = await prisma.wallet.findFirst({ where: { userId } });
    if (!wallet) throw BadRequestError("Wallet not created!");

    const response = await onchainwallet.sendNative({
      pk: Wallet.decryptKey(wallet.pk),
      recipients,
      runAt,
      userId,
    });

    return NextResponse.json({
      success: true,
      message: "Action completed!",
      data:
        typeof response === "string"
          ? { signature: response }
          : { job: response },
    });
  } catch (e) {
    return processError(e);
  }
}
