"use client"

import Input from "@/components/input"
import Button from "@/components/button"
import { savePostComment } from "@/app/posts/actions"
import { useFormState } from "react-dom"
import { useOptimistic, useRef } from "react"
import { InitialPostComments } from "@/lib/db"
import PostCommentListItem from "./post-comment-list-item"

interface IlogInUserProfile {
  id: number
  username: string
  avatar?: string | null
}

interface IFormPostComment {
  postId: number
  initialComments: InitialPostComments
  logInUserProfile: IlogInUserProfile
}

export default function FormPostComment({
  postId,
  initialComments,
  logInUserProfile,
}: IFormPostComment) {
  console.log("initialComments : ", initialComments)
  const formRef = useRef<HTMLFormElement>(null)

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    initialComments,
    (prevComments, newComment: any) => [
      //{ ...newComment, optimistic: true },
      { ...newComment },
      //{ ...newComment },
      ...(prevComments || []),
    ]
  )

  const [state, dispatch] = useFormState(async (_: any, formData: FormData) => {
    formRef.current?.reset()
    formData.append("postId", postId + "")
    const payload = formData.get("payload")
    if (payload) {
      addOptimisticComment({
        payload,
        postId,
        updated_at: new Date(),
        user: {
          username: logInUserProfile.username,
        },
        isOwner: true,
      })
      return await savePostComment(_, formData, postId)
    } else {
      console.log("need payload")
      return {
        error: {
          fieldErrors: { payload: ["글을 작성해주세요."] },
        },
      }
    }
  }, null)

  return (
    <>
      <form ref={formRef} action={dispatch} className="w-full space-y-4">
        <Input
          type="text"
          name="payload"
          placeholder="댓글을 남겨보세요"
          errors={state?.error?.fieldErrors.payload}
        />
        <Button text="댓글 남기기" />
      </form>
      <div className="w-full h-px bg-neutral-500 mb-4" />
      <ul className="flex flex-col w-full space-y-4">
        {optimisticComments &&
          optimisticComments.map((comment) => (
            <PostCommentListItem
              isOwner={comment.userId === logInUserProfile.id ? true : false}
              key={comment.id}
              username={comment.user.username}
              {...comment}
            />
          ))}
      </ul>
    </>
  )
}
