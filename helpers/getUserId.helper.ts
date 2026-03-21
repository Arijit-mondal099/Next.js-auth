import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"


export async function getUserId() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token?.trim()) {
        return NextResponse.json(
            { success: false, message: "Unauthorized Error: token not provided!" },
            { status: 401 }
        )
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
        
        if (!decoded || !decoded.userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized Error: token not provided!" },
                { status: 401 }
            )
        }

        return decoded.userId
    } catch (error: unknown) {
        console.error("error form get userId helper!", error)
        throw new Error("Unauthorized Error: Invalid token or not provided!")
    }
}
