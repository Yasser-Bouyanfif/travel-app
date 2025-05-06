import { NextRequest, NextResponse } from "next/server";
import Hotel, { IHotel } from "@/models/hotel";

export async function POST(req: NextRequest) {
  interface Favorite {
    id: number;
    startDate: string;
    endDate: string;
  }

  const { stored }: { stored: Favorite[] } = await req.json();
  const ids = stored.map((fav) => fav.id);

  const hotels = await Hotel.find({ id: { $in: ids } }).lean<IHotel[]>();

  if (!hotels || hotels.length === 0) {
    return NextResponse.json({ message: "No results found." }, { status: 404 });
  }

  const cleaned = hotels.map((hotel) => {
    const match = stored.find((fav) => fav.id === hotel.id);
    return {
      ...hotel,
      startDate: match?.startDate ?? null,
      endDate: match?.endDate ?? null,
    };
  });

  return NextResponse.json(cleaned, { status: 200 });
}
