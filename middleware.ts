import { error } from "console"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import getSession from "./app/lib/session"
import { URL } from "url"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  console.log("hello")
  if (pathname === "/") {
    const response = NextResponse.next()
    response.cookies.set("middleware-cookie", "hello")
    return response
  }
  if (pathname === "/profile") {
    return NextResponse.redirect(new URL("/", request.url))
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
