"use server"

import db from "@/app/lib/db"
import getSession from "@/app/lib/session"
import fs from "fs/promises"
import { redirect } from "next/navigation"
import { productSchema } from "./schema"
import z from "zod"

export async function uploadProduct(formData: FormData) {
  const data = {
    title: formData.get("title"),
    price: formData.get("price"),
    photo: formData.get("photo"),
    description: formData.get("description"),
  }

  if (data.photo instanceof File) {
    /*  const photoData = await data.photo.arrayBuffer()
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData))
    data.photo = `/${data.photo.name}` */
  }

  const result = productSchema.safeParse(data)

  if (!result.success) {
    return z.treeifyError(result.error)
    //return result.error.flatten()
  } else {
    const session = await getSession()
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          price: result.data.price,
          description: result.data.description,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      })
      redirect(`/products/${product.id}`)
    }
  }
}

export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_IMAGES_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_API_KEY}`,
      },
    }
  )
  const data = response.json()
  return data
}
