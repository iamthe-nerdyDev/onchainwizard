import { BadRequestError, UnauthorizedError } from "@/lib/adapters/errors";
import prisma from "@/lib/adapters/prisma";
import session from "@/lib/middleware/session";
import processError from "@/lib/processError";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const userId = await session();
    if (!userId) throw UnauthorizedError();

    const body = await req.json();
    const { address, name } = z
      .object({ name: z.string().min(2), address: z.string() })
      .parse(body);

    const contact = await prisma.contact.create({
      data: { address, name, userId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact created successfully!",
        data: contact,
      },
      { status: 201 }
    );
  } catch (e) {
    return processError(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await session();
    if (!userId) throw UnauthorizedError();

    const body = await req.json();
    const { name } = z.object({ name: z.string().min(2) }).parse(body);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw BadRequestError("id not in request query");

    const contact = await prisma.contact.update({
      data: { name },
      where: { id: Number(id), userId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact updated successfully!",
        data: contact,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}

export async function GET(_req: NextRequest) {
  try {
    const userId = await session();
    if (!userId) throw UnauthorizedError();

    const contacts = await prisma.contact.findMany({
      where: { userId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contacts fetched!",
        data: contacts,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await session();
    if (!userId) throw UnauthorizedError();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw BadRequestError("id not in request query");

    const contact = await prisma.contact.delete({
      where: { id: Number(id), userId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact deleted successfully!",
        data: contact,
      },
      { status: 200 }
    );
  } catch (e) {
    return processError(e);
  }
}
