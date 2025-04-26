import {connectMongoDB} from "@/lib/db"
import User from "@/models/user"
import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB()

        const {email} = await req.json()
        const user = await User.findOne({email}).select("_id")

        if (!user) {
            return NextResponse.json({message: "User not found"}, {status: 404})
        }

        return NextResponse.json({user})
    } catch (error) {
        console.log(error)
    }
}