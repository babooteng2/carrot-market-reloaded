"use server"

import db from "@/app/lib/db"
import getSession from "@/app/lib/session"
import fs from "fs/promises"
import { redirect } from "next/navigation"
import { z } from "zod"

const productSchema = z.object({
  photo: z
    .string()
    .refine((val) => val !== "/undefined", { message: "Photo is required" }),
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  price: z.coerce.number({
    required_error: "Price is required",
  }),
})

export async function uploadProduct(_: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
    price: formData.get("price"),
    photo: formData.get("photo"),
    description: formData.get("description"),
  }

  if (data.photo instanceof File) {
    const photoData = await data.photo.arrayBuffer()
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData))
    data.photo = `/${data.photo.name}`
  }

  const result = productSchema.safeParse(data)

  if (!result.success) {
    return result.error.flatten()
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
