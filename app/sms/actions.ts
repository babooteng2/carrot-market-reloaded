"use server"
import { z } from "zod"
import validator from "validator"
import { redirect } from "next/navigation"

interface IPrevState {
  token: boolean
}

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format"
  )

const tokenSchema = z.coerce.number().min(100000).max(999999)

export async function smsLogIn(prevState: IPrevState, formData: FormData) {
  console.log(typeof formData.get("token"))
  //console.log(typeof tokenSchema.parse(formData.get("token")))
  const phone = formData.get("phone")
  const token = formData.get("token")
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone)
    if (!result.success) {
      console.log(result.error.flatten())
      return {
        token: false,
        error: result.error.flatten(),
      }
    } else {
      return {
        token: true,
      }
    }
  } else {
    const result = tokenSchema.safeParse(token)
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      }
    } else {
      redirect("/")
    }
  }
}
