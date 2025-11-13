import { error } from "console"
import { z } from "zod"

export type ProductType = z.infer<typeof productSchema>

export const productSchema = z.object({
  photo: z
    .string({ error: "사진등록은 필수입니다." })
    .refine((val) => val !== "/undefined", {
      message: "사진등록은 필수입니다.",
    }),
  title: z.string().trim().min(1, { error: "제목은 필수입니다." }),
  description: z.string().trim().min(1, { error: "설명은 필수입니다." }),
  price: z.coerce.number<number>().int().positive(),
})

export const fileSchema = z.object({
  type: z
    .string()
    .refine((type) => z.instanceof(File) && type.match("image/*"), {
      message: "이미지 파일만 업로드 가능합니다.",
    }),
  size: z.number().max(1024 * 1024 * 4, {
    message: "4MB 이하의 파일만 업로드 할 수 있습니다.",
  }),
})
