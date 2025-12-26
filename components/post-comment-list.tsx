"use client"

import { InitialPostComments } from "@/lib/db"
import { notFound } from "next/navigation"
import PostCommentListItem from "@/components/post-comment-list-item"

interface ICommentListProp {
  initialPostComments: InitialPostComments
  ownerId: number
}

export default async function PostCommentList({
  initialPostComments,
  ownerId,
}: ICommentListProp) {
  if (!initialPostComments) notFound()
  return (
    <ul className="flex flex-col w-full space-y-4">
      {initialPostComments.map((comment) => (
        <PostCommentListItem
          isOwner={comment.userId === ownerId ? true : false}
          key={comment.id}
          username={comment.user.username}
          {...comment}
        />
      ))}
    </ul>
  )
}
