import { BadRequestError } from "@/lib/adapters/errors";
import moralis from "@/lib/adapters/moralis";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: any) {
  try {
    const { address } = await params;

    const stats = await moralis.token.getAggregatedTokenPairStats(address);
    if (!stats) {
      throw BadRequestError("Could not get token pairs aggregated stats");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Token pair(s) aggregated stats fetched!",
        data: stats,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
