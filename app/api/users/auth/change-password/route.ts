import { dbConnection } from "@/lib/db";
import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const { password, token } = await request.json() as { token: string, password: string }

        if (!password?.trim() || !token?.trim()) {
            return NextResponse.json(
                { success: false, message: "Please provide verify token or email is missing!" },
                { status: 400 }
            )
        }

        await dbConnection()

        const user = await User.findOne({ forgotPasswordToken: token, forgotPasswordTokenExpiry: { $gt: Date.now() } })

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid verify token, try again!" },
                { status: 400 }
            )
        }
        
        const hashPassword = await bcrypt.hash(password, 10)

        user.password = hashPassword
        user.forgotPasswordToken = undefined
        user.forgotPasswordTokenExpiry = undefined

        await user.save()

        return NextResponse.json(
            { success: true, message: "Password changed successfully" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { 
                success: false, 
                message: error instanceof Error ? error.message : "Internal server error form signup user" 
            },
            { status: 500 }
        )        
    }
}