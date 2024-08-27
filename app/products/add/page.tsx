"use client"

import Button from "@/components/button"
import Input from "@/components/input"
import { PhotoIcon } from "@heroicons/react/24/solid"
import { useState } from "react"
import { uploadProduct } from "./actions"
import { z } from "zod"
import { useFormState } from "react-dom"

const fileSchema = z.object({
  type: z
    .string()
    .refine((type) => z.instanceof(File) && type.match("image/*"), {
      message: "이미지 파일만 업로드 가능합니다.",
    }),
  /*  type: z.string().refine((type) => type.match("image/*"), {
    message: "이미지 파일만 업로드 가능합니다.",
  }), */
  size: z.number().max(1024 * 1024 * 4, {
    message: "4MB 이하의 파일만 업로드 할 수 있습니다.",
  }),
})

export default function AddProduct() {
  const [preview, setPreview] = useState("")
  const [typeError, setTypeError] = useState<String | undefined>()
  const [sizeError, setSizeError] = useState<String | undefined>()
  const [state, action] = useFormState(uploadProduct, null)

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event
    if (!files) {
      return
    }
    const file = files[0]
    const result = fileSchema.safeParse(file)

    if (result.error?.flatten().fieldErrors.type) {
      setTypeError("이미지 파일만 업로드 가능합니다.")
      return
    } else if (result.error?.flatten().fieldErrors.size) {
      setTypeError("4MB 이하의 파일만 업로드 할 수 있습니다.")
      return
    } else {
      setSizeError(undefined)
      setTypeError(undefined)
    }

    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
    }
  }
  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
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
              {state?.fieldErrors.photo ? (
                <div className="text-red-600">{state.fieldErrors.photo}</div>
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
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <Input
          name="title"
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          required
          placeholder="가격"
          type="number"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          required
          placeholder="자세한 설명"
          type="text"
          errors={state?.fieldErrors.description}
        />
        {sizeError ? (
          <p className="w-full text-center">{sizeError}</p>
        ) : typeError ? (
          <p className="w-full text-center">{typeError}</p>
        ) : (
          <Button text="작성 완료" />
        )}
      </form>
    </div>
  )
}
