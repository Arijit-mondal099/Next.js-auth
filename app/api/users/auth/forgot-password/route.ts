import { sendEmail } from "@/helpers/mailer.helper";
import { dbConnection } from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json() as { email: string }

        if (!email?.trim()) {
            return NextResponse.json(
                { success: false, message: "Please provide email!" },
                { status: 400 }
            )
        }

        await dbConnection()

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Oops invalid creadintial!" },
                { status: 404 }
            )
        }

        if (user && !user.isVerified) {
            return NextResponse.json(
                { success: false, message: "Oops your email not verified yet!" },
                { status: 400 }
            )
        }

        const result = await sendEmail({ email, emailType: "FORGOT_PASSWORD", userId: user._id })

        if (!result?.messageId) {
            return NextResponse.json(
                { success: false, message: "Oops faild to forgot password please try again!" },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { success: true, message: "Email sended successfully" },
            { status: 200 }
        )
    } catch (error: unknown) {
        return NextResponse.json(
            { 
                success: false, 
                message: error instanceof Error ? error.message : "Internal server error form signup user" 
            },
            { status: 500 }
        )
    }
}
