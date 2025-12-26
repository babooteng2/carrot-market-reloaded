"use server"

import getSession, { getIsOwner } from "@/lib/session"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { startTransition } from "react"
import z from "zod"
import { postSchema, PostType } from "@/app/posts/schema"
import {
  CACHED_LIFE_COMMENTS,
  CACHED_LIFE_DETAIL,
  CACHED_LIFE_POSTS,
  CACHED_LIKE_STATUS,
} from "@/lib/constants"
import {
  createPostComment,
  deletePost,
  deletePostComment,
  dislikePost,
  likePost,
  createPost,
  updatePost,
} from "@/lib/db"

const commentFormSchema = z.object({
  payload: z
    .string({ error: "글을 작성해주세요." })
    .trim()
    .min(1, { error: "최소한의 글을 작성해주세요." })
    .max(200, "200자 이하의 댓글만 가능해요."),
})

export async function savePostComment(
  postId: number,
  _prevState: any,
  formData: FormData
) {
  const payload = formData.get("payload")
  const data = {
    payload,
  }
  /// delay!
  await new Promise((resolve) => setTimeout(resolve, 3000))
  /// end of delay!
  const result = await commentFormSchema.spa(data)
  if (!result.success) {
    return { success: false, error: z.flattenError(result.error) }
  } else {
    const user = await getSession()
    const newComment = await createPostComment(payload + "", postId, user.id!)
    revalidateTag(CACHED_LIFE_POSTS)
    revalidateTag(CACHED_LIFE_DETAIL + postId)
    revalidateTag(CACHED_LIFE_COMMENTS)
    return { success: true, result: newComment }
  }
}

export const modifyPostComment = (postId: number, commentId?: number) => {
  console.log("ModifyOnClick : ", commentId)
  //TODO. edit post comment
}
export const removePostComment = async (postId: number, commentId?: number) => {
  const result = await deletePostComment(commentId!)
  if (result) {
    revalidateTag(CACHED_LIFE_POSTS)
    revalidateTag(CACHED_LIFE_DETAIL + postId)
    revalidateTag(CACHED_LIFE_COMMENTS)
  }
}

export const handleModifyPost = (postId: number) => {
  redirect(`/posts/modify/${postId}`)
}

export const handleRemovePost = async (postId: number) => {
  const result = await deletePost(postId)
  if (result) {
    revalidateTag(CACHED_LIFE_POSTS)
    redirect("/life")
  }
}

export const handleLikeBtnClick = async (postId: number, isLiked: boolean) => {
  try {
    isLiked ? await dislikePost(postId) : await likePost(postId)
  } catch (e) {}
  revalidateTag(CACHED_LIKE_STATUS + postId)
  revalidateTag(CACHED_LIFE_POSTS)
  // TODO. Do not call getPost when sequently access likeBtn
  //       prevent increase view count by getPost
  revalidateTag(CACHED_LIFE_DETAIL + postId)
}

export const handleRedirect = (target: string) => {
  redirect(target)
}

// add and modify
export const validData = async (data: PostType, postId?: number) => {
  const validResult = await postSchema.spa(data)
  let result
  if (validResult.success) {
    if (postId) {
      // modify Post
      result = await updatePost(postId, data)
      if (result) {
        revalidateTag(CACHED_LIFE_POSTS)
        revalidateTag(CACHED_LIFE_DETAIL + postId)
        redirect(`/posts/${postId}`)
      }
    } else {
      // create Post
      result = await createPost(data)
      if (result) {
        revalidateTag(CACHED_LIFE_POSTS)
        redirect("/life")
      }
    }
  } else {
    return z.flattenError(validResult.error)
  }
}
