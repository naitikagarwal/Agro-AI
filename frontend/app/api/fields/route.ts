// app/api/fields/route.ts
import { prisma } from "@/lib/db/db";
import { NextResponse } from "next/server";
// import prisma from "@/lib/db"; // adjust path to your prisma client

// POST /api/fields
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, name, location, description } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { error: "userId and name are required" },
        { status: 400 },
      );
    }

    const newField = await prisma.field.create({
      data: {
        userId,
        name,
        location,
        description,
      },
    });

    return NextResponse.json(newField, { status: 201 });
  } catch (error: any) {
    console.error("Error creating field:", error);
    return NextResponse.json(
      { error: "Failed to create field" },
      { status: 500 },
    );
  }
}

// GET /api/fields?userId=123
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const fields = await prisma.field.findMany({
      where: { userId: Number(userId) },
      include: {
        daywiseData: true,
        daywiseResults: true,
        finalResults: true,
      },
    });

    return NextResponse.json(fields);
  } catch (error: any) {
    console.error("Error fetching fields:", error);
    return NextResponse.json(
      { error: "Failed to fetch fields" },
      { status: 500 },
    );
  }
}
