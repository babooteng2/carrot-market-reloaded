"use server"
import { z } from "zod"

const fromSchema = z.object({
  userName: z.string().min(5).max(10),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
})

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    userName: formData.get("userName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  }
  const result = fromSchema.safeParse(data)
  if (!result.success) {
    // console.log("validation failed : ", result.error.flatten())
    return result.error.flatten()
  }
}
