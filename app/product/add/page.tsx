"use client"

import Button from "@/components/button"
import Input from "@/components/input"
import { PhotoIcon } from "@heroicons/react/24/solid"
import { useState } from "react"
import { getUploadUrl, uploadProduct } from "./actions"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { fileSchema, productSchema, ProductType } from "./schema"

export default function AddProduct() {
  const [preview, setPreview] = useState("")
  const [typeError, setTypeError] = useState<String | undefined>()
  const [sizeError, setSizeError] = useState<String | undefined>()
  const [uploadUrl, setUploadUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  })

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event

    if (files?.length == 0) {
      setPreview("")
      setFile(null)
      setValue("photo", "")
    }
    if (!files) {
      return
    }
    const file = files[0]
    const validationResult = fileSchema.safeParse(file)

    if (validationResult.error) {
      // const error = z.flattenError(validationResult.error)
      const error = validationResult.error.flatten()
      if (error.fieldErrors.type) {
        setTypeError("이미지 파일만 업로드 가능합니다.")
        return
      } else if (error.fieldErrors.size) {
        setSizeError("4MB 이하의 파일만 업로드 할 수 있습니다.")
        return
      } else {
        setSizeError(undefined)
        setTypeError(undefined)
        return
      }
    }

    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      setFile(file)
      const { success, result } = await getUploadUrl()
      if (success) {
        const { id, uploadURL } = result
        setUploadUrl(uploadURL)
        setValue(
          "photo",
          `https://imagedelivery.net/fe4Q0psONJV8oImEl9R2AQ/${id}`
        )
      }
    }
  }

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
    //return uploadProduct(formData)
    const errors = await uploadProduct(formData)
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
          }}>
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
          onChange={onImageChange}
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
