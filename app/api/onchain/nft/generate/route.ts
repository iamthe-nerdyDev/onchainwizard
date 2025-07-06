import onchainwallet from "@/lib/adapters/onchainwallet";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = z.object({ prompt: z.string() }).parse(body);

    const response = await onchainwallet.generateImage(prompt);
    return NextResponse.json({
      success: true,
      message: "Image generated!",
      data: response,
    });
  } catch (e) {
    return processError(e);
  }
}
