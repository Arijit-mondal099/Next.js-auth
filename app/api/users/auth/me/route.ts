import { getUserId } from "@/helpers/getUserId.helper"
import { dbConnection } from "@/lib/db"
import { User } from "@/models/user.model"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const userId = await getUserId()

        await dbConnection()

        const user = await User.findById(userId).select("-password")

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Profile not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { success: true, message: "Profile fetched successfully", data: user },
            { status: 200 }
        )
    } catch (error: unknown) {
        const isUnauthorized = error instanceof Error && error.message.startsWith("Unauthorized")
        return NextResponse.json(
                    { 
                        success: false, 
                        message: error instanceof Error ? error.message : "Internal server error form verify user" 
                    },
                    { status: isUnauthorized ? 401 : 500 }
                )
    }
}