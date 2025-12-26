import z from "zod"

export type PostType = z.infer<typeof postSchema>

export const postSchema = z.object({
  title: z.string().trim().min(1, { error: "제목은 필수입니다." }),
  description: z.string().trim().min(1, { error: "설명은 필수입니다." }),
})

export type postCommentType = z.infer<typeof postCommentSchema>

export const postCommentSchema = z.object({
  payload: z.string().trim().min(1, { error: "작성은 필수입니다." }),
  postId: z.coerce.number<number>().int().positive(),
  userId: z.coerce.number<number>().int().positive(),
})
