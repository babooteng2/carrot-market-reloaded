"use server"
import { z } from "zod"
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REG_ERROR,
} from "@/lib/constants"
import db from "@/lib/db"
import bcrypt from "bcrypt"
import { redirect } from "next/navigation"
import getSession from "@/lib/session"

const checkUserName = (username: string) => !username.includes("potato")

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  })
  return !Boolean(user)
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
      .refine(checkUserName, "No potatoes allowed"),

    email: z.string().email().toLowerCase(),

    password: z.string().min(PASSWORD_MIN_LENGTH),
    // for test
    //      .regex(PASSWORD_REGEX, PASSWORD_REG_ERROR),
    confirmPassword: z.string().min(8),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    })
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken",
        path: ["username"],
        fatal: true,
      })
      return z.never
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    })
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This email is already taken",
        path: ["email"],
        fatal: true,
      })
      return z.never
    }
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
  // const result = formSchema.safeParseAsync(data)
  const result = await formSchema.spa(data)
  if (!result.success) {
    console.log(result.error.flatten())
    return result.error.flatten()
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12)
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    })
    const session = await getSession()
    session.id = user.id
    await session.save()
    redirect("/profile")
  }
}
