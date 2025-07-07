import { UnauthorizedError } from "@/lib/adapters/errors";
import prisma from "@/lib/adapters/prisma";
import Wallet from "@/lib/adapters/wallet";
import session from "@/lib/middleware/session";
import processError from "@/lib/processError";
import { omit } from "lodash";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    const userId = await session();
    if (!userId) throw UnauthorizedError();

    let wallet = await prisma.wallet.findFirst({ where: { userId } });
    if (!wallet) {
      const { encryptedPK, publicKey } = Wallet.createKey();
      wallet = await prisma.wallet.create({
        data: {
          address: publicKey,
          pk: encryptedPK,
          userId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Wallet fetched!",
      data: omit(wallet, "pk"),
    });
  } catch (e) {
    return processError(e);
  }
}
