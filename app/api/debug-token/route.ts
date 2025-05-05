import {getToken} from "next-auth/jwt";
import {NextRequest} from "next/server";

export async function GET(req: NextRequest) {
    const token = await getToken({req, secret: process.env.AUTH_SECRET})

    return new Response(JSON.stringify(token), {
        status: 200,
        headers: {"Content-Type": "application/json"}
    });

}
