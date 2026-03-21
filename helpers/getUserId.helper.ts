import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function getUserId() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token?.trim()) {
        throw new Error("Unauthorized: token not provided!")
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
        
        if (!decoded || !decoded.userId) {
            throw new Error("Unauthorized: invalid token!")
        }

        return decoded.userId
    } catch (error: unknown) {
        console.log(error instanceof Error && error.message)
        throw new Error("Unauthorized: invalid token!")
    }
}
