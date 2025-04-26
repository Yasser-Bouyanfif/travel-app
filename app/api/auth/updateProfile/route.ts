import {NextRequest, NextResponse} from "next/server";
import {connectMongoDB} from "@/lib/db";
import {getToken} from "next-auth/jwt";
import User from "@/models/user";

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB()
        const token = await getToken({req, secret: process.env.AUTH_SECRET});
        const userId = token?.sub

        if (!userId) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        const {address, postalCode, city, country}: {
            address: string,
            postalCode: string,
            city: string,
            country: string
        } = await req.json()

        const updated = await User.findByIdAndUpdate(userId, {
            address: address,
            postalCode: postalCode,
            city: city,
            country: country
        }, {new: true})

        return NextResponse.json({updated, message: "User updated", status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "An error occured while updating the user."}, {status: 500})
    }
}