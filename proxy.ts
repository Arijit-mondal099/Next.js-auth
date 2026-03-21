import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function proxy(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value || ""
    const path = request.nextUrl.pathname
    const isPublicRoute = path === "/login" || path === "/signup" || path === "/verify"

    if (token?.trim() && isPublicRoute) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    if (!token?.trim() && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", request.url))
    }
}
 
export const config = {
  matcher: ["/", "/login", "/signup", "/verify"],
}
