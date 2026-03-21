import { getUserId } from "@/helpers/getUserId.helper";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const userId = await getUserId()

        console.log({ userId })

        const user = await User.findById(userId).select("-password")

        console.log({user})

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Profile not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { success: true, message: "Profile fetched successfully", user },
            { status: 200 }
        )
    } catch (error: unknown) {
        return NextResponse.json(
                    { 
                        success: false, 
                        message: error instanceof Error ? error.message : "Internal server error form verify user" 
                    },
                    { status: 500 }
                )
    }
}