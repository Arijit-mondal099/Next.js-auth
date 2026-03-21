import { User } from "@/models/user.model"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"


export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json() as { email: string, password: string }

        if (!email?.trim() || !password?.trim()) {
            return NextResponse.json(
                { success: false, message: "All feilds are requried!" },
                { status: 400 }
            )
        }

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid creadintials!" },
                { status: 400 }
            )
        }

        if (!user.isVerified) {
            return NextResponse.json(
                { success: false, message: "Verify your account!" },
                { status: 400 }
            )   
        }

        const isMatched = await bcrypt.compare(password, user.password)

        if (!isMatched) {
            return NextResponse.json(
                { success: false, message: "Invalid creadintials!" },
                { status: 400 }
            )
        }

        const authToken = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET!, 
            { expiresIn: "7d" }
        )

        const cookieStore = await cookies()
        
        cookieStore.set("auth-token", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",    
        })
        
        return NextResponse.json(
            { success: true, message: "login successfully", user: user._id, token: authToken },
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
