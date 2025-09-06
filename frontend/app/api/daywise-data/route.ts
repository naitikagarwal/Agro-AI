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
      imageUrls = []
    } = body;

    if (!fieldId || !date) {
      return NextResponse.json({ error: "fieldId and date are required" }, { status: 400 });
    }

    // create daywise data (date stored as ISO)
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    // Because of unique constraint (fieldId, date) handle duplicates
    try {
      const created = await prisma.daywiseData.create({
        data: {
          fieldId: Number(fieldId),
          date: parsedDate,
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
          // createdAt default will be set
        },
      });

      // create images if provided (simple URL list)
      if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        const imagesData = imageUrls.map((url: string) => ({ daywiseDataId: created.id, url }));
        await prisma.daywiseImage.createMany({
          data: imagesData,
        });
      }

      // return the created entry including images
      const result = await prisma.daywiseData.findUnique({
        where: { id: created.id },
        include: { images: true }
      });

      return NextResponse.json(result, { status: 201 });
    } catch (err: any) {
      // if unique constraint fails (duplicate date for same field)
      if (err?.code === "P2002") {
        return NextResponse.json({ error: "Entry for this date already exists" }, { status: 409 });
      }
      console.error(err);
      return NextResponse.json({ error: "Failed to create daywise data" }, { status: 500 });
    }

  } catch (error) {
    console.error("POST /api/daywise-data error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
