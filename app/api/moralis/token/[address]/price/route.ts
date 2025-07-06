import { BadRequestError } from "@/lib/adapters/errors";
import moralis from "@/lib/adapters/moralis";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: any) {
  try {
    const { address } = await params;

    const price = await moralis.token.getTokenPrice(address);
    if (!price) throw BadRequestError("Could not get token price");

    return NextResponse.json(
      {
        success: true,
        message: "Token price fetched!",
        data: price,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
