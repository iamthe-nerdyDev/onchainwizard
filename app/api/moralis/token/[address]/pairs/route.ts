import { BadRequestError } from "@/lib/adapters/errors";
import moralis from "@/lib/adapters/moralis";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { address } = await params;
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");
    const cursor = searchParams.get("cursor") ?? undefined;

    const pairs = await moralis.token.getTokenPairs(address, {
      limit: limit ? Number(limit) : undefined,
      cursor,
    });
    if (!pairs) throw BadRequestError("Could not get token pairs");

    return NextResponse.json(
      {
        success: true,
        message: "Token pair(s) fetched!",
        data: pairs,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
