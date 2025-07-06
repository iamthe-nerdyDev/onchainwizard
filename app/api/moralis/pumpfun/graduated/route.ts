import { BadRequestError } from "@/lib/adapters/errors";
import moralis from "@/lib/adapters/moralis";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");
    const cursor = searchParams.get("cursor");
    const tokens = await moralis.token.getGraduatedPumpFunTokens(
      limit ? Number(limit) : undefined,
      cursor ?? undefined
    );
    if (!tokens) throw BadRequestError("Could not get graduated tokens");

    return NextResponse.json(
      {
        success: true,
        message: "Pump(dot)fun graduated tokens fetched!",
        data: tokens,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
