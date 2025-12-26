"use client"

import { HandThumbUpIcon } from "@heroicons/react/24/solid"
import { HandThumbUpIcon as OutLineHandThumbUpIcon } from "@heroicons/react/24/outline"
import { startTransition, useOptimistic } from "react"
import { handleLikeBtnClick } from "@/app/posts/actions"

interface LikeButtonProps {
  isLiked: boolean
  likeCount: number
  postId: number
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount }, // initialState
    (prevState, payload) =>
      // (currentState, actionValue) => return {...currentState, ...actionValue}newOptimisticState
      ({
        isLiked: !prevState.isLiked,
        likeCount: prevState.isLiked
          ? prevState.likeCount - 1
          : prevState.likeCount + 1,
      })
  )

  return (
    <button
      onClick={() => {
        //immediatley UI Update by activate reducer, before do serverAction
        startTransition(async () => {
          reducerFn(undefined)
          handleLikeBtnClick(postId, isLiked)
        })
      }}
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 hover:bg-neutral-800 transition-colors
              ${state.isLiked ? "bg-orange-500 text-white border-orange-500 pr-3" : "hover:bg-neutral-800"}`}
    >
      {state.isLiked ? (
        <>
          <HandThumbUpIcon className="size-5" />
          <span>{state.likeCount}</span>
        </>
      ) : (
        <>
          <OutLineHandThumbUpIcon className="size-5" />
          <span className="w-24">공감하기 ( {state.likeCount} )</span>
        </>
      )}
    </button>
  )
}
