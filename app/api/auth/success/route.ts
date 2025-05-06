import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/authOptions";
import { connectMongoDB } from "@/lib/db";
import Order from "@/models/order";
import User from "@/models/user";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json(
        { message: "Utilisateur non authentifié" },
        { status: 401 },
      );
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur introuvable en base de données" },
        { status: 404 },
      );
    }

    const { sessionId }: { sessionId: string } = await req.json();
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;

    const stripe = new Stripe(stripeSecretKey);

    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });

    const lineItems = stripeSession.line_items?.data;
    if (!lineItems || lineItems.length === 0) {
      return NextResponse.json(
        { message: "Not products found." },
        { status: 400 },
      );
    }

    const metadata = (lineItems[0].price?.product as Stripe.Product)?.metadata;
    if (!metadata) {
      return NextResponse.json(
        { message: "Not metadata found." },
        { status: 400 },
      );
    }

    await Order.create({
      userId: user._id,
      orders: metadata,
    });

    return NextResponse.json({ hotel: metadata }, { status: 200 });
  } catch (error) {
    console.error("Erreur Stripe session:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
