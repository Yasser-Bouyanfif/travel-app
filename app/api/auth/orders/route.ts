import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {connectMongoDB} from "@/lib/db";
import User from "@/models/user";
import Order from "@/models/order";

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({req, secret: process.env.AUTH_SECRET})
        const email = token?.email

        await connectMongoDB()
        const user = await User.findOne({email: email}).select("_id")

        if (!user) {
            return NextResponse.json({message: "User not found"}, {status: 404})
        }

        const userId = user._id

        const orders = await Order.find({userId}).sort({createdAt: -1})

        return NextResponse.json(orders)
    } catch {
        return NextResponse.json({message: "Failed to fetch orders."}, {status: 500})
    }
}