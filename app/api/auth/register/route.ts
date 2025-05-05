import {NextRequest, NextResponse} from "next/server"
import {connectMongoDB} from "@/lib/db"
import User from "@/models/user"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {

    try {
        const {name, email, password, address, postalCode, city, country}: {
            name: string,
            email: string,
            password: string,
            address?: null,
            postalCode?: null,
            city?: null,
            country?: null
        } = await req.json()
        const hashedPassword = await bcrypt.hash(password, 12)

        await connectMongoDB()
        await User.create({
            name,
            email,
            password: hashedPassword,
            address,
            postalCode,
            city,
            country
        })

        return NextResponse.json({message: "User registered."}, {status: 201})
    } catch (error) {
        return NextResponse.json({message: "An error occured while registering the user."}, {status: 500})
    }
}