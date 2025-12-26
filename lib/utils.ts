import { NextRequest } from "next/server"
import {
  GITHUB_ACCESS_TOKEN_URL,
  GITHUB_AUTH_EMAIL_URL,
  GITHUB_AUTH_USER_URL,
} from "./constants"
import { locales } from "validator/lib/isIBAN"

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

export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24
  const time = new Date(date).getTime()
  const now = new Date().getTime()
  const diff = Math.round((time - now) / dayInMs)
  const formatter = new Intl.RelativeTimeFormat("ko")

  return formatter.format(diff, "days")
}

export function formatToWon(price: number): string {
  return price.toLocaleString("ko-KR")
}

export function formatToCommentTime(time: Date): string {
  const date = typeof time === "string" ? new Date(time) : time

  const pad = (n: number) => (n < 10 ? "0" + n : n.toString())

  const year = date.getFullYear().toString().slice(-2)
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())

  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`
}
