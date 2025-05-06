import {NextRequest, NextResponse} from "next/server";

import {Resend} from "resend";

export async function POST(req: NextRequest) {
    const {name, email, subject, message} = await req.json();
    const resend = new Resend("re_bGuPLcnn_KDZz5xX25E3Zm7gkHeoQZRA1");

    if (!name || !email || !subject || !message) {
        return NextResponse.json(
            {message: "Please fill in all the required fields."},
            {status: 402},
        );
    }

    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            replyTo: email,
            to: ["tloli0940@gmail.com"],
            subject: subject,
            html: message,
        });

        return NextResponse.json(
            {message: "Email sending successfully."},
            {status: 200},
        );
    } catch {
        return NextResponse.json(
            {message: "Failed to send email"},
            {status: 500},
        );
    }
}
