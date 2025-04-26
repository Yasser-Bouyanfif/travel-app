import {getToken} from "next-auth/jwt";
import {NextRequest} from "next/server";
import {auth} from "@/lib/authOptions";

export async function GET(req: NextRequest) {
    const token = await getToken({req, secret: process.env.AUTH_SECRET})
    const session = await auth()

    return new Response(JSON.stringify(token), {
        status: 200,
        headers: {"Content-Type": "application/json"}
    });

}
