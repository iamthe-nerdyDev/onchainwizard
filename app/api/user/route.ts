import { UnauthorizedError } from "@/lib/adapters/errors";
import prisma from "@/lib/adapters/prisma";
import session from "@/lib/middleware/session";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function PUT(req: NextRequest) {
  try {
    const userId = await session();
    if (!userId) UnauthorizedError();

    const body = await req.json();
    const { name, age, experience } = z
      .object({
        name: z.string().optional(),
        age: z.number().optional(),
        experience: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
      })
      .parse(body);

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, age, experience },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Information updated",
        data: user,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
