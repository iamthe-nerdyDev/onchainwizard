import { BadRequestError } from "@/lib/adapters/errors";
import jupiter from "@/lib/adapters/jupiter";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    if (!query) throw BadRequestError("query missing in request query");

    const tokens = await jupiter.search(query);
    if (!tokens) throw BadRequestError("Could not get tokens");

    return NextResponse.json(
      {
        success: true,
        message: "Token(s) fetched",
        data: tokens,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
