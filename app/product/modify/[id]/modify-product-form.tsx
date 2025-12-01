"use client"

import Button from "@/components/button"
import Input from "@/components/input"
import { PhotoIcon } from "@heroicons/react/24/solid"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, ProductType } from "../../add/schema"
import { onImageChange } from "@/lib/image-changer"
import { editProduct } from "./actions"

export default function ModifyProductForm({
  photo,
  title,
  price,
  description,
  id,
}: any) {
  const [preview, setPreview] = useState(`${photo}/public`)
  const [typeError, setTypeError] = useState<String | null>()
  const [sizeError, setSizeError] = useState<String | null>()
  const [uploadUrl, setUploadUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      photo,
      title,
      price,
      description,
    },
  })

  const onSubmit = handleSubmit(async (data: ProductType) => {
    if (!file) {
      return
    }
    const cloudflareForm = new FormData()
    cloudflareForm.append("file", file)
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm,
    })
    if (response.status !== 200) {
      return
    }

    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("price", data.price + "")
    formData.append("description", data.description)
    formData.append("photo", data.photo)
    const errors = await editProduct(Number(id), formData)
    if (errors) {
      //setError("")
    }
  })

  const onValid = async () => await onSubmit()

  return (
    <div>
      <form action={onValid} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center
           flex-col text-neutral-300 border-neutral-300 rounded-md
           border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              {errors.photo?.message ? (
                <div className="text-red-600">{errors.photo?.message}</div>
              ) : sizeError ? (
                <div className="text-red-600">{sizeError}</div>
              ) : typeError ? (
                <div className="text-red-600">{typeError}</div>
              ) : (
                <div className="text-neutral-400 text-sm">
                  사진을 추가해주세요.
                </div>
              )}
            </>
          ) : null}
        </label>
        <input
          onChange={(event) =>
            onImageChange(
              event,
              setPreview,
              setFile,
              setUploadUrl,
              setValue,
              setTypeError,
              setSizeError
            )
          }
          type="file"
          id="photo"
          accept="image/*"
          className="hidden"
        />
        <Input
          required
          placeholder="제목"
          type="text"
          {...register("title")}
          errors={[errors.title?.message ?? ""]}
        />
        <Input
          required
          placeholder="가격"
          type="number"
          {...register("price")}
          errors={[errors.price?.message ?? ""]}
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
