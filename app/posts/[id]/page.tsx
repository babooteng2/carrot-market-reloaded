/* 
  14.Code Challenge

- add Comment function
  - [o] comment Form
  - [o] comment List
  - [o] show the comment page with optimistic update immediately
- additional
  - [x] cached post title ->  to be general use, combine prodct function -> combine function failed
  - [x] prevent increase view count when clicking likeBtn
  - [o] post CRUD
  - [x] comment Editing
  - [x] comment paging
*/

"use server"

import Image from "next/image"
import { notFound } from "next/navigation"
import { formatToTimeAgo } from "@/lib/utils"
import LikeButton from "@/components/like-button"
import FormComment from "@/components/form-post-comment"
import PostEditBox from "@/components/post-edit-box"
import PostBottomMenu from "@/components/post-bottom-menu"
import {
  getCachedInitialPostComments,
  getCachedLikeStatus,
  getCachedPost,
  getCachedTitle,
  getProfile,
} from "@/lib/db"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const result = await getCachedTitle("Post", Number(params.id))
  return {
    title: `Post | ${result.title}`,
  }
}

export default async function PostDetail({
  params,
}: {
  params: { id: string }
}) {
  const postId = Number(params.id)
  if (isNaN(postId)) return notFound()
  const post = await getCachedPost(postId)
  if (!post) return notFound()
  const comments = await getCachedInitialPostComments(postId)
  const logInUserProfile = (await getProfile())!
  if (!logInUserProfile) return notFound()
  const { isLiked, likeCount } = await getCachedLikeStatus(
    postId,
    logInUserProfile.id
  )

  return (
    <div className="p-5 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 mb-4">
          {post.user.avatar ? (
            <Image
              width={28}
              height={28}
              className="size-7 rounded-full"
              src={post.user.avatar}
              alt={post.user.username}
            />
          ) : null}
          <div>
            <span className="text-sm font-semibold">{post.user.username}</span>
            <div className="text-xs">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
            </div>
          </div>
        </div>
        <PostEditBox
          logInUserProfile={logInUserProfile}
          postId={postId}
          postUserId={post.userId}
        />
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex w-full justify-between">
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={postId} />
          <PostBottomMenu
            postViews={post.views}
            postCountComments={post._count.comments}
          />
        </div>
        <div className="w-full h-px bg-neutral-500 mt-4" />
        <FormComment
          postId={postId}
          initialComments={comments}
          logInUserProfile={logInUserProfile}
        />
      </div>
    </div>
  )
}
