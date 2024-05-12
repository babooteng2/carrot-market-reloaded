"use server"
import { z } from "zod"

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[*\d])(?=.*?[!@#$%^&*-?]).+$/
)
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
      .min(5, "최소 다섯자리 이상 입력해야 합니다.")
      .max(10)
      .toLowerCase()
      .trim()
      .transform((userName) =>
        userName.includes("flameable") ? `🔥 ${userName}` : userName
      )
      .refine((userName) => checkUsername, "No potatoes allowed"),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(8)
      .regex(
        passwordRegex,
        "비밀번호는 영문 소문자, 영문 대문자, 특수문자를 각 한개 이상 포함해야 합니다."
      ),
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
    //console.log("validation failed : ", result.error.flatten())
    return result.error.flatten()
  } else {
    console.log(result.data)
  }
}
