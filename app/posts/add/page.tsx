"use client"

import Button from "@/components/button"
import Input from "@/components/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { postSchema, PostType } from "@/app/posts/schema"
import { validData } from "@/app/posts/actions"

export default function AddPost() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostType>({ resolver: zodResolver(postSchema) })
  const onSubmit = handleSubmit((data) => {
    validData(data)
  })
  const onValid = async () => await onSubmit()

  return (
    <div>
      <h1>동네생활</h1>
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
