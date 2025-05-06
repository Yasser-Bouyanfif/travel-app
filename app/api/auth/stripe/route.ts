import {auth} from "@/lib/authOptions";
import {NextRequest, NextResponse} from "next/server"
import Stripe from 'stripe'


export async function POST(req: NextRequest) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY!
    const baseUrl = process.env.BASE_URL!

    const stripe = new Stripe(stripeSecretKey)

    const session = await auth()

    try {
        const data = await req.json()
        const {total, startDate, endDate, hotel, room} = data
        const ref = `TR${Math.floor(100000 + Math.random() * 900000)}`

        const stripeSession = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: hotel.name,
                            metadata: {
                                hotelData: JSON.stringify({
                                    name: hotel.name,
                                    address: hotel.address,
                                    location: hotel.location,
                                    rating: hotel.rating
                                }),
                                roomData: JSON.stringify({
                                    name: room.name,
                                    description: room.description,
                                    price_per_night: room.price_per_night,
                                    image: hotel.images[1]
                                }),
                                startDate: startDate,
                                endDate: endDate,
                                ref: ref,
                                total: total
                            }
                        },
                        unit_amount: total * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/cancel`,
        })

        if (!session) {
            if (stripeSession.url) {
                return NextResponse.json({
                    redirect: `${baseUrl}/login?callbackUrl=${encodeURIComponent(stripeSession.url)}`
                })
            } else {
                return NextResponse.json({message: "Stripe session URL is null"}, {status: 500});
            }
        }

        return NextResponse.json({url: stripeSession.url}, {status: 200})
    } catch {
        return NextResponse.json({message: "Stripe session creation failed"}, {status: 500})
    }
}
