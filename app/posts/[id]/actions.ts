"use server"

import db from "@/lib/db"
import getSession from "@/lib/session"
import { revalidateTag } from "next/cache"

export const likePost = async (postId: number) => {
  await new Promise((r) => setTimeout(r, 5000))
  try {
    const session = await getSession()
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    })
  } catch (e) {}
  revalidateTag(`like-status-${postId}`)
}

export const dislikePost = async (postId: number) => {
  await new Promise((r) => setTimeout(r, 5000))
  try {
    const session = await getSession()
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    })
    revalidateTag(`like-status-${postId}`)
  } catch (e) {}
}
