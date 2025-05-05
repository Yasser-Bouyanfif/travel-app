import {NextResponse} from 'next/server';
import {connectMongoDB} from "@/lib/db";
import Hotel from "@/models/hotel";

export async function GET() {
    try {
        await connectMongoDB()
        const hotels = await Hotel.find({})

        return NextResponse.json(hotels)
    } catch (error) {
        return NextResponse.json({error: 'Error fetching data.'}, {status: 500});
    }
}
