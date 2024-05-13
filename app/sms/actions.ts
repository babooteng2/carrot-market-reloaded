"use server"
import { z } from "zod"

const checkVerification = ({
  phone,
  verification,
}: {
  phone: string
  verification: string
}) => phone === verification

const formSchema = z
  .object({
    phone: z.string().trim(),
    verification: z.string().toLowerCase(),
  })
  .refine(checkVerification, {
    message: "인증번호가 일치하지 않습니다. 다시 시도 해 주세요.",
    path: ["verification"],
  })

export async function sms(prevState: any, formData: FormData) {
  const data = {
    phone: formData.get("phone"),
    verification: formData.get("verification"),
  }
  const result = formSchema.safeParse(data)
  if (!result.success) {
    console.log("Validation errrs : ", result.error.flatten())
    return result.error.flatten()
  } else {
    console.log("Validation success ! :", result.data)
  }
}
