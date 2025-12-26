"use server"

import { getCachedPost } from "@/lib/db"
import { notFound } from "next/navigation"
import FormPostModify from "@/components/form-post-modify"

export default async function ModifyPost({
  params,
}: {
  params: { id: string }
}) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return notFound()
  }
  const post = await getCachedPost(id)
  if (post === null) return notFound()

  return (
    <FormPostModify
      postId={Number(params.id)}
      title={post.title}
      description={post.description || ""}
    />
  )
}
