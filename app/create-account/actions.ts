"use server"
import { z } from "zod"

const checkUsername = (userName: string) => !userName.includes("potato")
const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string
  confirmPassword: string
}) => password === confirmPassword

const fromSchema = z
  .object({
    userName: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Username is required",
      })
      .min(5, "Way too short!!!")
      .max(10)
      .refine((userName) => checkUsername, "No potatoes allowed"),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine(checkPasswords, {
    path: ["confirmPassword"],
    message: "Both passwords should be the same",
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
    console.log("validation failed : ", result.error.flatten())
    return result.error.flatten()
  }
}
