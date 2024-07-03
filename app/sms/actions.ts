"use server"
import crypto from "crypto"
import validator from "validator"
import { z } from "zod"
import db from "../lib/db"
import { setSessionLogInID } from "../lib/session"
import twilio from "twilio"

interface IPrevState {
  token: boolean
}

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format"
  )

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  })
  return Boolean(exists)
}

const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "This token does not exist.")

export async function smsLogIn(prevState: IPrevState, formData: FormData) {
  console.log(typeof formData.get("token"))
  //console.log(typeof tokenSchema.parse(formData.get("token")))
  const phone = formData.get("phone")
  const token = formData.get("token")
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone)
    if (!result.success) {
      console.log(result.error.flatten())
      return {
        token: false,
        error: result.error.flatten(),
      }
    } else {
      // delete previous token
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      })
      // create token
      const token = await getVerifyToken()
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      })
      // send the token using twillio
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      )
      client.messages.create({
        body: `Your Carrot verification code is ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.TEST_PHONE_NUMBER!,
        //to: result.data,
      })
      return {
        token: true,
      }
    }
  } else {
    const result = await tokenSchema.spa(token)
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      }
    } else {
      // get the userId of token
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      })
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      })
      // log the user in
      await setSessionLogInID(token!.userId, "/profile")
      return { token: true }
    }
  }
}
async function getVerifyToken() {
  const token = crypto.randomInt(100000, 999999).toString()
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  })
  if (exists) {
    return getVerifyToken()
  } else {
    return token
  }
}
