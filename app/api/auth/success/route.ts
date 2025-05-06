import {NextRequest, NextResponse} from "next/server"
import {auth} from "@/lib/authOptions"
import {connectMongoDB} from "@/lib/db"
import Order from "@/models/order"
import User from "@/models/user"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB()
        const session = await auth()
        const userEmail = session?.user.email
        const user = await User.findOne({email: userEmail})

        const {sessionId}: { sessionId: string } = await req.json()
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: '2024-04-10',
        })

        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items.data.price.product'],
        })

        const metadata = stripeSession.line_items.data[0].price.product.metadata

        await Order.create({
            userId: user._id,
            orders: metadata
        })

        return NextResponse.json({hotel: metadata})
    } catch (error) {
        return NextResponse.json({message: error}, {status: 500})
    }
}