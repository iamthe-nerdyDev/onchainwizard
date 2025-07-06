import { BadRequestError } from "@/lib/adapters/errors";
import moralis from "@/lib/adapters/moralis";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: any) {
  try {
    const { address } = await params;
    const nfts = await moralis.nft.getNFTsByWallet(address);
    if (!nfts) throw BadRequestError("Could not get wallet nfts");

    return NextResponse.json(
      {
        success: true,
        message: "NFT(s) fetched!",
        data: nfts,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
