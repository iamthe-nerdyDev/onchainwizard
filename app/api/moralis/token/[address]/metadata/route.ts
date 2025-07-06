import { BadRequestError } from "@/lib/adapters/errors";
import moralis from "@/lib/adapters/moralis";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: any) {
  try {
    const { address } = await params;
    const metadata = await moralis.token.getTokenMetadata(address);
    if (!metadata) throw BadRequestError("Could not get token metadata");

    return NextResponse.json(
      {
        success: true,
        message: "Metadata fetched!",
        data: metadata,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
