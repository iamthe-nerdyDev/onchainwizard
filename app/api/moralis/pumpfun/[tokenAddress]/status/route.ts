import { BadRequestError } from "@/lib/adapters/errors";
import moralis from "@/lib/adapters/moralis";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: any) {
  try {
    const { tokenAddress } = await params;
    const status =
      await moralis.token.getPumpFunTokenBondingStatus(tokenAddress);
    if (!status) throw BadRequestError("Could not get token bonding status");

    return NextResponse.json(
      {
        success: true,
        message: "Pump(dot)fun token bonding status fetched!",
        data: status,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
