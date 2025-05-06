import {NextRequest, NextResponse} from "next/server";
import Hotel from "@/models/hotel";

export async function POST(req: NextRequest) {
    interface Favorite {
        id: number,
        startDate: string,
        endDate: string
    }

    interface Room {
        id: number;
        name: string;
        description: string;
        price_per_night: number;
        available_dates: string[];
        max_guests: number;
        amenities: string[];
        image: string;
    }

    interface Hotel {
        id: number;
        name: string;
        description: string;
        address: string;
        location: string;
        rating: number;
        booking_info: object;
        amenities: string[];
        images: string[];
        rooms: Room[];
    }

    const {stored} = await req.json()
    const ids = stored.map((obj: Favorite) => obj.id)

    const hotels = await Hotel.find({
        "hotel.id": {$in: ids}
    }).lean()

    if (!hotels) {
        return NextResponse.json({message: "Not results found."})
    }

    const cleaned = hotels.map((obj: { hotel: Hotel, startDate: string, endDate: string }) => {
        const match = stored.find((fav: Favorite) => fav.id === obj.hotel.id)
        return {
            ...obj,
            startDate: match?.startDate,
            endDate: match?.endDate
        }
    })

    return NextResponse.json(cleaned)
}