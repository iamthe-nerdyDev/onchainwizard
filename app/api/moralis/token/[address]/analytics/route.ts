import { BadRequestError } from "@/lib/adapters/errors";
import moralis from "@/lib/adapters/moralis";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: any) {
  try {
    const { address } = await params;

    const analytics = await moralis.token.getTokenAnalytics(address);
    if (!analytics) throw BadRequestError("Could not get token analytics");

    return NextResponse.json(
      {
        success: true,
        message: "Token analytics fetched!",
        data: analytics,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
