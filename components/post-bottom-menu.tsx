"use client"

import Button from "@/components/button"
import { handleRedirect } from "@/app/posts/actions"
import PostViewCount from "@/components/post-view-count"
import PostCommentCount from "@/components/post-comment-count"

export default function PostBottomMenu({
  postViews,
  postCountComments,
}: {
  postViews: number
  postCountComments: number
}) {
  const handleOnClick = () => {
    handleRedirect("/life")
  }

  return (
    <div className="flex w-full justify-end items-center gap-2 text-neutral-400 text-sm space-x-2">
      <PostCommentCount viewCount={postCountComments} />
      <span>|</span>
      <PostViewCount viewCount={postViews} />
      <span>|</span>
      <Button text="목록" onClick={handleOnClick} className={"w-12"} />
    </div>
  )
}
