import { GITHUB_ACCESS_BASE_URL } from "@/lib/constants"
import { redirect } from "next/navigation"

export function GET() {
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user, user:email",
    allow_signup: "true",
  }
  const formattedParams = new URLSearchParams(params).toString()
  const finalUrl = `${GITHUB_ACCESS_BASE_URL}?${formattedParams}`
  return redirect(finalUrl)
}
