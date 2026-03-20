import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function POST() {
    try {
        const cookieStore = await cookies()

        cookieStore.delete("auth-token")

        return NextResponse.json(
            { success: true, message: "User logout successfully" },
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
