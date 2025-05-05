import {NextRequest, NextResponse} from "next/server";
import {connectMongoDB} from "@/lib/db";
import Review from "@/models/review";

export async function GET(req: NextRequest) {
    try {
        await connectMongoDB()
        const data = await Review.find({}).sort({createdAt: -1})

        return NextResponse.json(data)
    } catch (error) {
        NextResponse.json({message: "Failed to fetch data"}, {status: 500})
    }
}