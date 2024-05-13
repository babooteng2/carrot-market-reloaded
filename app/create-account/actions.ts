"use server"
import { z } from "zod"
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REG_ERROR,
} from "../lib/constants"

const checkUsername = (userName: string) => !userName.includes("potato")
const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string
  confirmPassword: string
}) => password === confirmPassword

const formSchema = z
  .object({
    userName: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Username is required",
      })
      .toLowerCase()
      .trim()
      .transform((userName) =>
        userName.includes("flameable") ? `🔥 ${userName}` : userName
      )
      .refine((userName) => checkUsername, "No potatoes allowed"),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REG_ERROR),
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
  const result = formSchema.safeParse(data)

  if (!result.success) {
    //console.log("validation failed : ", result.error.flatten())
    return result.error.flatten()
  } else {
    console.log(result.data)
  }
}
