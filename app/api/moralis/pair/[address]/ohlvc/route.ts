import { BadRequestError } from "@/lib/adapters/errors";
import moralis from "@/lib/adapters/moralis";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { address } = await params;
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get("timeframe");
    const currency = searchParams.get("currency");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const limit = searchParams.get("limit");
    const cursor = searchParams.get("cursor") ?? undefined;

    if (
      !timeframe ||
      ![
        "10s",
        "30s",
        "1m",
        "5m",
        "10m",
        "30m",
        "1h",
        "4h",
        "12h",
        "1d",
        "1w",
        "1M",
      ].includes(timeframe)
    ) {
      throw BadRequestError("timeframe should be a valid timeframe");
    }

    if (!currency || !["usd", "native"].includes(currency)) {
      throw BadRequestError("currency should be one of usd or native");
    }

    if (!fromDate) throw BadRequestError("fromDate is missing in query");
    if (!toDate) throw BadRequestError("toDate is missing in query");

    const data = await moralis.token.getOHLVCByPairAddress(address, {
      limit: limit ? Number(limit) : undefined,
      cursor,
      fromDate,
      toDate,
      //@ts-ignore
      timeframe,
      //@ts-ignore
      currency,
    });
    if (!data) {
      throw BadRequestError("Could not get pair OHLVC");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Pair OHLVC fetched!",
        data: data,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
