"use client"

import Button from "@/components/button"
import Input from "@/components/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { postSchema, PostType } from "@/app/posts/schema"
import { handleRedirect, validData } from "@/app/posts/actions"

export default function FormPostModify({
  postId,
  title,
  description,
}: {
  postId: number
  title: string
  description: string
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostType>({
    defaultValues: { title, description },
    resolver: zodResolver(postSchema),
  })
  const onSubmit = handleSubmit((data) => {
    validData(data, postId)
  })
  const onValid = async () => await onSubmit()
  const handleOnClick = () => {
    handleRedirect("/life")
  }

  return (
    <div>
      <div className="flex justify-between items-center mt-5 pl-5 pr-5">
        <h1>동네생활 | 게시물 수정</h1>
        <Button text="목록" onClick={handleOnClick} className={"w-12"} />
      </div>
      <form action={onValid} className="p-5 flex flex-col gap-5">
        <Input
          required
          placeholder="제목"
          type="text"
          {...register("title")}
          errors={[errors.title?.message ?? ""]}
        />
        <Input
          required
          placeholder="자세한 설명"
          type="text"
          {...register("description")}
          errors={[errors.description?.message ?? ""]}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  )
}
