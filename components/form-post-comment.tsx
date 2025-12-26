"use client"

import Input from "@/components/input"
import Button from "@/components/button"
import { savePostComment } from "@/app/posts/actions"
import { useFormState } from "react-dom"
import { useEffect, useRef } from "react"

interface IFormPostComment {
  postId: number
}

export default function FormPostComment({ postId }: IFormPostComment) {
  const savePostCommentWithArgs = savePostComment.bind(null, postId)
  const [state, dispatch] = useFormState(savePostCommentWithArgs, null)
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    formRef.current?.reset()
  }, [state])

  return (
    <form ref={formRef} action={dispatch} className="w-full space-y-4">
      <Input
        type="text"
        name="payload"
        placeholder="댓글을 남겨보세요"
        errors={state?.error?.fieldErrors.payload}
      />
      <Button text="댓글 남기기" />
    </form>
  )
}
