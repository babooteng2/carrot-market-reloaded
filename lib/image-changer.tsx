import { getUploadUrl } from "@/app/product/add/actions"
import { fileSchema } from "@/app/product/add/schema"
import z from "zod"

export const onImageChange = async (
  event: React.ChangeEvent<HTMLInputElement>,
  setPreview: (url: string) => void,
  setFile: (file: File | null) => void,
  setUploadUrl: (url: string) => void,
  setValue: (
    name: "photo" | "title" | "price" | "description",
    value: string
  ) => void,
  setTypeError: (type: string | null) => void,
  setSizeError: (size: string | null) => void
) => {
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
  validationResult.success
  if (validationResult.error) {
    const error = z.flattenError(validationResult.error)
    if (error.fieldErrors.type) {
      setTypeError("이미지 파일만 업로드 가능합니다.")
      return
    } else if (error.fieldErrors.size) {
      setSizeError("4MB 이하의 파일만 업로드 할 수 있습니다.")
      return
    } else {
      setSizeError(null)
      setTypeError(null)
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
