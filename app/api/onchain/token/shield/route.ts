import { BadRequestError } from "@/lib/adapters/errors";
import jupiter from "@/lib/adapters/jupiter";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mint = searchParams.get("mint");
    if (!mint) throw BadRequestError("mint missing in request query");

    const info = await jupiter.shield(mint);
    if (!info) throw BadRequestError("Could not get token security info");

    return NextResponse.json(
      {
        success: true,
        message: "Token(s) fetched",
        data: info.warnings[mint],
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
