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
    const fromDate = searchParams.get("fromDate") ?? undefined;
    const toDate = searchParams.get("toDate") ?? undefined;
    const order = searchParams.get("order") ?? undefined;
    const transactionTypes = searchParams.get("transactionTypes") ?? undefined;
    const tokenAddress = searchParams.get("tokenAddress") ?? undefined;

    if (order && !["ASC", "DESC"].includes(order)) {
      throw BadRequestError("order should be one of ASC or DESC");
    }

    if (transactionTypes && !["buy", "sell"].includes(transactionTypes)) {
      throw BadRequestError("transactionTypes should be one of buy or sell");
    }

    const swaps = await moralis.token.getTokenSwapsByWalletAddress(address, {
      limit: limit ? Number(limit) : undefined,
      cursor,
      fromDate,
      toDate,
      //@ts-ignore
      order,
      //@ts-ignore
      transactionTypes,
      tokenAddress,
    });
    if (!swaps) throw BadRequestError("Could not get wallet swaps");

    return NextResponse.json(
      {
        success: true,
        message: "Wallet swaps fetched!",
        data: swaps,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
