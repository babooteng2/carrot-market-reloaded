"use client"

import ModifyBox from "@/components/modify-box"
import { handleModifyPost, handleRemovePost } from "@/app/posts/actions"

interface IlogInUserProfile {
  id: number
  username: string
  avatar?: string | null
}

export default function PostEditBox({
  logInUserProfile,
  postId,
  postUserId,
}: {
  logInUserProfile: IlogInUserProfile
  postId: number
  postUserId: number
}) {
  return logInUserProfile.id === postUserId ? (
    <ModifyBox
      postId={postId}
      modifyFunc={handleModifyPost}
      removeFunc={handleRemovePost}
    />
  ) : null
}
