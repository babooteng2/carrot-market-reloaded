import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

interface SessionContent {
  id?: number
}

export default function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "delicious-carrot",
    password: process.env.COOKIE_PASSWORD!,
  })
}

export const setSessionLogInID = async (id: number, redirectPage: string) => {
  const session = await getSession()
  session.id = id
  await session.save()
  return redirect(redirectPage)
}
