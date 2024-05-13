"use server"
import { z } from "zod"
import validator from "validator"

const phoneSchema = z
  .string()
  .trim()
  .refine(validator.isMobilePhone, {
    message: "핸드폰 형식을 입력해 주세요",
    path: ["phone"],
  })

const tokenSchema = z.coerce.number().min(100000).max(999999)

export async function smsLogIn(prevState: any, formData: FormData) {
  console.log(typeof formData.get("token"))
  console.log(typeof tokenSchema.parse(formData.get("token")))
}
