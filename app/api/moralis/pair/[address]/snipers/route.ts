import { BadRequestError } from "@/lib/adapters/errors";
import moralis from "@/lib/adapters/moralis";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { address } = await params;
    const { searchParams } = new URL(req.url);
    const blocksAfterCreation = searchParams.get("blocksAfterCreation");

    const snipers = await moralis.token.getSnipersByPairAddress(
      address,
      blocksAfterCreation
        ? { blocksAfterCreation: Number(blocksAfterCreation) }
        : undefined
    );
    if (!snipers) throw BadRequestError("Could not get snipers");

    return NextResponse.json(
      {
        success: true,
        message: "Sniper(s) fetched!",
        data: snipers,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
