import db from "@/app/lib/db"
import getSession from "@/app/lib/session"
import { log } from "console"
import { notFound, redirect } from "next/navigation"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  if (!code) {
    return notFound()
  }
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString()
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`
  const accessTokenRespone = await fetch(accessTokenURL, {
    method: "POST",
    headers: { Accept: "application/json" },
  })
  const { error, access_token } = await accessTokenRespone.json()
  if (error) {
    return new Response(null, { status: 400 })
  }
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${access_token}` },
    cache: "no-cache",
  })
  const { id, avatar_url, login } = await userProfileResponse.json()
  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  })
  if (user) {
    const session = await getSession()
    session.id = user.id
    await session.save()
    return redirect("/profile")
  }
  // todo : username은 필수 항목인데 새사용자 생성시 같은이름이 존재할 때 처리필요
  const newUser = await db.user.create({
    data: {
      username: login,
      github_id: id + "",
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  })
  const session = await getSession()
  session.id = newUser.id
  await session.save()
  return redirect("/profile")
}
