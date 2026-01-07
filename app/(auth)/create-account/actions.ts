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
        error: (iss) =>
          iss.code === "invalid_type" ? `Invalid input, ${iss.expected}` : null,
        //iss.input === undefined ? "Field is required." : "Invalid input.",
      })
      .toLowerCase()
      .trim()
      .min(1, "이름은 필수 입니다.")
      .refine(checkUserName, "No potatoes allowed"),

    email: z.email().toLowerCase(),

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
        input: { username },
      })
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
        input: { email },
        //path: ["email"],
        //fatal: true,
      })
    }
  })
  /*   .superRefine(async ({username} ,ctx) => {
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
  }) */
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
    return z.flattenError(result.error)
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
