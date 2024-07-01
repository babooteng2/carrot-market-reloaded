import { NextRequest } from "next/server"
import {
  GITHUB_ACCESS_TOKEN_URL,
  GITHUB_AUTH_EMAIL_URL,
  GITHUB_AUTH_USER_URL,
} from "./constants"

interface IGithubUserEmail {
  email: String
  primary: Boolean
  verified: Boolean
  visibility: String
}

export const getAccessToken = async (req: NextRequest) => {
  const code = req.nextUrl.searchParams.get("code")
  if (!code) {
    return new Response(null, { status: 400 })
  }
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString()
  const accessTokenURL = `${GITHUB_ACCESS_TOKEN_URL}?${accessTokenParams}`
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: { Accept: "application/json" },
  })
  const { error, access_token } = await accessTokenResponse.json()
  if (error) {
    return new Response(null, { status: 400 })
  }
  return access_token
}

export const getUserProfile = async (
  req: NextRequest,
  access_token: string
) => {
  const userProfile = await fetch(GITHUB_AUTH_USER_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
    cache: "no-cache",
  })
  return await userProfile.json()
}

export const getUserEmail = async (req: NextRequest, access_token: string) => {
  const userEmails = await fetch(GITHUB_AUTH_EMAIL_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
    cache: "no-cache",
  })
  const githubUserEmails: IGithubUserEmail = await userEmails.json()
  return githubUserEmails
}
