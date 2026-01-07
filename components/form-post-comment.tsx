"use client"

//useOptimistic 과 startTransition 사용시 useFormState로 zode의 error 리턴을 어떻게 받는 데 useClient에서 비동기 값을 사용할 수 없다고 한다 어떻게 해결하나
// 1. startTransition의 반환 값이 기본적으로 없음
// 2. startTransition이 client 컴포넌트에서 server action을 사용케한다인데
//    client에서 async/await을 사용할 수 없다는 에러
// 3. form과 list를 기본적으로 분리하고 싶은데 useOptimistic훅을 사용하려면
//    갱신되는 내용을 form에서 받아 뿌려줘야하니 훅의 변경내용을 적용시키려면
//    form과 list를 붙이는 방법 외에는 없는지..

import Input from "@/components/input"
import Button from "@/components/button"
import { savePostComment } from "@/app/posts/actions"
import { useFormState } from "react-dom"
import {
  startTransition,
  useActionState,
  useEffect,
  useOptimistic,
  useRef,
} from "react"
import { InitialPostComments } from "@/lib/db"
import PostCommentListItem from "./post-comment-list-item"

interface IFormPostComment {
  postId: number
  initialComments: InitialPostComments
  ownerId: number
}

export default function FormPostComment({
  postId,
  initialComments,
  ownerId,
}: IFormPostComment) {
  console.log("initialComments : ", initialComments)
  // use hook it can get permission to access async/await server action
  /*   async function handleAddComment(_: any, formData: FormData) {
    formData.append("postId", postId + "")

    startTransition(async () => {
      addOptimisticComment({
        payload: formData.get("payload"),
        postId,
        updated_at: Date.now(),
        user: {
          username: "🥕",
        },
      })
      console.log("optimistic : ", optimisticComments)
      await savePostComment(formData)
    })
  } */

  const formRef = useRef<HTMLFormElement>(null)

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    initialComments,
    (prevComments, newComment: any) => [
      { ...newComment, optimistic: true },
      //{ ...newComment },
      ...(prevComments || []),
    ]
  )
  //const [state, dispatch] = useFormState(handleAddComment, null)
  const [state, dispatch] = useFormState(async (_: any, formData: FormData) => {
    formData.append("postId", postId + "")
    addOptimisticComment({
      payload: formData.get("payload"),
      postId,
      updated_at: "25.01.11", //Date.now(),
      user: {
        username: "🥕",
      },
    })
    return await savePostComment(_, formData, postId)
  }, null)
  /*  const [state, dispatch] = useFormState(
    (_: any, formData: FormData) => savePostComment(_, formData, postId),
    null
  ) */

  useEffect(() => {
    formRef.current?.reset()
  }, [state])

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
              isOwner={comment.userId === ownerId ? true : false}
              key={comment.id}
              username={comment.user.username}
              {...comment}
            />
          ))}
      </ul>
    </>
  )
}
