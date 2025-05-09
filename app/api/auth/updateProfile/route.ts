import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userEmail = token?.email;

    if (!userEmail) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      address,
      postalCode,
      city,
      country,
    }: {
      address: string;
      postalCode: string;
      city: string;
      country: string;
    } = await req.json();

    const updated = await User.findByIdAndUpdate(
      user._id,
      { address, postalCode, city, country },
      { new: true },
    );

    return NextResponse.json({ updated, message: "User updated", status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred while updating the user." },
      { status: 500 },
    );
  }
}
