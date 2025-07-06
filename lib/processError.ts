import AppError from "@/lib/adapters/errors";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export default function (e: any) {
  if (e instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        message: e.message,
      },
      { status: e.statusCode }
    );
  }

  if (e instanceof ZodError) {
    const errors = e.errors.map((issue) => issue.message);
    return NextResponse.json(
      {
        success: false,
        message: errors[0],
      },
      { status: 400 }
    );
  }

  console.error("Unexpected error:", e);
  return NextResponse.json(
    {
      success: false,
      message: "Internal server error",
    },
    { status: 500 }
  );
}
