// app/api/daywise-data/route.ts
import { prisma } from "@/lib/db/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fieldId,
      date,
      soilMoisture,
      soilTemperature,
      soilPH,
      nutrientN,
      nutrientP,
      nutrientK,
      soilEC,
      airTemperature,
      humidity,
      rainfall,
      leafWetness,
      canopyTemperature,
      evapotranspiration,
      solarPAR,
      notes,
      imageUrls = [], // Array of image URLs
    } = body;

    if (!fieldId || !date) {
      return NextResponse.json(
        { error: "fieldId and date are required" },
        { status: 400 },
      );
    }

    // Check if entry already exists for this field and date
    const existingEntry = await prisma.daywiseData.findUnique({
      where: {
        fieldId_date: {
          fieldId: parseInt(fieldId),
          date: new Date(date),
        },
      },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: "Entry already exists for this date" },
        { status: 409 },
      );
    }

    // Create the daywise data entry with images
    const newEntry = await prisma.daywiseData.create({
      data: {
        fieldId: parseInt(fieldId),
        date: new Date(date),
        soilMoisture,
        soilTemperature,
        soilPH,
        nutrientN,
        nutrientP,
        nutrientK,
        soilEC,
        airTemperature,
        humidity,
        rainfall,
        leafWetness,
        canopyTemperature,
        evapotranspiration,
        solarPAR,
        notes,
        // Create associated images
        images: {
          create: imageUrls.map((url: string) => ({
            url,
            caption: null, // You can add caption functionality later
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error: any) {
    console.error("Error creating daywise data:", error);
    return NextResponse.json(
      { error: "Failed to create daywise data" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fieldId = searchParams.get("fieldId");

    if (!fieldId) {
      return NextResponse.json(
        { error: "fieldId is required" },
        { status: 400 },
      );
    }

    const data = await prisma.daywiseData.findMany({
      where: { fieldId: parseInt(fieldId) },
      include: {
        images: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching daywise data:", error);
    return NextResponse.json(
      { error: "Failed to fetch daywise data" },
      { status: 500 },
    );
  }
}
