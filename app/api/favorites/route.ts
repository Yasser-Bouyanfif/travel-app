import { NextRequest, NextResponse } from "next/server";
import Hotel, { IHotel } from "@/models/hotel";
import { connectMongoDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  interface Favorite {
    id: number;
    startDate: string;
    endDate: string;
  }

  const { stored } = await req.json();
  const ids = stored.map((obj: Favorite) => obj.id);

  await connectMongoDB();
  const hotels = await Hotel.find({
    "hotel.id": { $in: ids },
  }).lean(<IHotel[]>[]);

  if (!hotels) {
    return NextResponse.json({ message: "Not results found." });
  }

  const cleaned = hotels.map((obj) => {
    const match = stored.find((fav: Favorite) => fav.id === obj.hotel.id);
    return {
      ...obj,
      startDate: match?.startDate,
      endDate: match?.endDate,
    };
  });

  return NextResponse.json(cleaned);
}
