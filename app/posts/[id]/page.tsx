import db from "@/lib/db"
import getSession from "@/lib/session"
import { formatToTimeAgo } from "@/lib/utils"
import { EyeIcon, HandThumbUpIcon } from "@heroicons/react/24/solid"
import { HandThumbUpIcon as OutLineHandThumbUpIcon } from "@heroicons/react/24/outline"
import { unstable_cache as nextCache, revalidateTag } from "next/cache"
import Image from "next/image"
import { notFound } from "next/navigation"

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
    return post
  } catch (e) {
    console.log("post error : ", e)
    return null
  }
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
})

async function getIsLikeStatus(postId: number) {
  const session = await getSession()
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id!,
      },
    },
  })
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  })
  return {
    isLiked,
    likeCount,
  }
}
function getCachedLikeStatus(postId: number) {
  const cachedOperation = nextCache(getIsLikeStatus, ["product-like-statusd"], {
    tags: [`like-status-${postId}`],
  })
  return cachedOperation(postId)
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

  const likePost = async () => {
    "use server"
    await new Promise((r) => setTimeout(r, 5000))
    try {
      const session = await getSession()
      await db.like.create({
        data: {
          postId,
          userId: session.id!,
        },
      })
    } catch (e) {}
    revalidateTag(`like-status-${postId}`)
  }

  const dislikePost = async () => {
    "use server"
    try {
      const session = await getSession()
      await db.like.delete({
        where: {
          id: {
            postId,
            userId: session.id!,
          },
        },
      })
      revalidateTag(`like-status-${postId}`)
    } catch (e) {}
  }

  const { isLiked, likeCount } = await getCachedLikeStatus(postId)
  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
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
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <form action={isLiked ? dislikePost : likePost}>
          <button
            className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 hover:bg-neutral-800 transition-colors
              ${isLiked ? "bg-orange-500 text-white border-orange-500 pr-3" : "hover:bg-neutral-800"}`}
          >
            {isLiked ? (
              <>
                <HandThumbUpIcon className="size-5" />
                <span>{likeCount}</span>
              </>
            ) : (
              <>
                <OutLineHandThumbUpIcon className="size-5" />
                <span>공감하기 ( {likeCount} )</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
