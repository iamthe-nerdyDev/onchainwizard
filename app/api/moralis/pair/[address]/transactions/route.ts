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

    if (order && !["ASC", "DESC"].includes(order)) {
      throw BadRequestError("order should be one of ASC or DESC");
    }

    if (
      transactionTypes &&
      !["buy", "sell", "addLiquidity", "removeLiquidity"].includes(
        transactionTypes
      )
    ) {
      throw BadRequestError(
        "transactionTypes should be one of buy, sell, addLiquidity, or removeLiquidity"
      );
    }

    const transactions = await moralis.token.getTokenTransactionsByPairAddress(
      address,
      {
        limit: limit ? Number(limit) : undefined,
        cursor,
        fromDate,
        toDate,
        //@ts-ignore
        order,
        //@ts-ignore
        transactionTypes,
      }
    );
    if (!transactions) {
      throw BadRequestError("Could not get pair address transactions");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Token pair transactions fetched!",
        data: transactions,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
