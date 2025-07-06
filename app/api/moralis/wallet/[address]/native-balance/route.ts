import { BadRequestError } from "@/lib/adapters/errors";
import moralis from "@/lib/adapters/moralis";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: any) {
  try {
    const { address } = await params;
    const balance = await moralis.token.getNativeBalance(address);
    if (!balance) throw BadRequestError("Could not get wallet native balance");

    return NextResponse.json(
      {
        success: true,
        message: "Native balance(s) fetched!",
        data: balance,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
