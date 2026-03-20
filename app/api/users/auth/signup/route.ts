import { dbConnection } from "@/lib/db"
import { User } from "@/models/user.model"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sendEmail } from "@/helpers/mailer.helper"

type Body = {
    username: string,
    email: string,
    password: string
}

export async function POST(request: NextRequest) {
    try {
        const { username, email, password} = await request.json() as Body

        if (!username?.trim() || !email?.trim() || !password?.trim()) {
            return NextResponse.json(
                { success: false, message: "All feilds are requried!" },
                { status: 400 }
            )
        }

        await dbConnection()

        const isUserExist = await User.findOne({ email })

        if (isUserExist) {
            return NextResponse.json(
                { success: false, message: "Account alredy exist with creadintials!" },
                { status: 400 }
            )
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            username,
            email,
            password: hashPassword
        })

        // TODO: Send verification email
        const result = await sendEmail({ email, emailType: "VERIFY", userId: newUser._id })

        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully",
                user: newUser._id,
                email: result?.messageId
            },
            { status: 201 }
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
