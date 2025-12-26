"use client"

import { formatToCommentTime } from "@/lib/utils"
import { modifyPostComment, removePostComment } from "@/app/posts/actions"
import Input from "@/components/input"
import ModifyBox from "@/components/modify-box"

interface IPostCommentListItemProps {
  isOwner: boolean
  id: number
  updated_at: Date
  username: string
  payload: string
  postId: number
  userId: number
}

export default function PostCommentListItem({
  isOwner,
  id,
  updated_at,
  username,
  payload,
  postId,
}: IPostCommentListItemProps) {
  const updateDate = formatToCommentTime(updated_at)

  return (
    <li key={id} className="flex flex-col w-full space-x-4">
      <div className="flex flex-col w-full">
        <div className="flex">
          <span>{username}</span>
        </div>
        <div className="flex justify-between items-center">
          <Input
            name="commentItemInput"
            value={payload}
            readOnly
            className="border-none focus:outline-none bg-transparent"
          />
          {updateDate}
          {/* TODO - postCommentLike
           <div className="flex space-x-1">
            <HandThumbUpIcon className="size-5" />
            <span>5</span>
          </div> */}
          {isOwner ? (
            <ModifyBox
              postId={postId}
              commentId={id}
              modifyFunc={modifyPostComment}
              removeFunc={removePostComment}
            />
          ) : null}
        </div>
      </div>
    </li>
  )
}
