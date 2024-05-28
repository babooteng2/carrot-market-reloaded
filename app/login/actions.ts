"use server"

import { z } from "zod"
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REG_ERROR,
} from "../lib/constants"
import db from "../lib/db"
import bcrypt from "bcrypt"
import getSession from "../create-account/session"
import { redirect } from "next/navigation"

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  })
  return Boolean(user)
}

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "An account with this email doesn't exist"),
  password: z.string({
    required_error: "Please enter password",
  }),
  // temporary code block for test
  //.min(PASSWORD_MIN_LENGTH)
  //.regex(PASSWORD_REGEX, PASSWORD_REG_ERROR),
})

export async function login(prevState: any, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 5000))
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  }
  const result = await formSchema.safeParseAsync(data)
  if (!result.success) {
    return result.error.flatten()
  } else {
    // find a user with the email
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    })
    // if the user is found, check password hash
    // if password is null, return false ( compare with invalidated hash code "xxx" )
    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? "xxx"
    )
    // log the user in ( get session )
    if (ok) {
      const session = await getSession()
      session.id = user!.id
      session.save()
      redirect("/profile")
    } else {
      return {
        fieldErrors: {
          password: ["Wrong password"],
          email: [],
        },
      }
    }
    // redirect "/profile"
  }
}
