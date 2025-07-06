import { BadRequestError } from "@/lib/adapters/errors";
import moralis from "@/lib/adapters/moralis";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { address } = await params;
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");
    const cursor = searchParams.get("cursor");

    const holders = await moralis.token.getTokenTopHolders(
      address,
      limit ? Number(limit) : undefined,
      cursor ?? undefined
    );
    if (!holders) throw BadRequestError("Could not get token top holders");

    return NextResponse.json(
      {
        success: true,
        message: "Token top holder(s) fetched!",
        data: holders,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
