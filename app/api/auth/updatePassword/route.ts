import {NextRequest, NextResponse} from "next/server";
import {connectMongoDB} from "@/lib/db";
import {auth} from "@/lib/authOptions";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    const session = await auth()
    const email = session?.user?.email
    const user = await User.findOne({email: email})

    if (!user) {
        return NextResponse.json({message: "User not found."}, {status: 404})
    }

    try {
        const {currentPassword, newPassword, confirmNewPassword}: {
            currentPassword: string,
            newPassword: string,
            confirmNewPassword: string
        } = await req.json()
        const passwordsMatch = await bcrypt.compare(currentPassword, user.password)

        if (!passwordsMatch) {
            return NextResponse.json({message: "Passwords do not match."}, {status: 422})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12)

        await connectMongoDB()
        await User.findByIdAndUpdate(user._id, {
            password: hashedPassword
        })

        return NextResponse.json({message: "Password successfully updated."}, {status: 200})
    } catch (error) {
        console.log(error)
    }

}