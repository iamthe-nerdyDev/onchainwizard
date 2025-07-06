import { BadRequestError } from "@/lib/adapters/errors";
import moralis from "@/lib/adapters/moralis";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: any) {
  try {
    const { address } = await params;
    const balances = await moralis.token.getSPLBalances(address);
    if (!balances) throw BadRequestError("Could not get wallet SPL balances");

    return NextResponse.json(
      {
        success: true,
        message: "SPL balance(s) fetched!",
        data: balances,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
