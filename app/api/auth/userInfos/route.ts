import {NextRequest, NextResponse} from "next/server";
import {connectMongoDB} from "@/lib/db";
import {auth} from "@/lib/authOptions";
import User from "@/models/user";

export async function GET(req: NextRequest) {
    await connectMongoDB()
    const session = await auth()
    const user = session?.user
    const email = user?.email

    if (!session) {
        return NextResponse.json({message: "Session not found."}, {status: 404})
    }

    try {
        const userData = await User.findOne({email}).select("name email address postalCode city country")

        if (!userData) {
            return NextResponse.json({message: "User not found"}, {status: 404})
        }

        return NextResponse.json({userData})
    } catch (error) {
        console.log(error)
    }
}