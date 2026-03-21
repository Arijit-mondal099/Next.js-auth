import { dbConnection } from "@/lib/db"
import { User } from "@/models/user.model"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json() as { token: string }

        if (!token?.trim()) {
            return NextResponse.json(
                { success: false, message: "Faild to verify token not provided, please try again!" },
                { status: 401 }
            )
        }

        await dbConnection()

        const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } })

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Faild to verify token expire, please try again!" },
                { status: 401 }
            )
        }

        if (user && user.isVerified) {
            return NextResponse.json(
                { success: false, message: "Account alredy verified!" },
                { status: 400 }
            )
        }

        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined
        await user.save()

        return NextResponse.json(
            { success: true, message: "Email verified!" }, 
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { 
                success: false, 
                message: error instanceof Error ? error.message : "Internal server error form verify user" 
            },
            { status: 500 }
        )
    }
}
