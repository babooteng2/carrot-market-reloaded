import { error } from "console"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import getSession from "./app/lib/session"
import { URL } from "url"

export async function middleware(request: NextRequest) {
  // edge runtime
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
