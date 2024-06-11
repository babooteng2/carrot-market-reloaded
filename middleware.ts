import { NextRequest, NextResponse } from "next/server"
import getSession from "./app/lib/session"

interface Routes {
  [key: string]: boolean
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
}

export async function middleware(request: NextRequest) {
  const session = await getSession()
  const exists = publicOnlyUrls[request.nextUrl.pathname]
  //status of user not logged in
  if (!session.id) {
    //status of user going to unexceptional site
    if (!exists) {
      console.log("go away")
      return NextResponse.redirect(new URL("/", request.url))
    }
  } else {
    //status of user logged in and don't want to see publicOnlyUrls again
    if (exists) {
      return NextResponse.redirect(new URL("/products", request.url))
    }
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
