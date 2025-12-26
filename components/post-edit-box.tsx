"use client"

import ModifyBox from "@/components/modify-box"
import { handleModifyPost, handleRemovePost } from "@/app/posts/actions"

export default function PostEditBox({
  ownerId,
  postId,
  postUserId,
}: {
  ownerId: number
  postId: number
  postUserId: number
}) {
  return ownerId === postUserId ? (
    <ModifyBox
      postId={postId}
      modifyFunc={handleModifyPost}
      removeFunc={handleRemovePost}
    />
  ) : null
}
