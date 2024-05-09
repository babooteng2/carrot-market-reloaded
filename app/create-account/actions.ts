"use server"
import { z } from "zod"

const userNameSchema = z.string().min(5).max(10)

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    userName: formData.get("userName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  }
  userNameSchema.parse(data.userName)
  console.log(data)
}
