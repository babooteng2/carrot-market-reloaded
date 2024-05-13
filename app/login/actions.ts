"use server"

import { z } from "zod"
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REG_ERROR,
} from "../lib/constants"

const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .string({
      required_error: "Please enter password",
    })
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REG_ERROR),
})

export async function login(prevState: any, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 5000))
  console.log(
    "i run in the server only baby",
    formData.get("email"),
    formData.get("password")
  )
  console.log("in server", prevState)
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const result = formSchema.safeParse(data)
  if (!result.success) {
    return result.error.flatten()
  } else {
    console.log("Validation success : ", result.data)
  }
  // return {
  //   errors: ["wrong password", "password too short"],
  // }
}
