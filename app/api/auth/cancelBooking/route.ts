import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/lib/authOptions";
import {connectMongoDB} from "@/lib/db";
import User from "@/models/user";
import Order from "@/models/order";

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB()
        const session = await auth()
        const userEmail = session?.user.email
        const user: any = await User.findOne({email: userEmail})
        const {id} = await req.json()

        if (!user) {
            return NextResponse.json({message: "User not found."}, {status: 401})
        }

        await Order.deleteOne({_id: id})
        return NextResponse.json({message: "Booking successfully deleted."}, {status: 200})

    } catch (error) {
        return NextResponse.json({message: "Failed to cancel booking."}, {status: 500})
    }
}