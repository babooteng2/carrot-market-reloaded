"use server"
import { z } from "zod"
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REG_ERROR,
} from "../lib/constants"
import db from "@/app/lib/db"

const checkUserName = (username: string) => !username.includes("potato")

const checkUniqueUsername = async (username: string) => {
  console.log("work through here?", username)
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  })
  return !Boolean(user)
  // if( user ) {
  //   // show an error
  //   return false
  // } else {
  //   return true
  // }
}

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  })
  return !Boolean(user)
}

const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string
  confirmPassword: string
}) => password === confirmPassword

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Username is required",
      })
      .toLowerCase()
      .trim()
      // .transform((username) =>
      //   userName.includes("flameable") ? `🔥 ${username}` : userName
      // )
      .refine(checkUserName, "No potatoes allowed")
      .refine(checkUniqueUsername, "This username is already taken"),
    email: z
      .string()
      .email()
      .toLowerCase()
      .refine(
        checkUniqueEmail,
        "There is an account already registred with that email"
      ),
    password: z.string().min(PASSWORD_MIN_LENGTH),
    //      .regex(PASSWORD_REGEX, PASSWORD_REG_ERROR),
    confirmPassword: z.string().min(8),
  })
  .refine(checkPasswords, {
    path: ["confirmPassword"],
    message: "Both passwords should be the same",
  })

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  }
  //const result = formSchema.safeParse(data)
  const result = await formSchema.safeParseAsync(data)
  if (!result.success) {
    return result.error.flatten()
  } else {
    // done 1. check if username is taken
    // done 2. check if the email is already used
    // 3. hash password
    // 4. save the user to db
    // 5. redirect "/home"
  }
}
