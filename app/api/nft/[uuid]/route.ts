import { NotFoundError } from "@/lib/adapters/errors";
import prisma from "@/lib/adapters/prisma";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: any) {
  try {
    const { uuid } = await params;

    const nft = await prisma.nft.findFirst({ where: { uuid } });
    if (!nft) throw NotFoundError();

    return NextResponse.json(nft.data, { status: 200 });
  } catch (e) {
    return processError(e);
  }
}
