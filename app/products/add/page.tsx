"use client"

import Button from "@/components/button"
import Input from "@/components/input"
import { PhotoIcon } from "@heroicons/react/24/solid"
import { useState } from "react"
import { uploadProduct } from "./actions"
import { z } from "zod"

/* 
 1. 유저가 이미지를 업로드 했는지 확인
    - file.type 의 단어 유형에 image로 시작하면 통과
 2. 이미지가 대략 3~4MB 이하 인지 학인
    - file.size
*/

const fileSchema = z.object({
  type: z.string().refine((type) => type.match("image/*"), {
    message: "이미지 파일만 업로드 가능합니다.",
  }),
  size: z.number().max(1024 * 1024 * 4, {
    message: "4MB 이하의 파일만 업로드 할 수 있습니다.",
  }),
})

export default function AddProduct() {
  const [preview, setPreview] = useState("")
  const [typeError, setTypeError] = useState<String | undefined>()
  const [sizeError, setSizeError] = useState<String | undefined>()

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
      <form action={uploadProduct} className="p-5 flex flex-col gap-5">
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
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
              </div>
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
        <Input name="title" required placeholder="제목" type="text" />
        <Input name="price" required placeholder="가격" type="number" />
        <Input
          name="description"
          required
          placeholder="자세한 설명"
          type="text"
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
