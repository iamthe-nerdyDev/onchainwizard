import { BadRequestError } from "@/lib/adapters/errors";
import moralis from "@/lib/adapters/moralis";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: any) {
  try {
    const { address } = await params;
    const nft = await moralis.nft.getNFT(address);
    if (!nft) throw BadRequestError("Could not nft");

    return NextResponse.json(
      {
        success: true,
        message: "NFT fetched!",
        data: nft,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
