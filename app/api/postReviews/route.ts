import {NextRequest, NextResponse} from "next/server";
import {connectMongoDB} from "@/lib/db";
import Review from "@/models/review";

export async function POST(req: NextRequest) {
    await connectMongoDB()

    try {
        const {name, rating, comment}: {
            name: string,
            rating: number,
            comment: string
        } = await req.json()

        await Review.create({
            name,
            rating,
            comment
        })

        return NextResponse.json({message: "Review registered."}, {status: 201})
    } catch (error) {
        return NextResponse.json({message: "Registration failed."}, {status: 500})
    }
}