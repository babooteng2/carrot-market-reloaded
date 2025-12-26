"use server"

import { modifyProductById } from "@/lib/db"
import getSession from "@/lib/session"
import { redirect } from "next/navigation"
import { productSchema } from "@/app/product/add/schema"
import z from "zod"
import { revalidatePath, revalidateTag } from "next/cache"
import { CACHED_HOME_PRODUCTS, CACHED_PRODUCT_DETAIL } from "@/lib/constants"

export async function editProduct(id: number, formData: FormData) {
  const data = {
    title: formData.get("title"),
    price: formData.get("price"),
    photo: formData.get("photo"),
    description: formData.get("description"),
  }
  const result = productSchema.safeParse(data)

  if (!result.success) {
    return z.flattenError(result.error)
  } else {
    const session = await getSession()
    if (session.id) {
      const product = await modifyProductById(id, result, session.id)
      //revalidatePath("/home")
      revalidateTag(CACHED_HOME_PRODUCTS)
      revalidateTag(CACHED_PRODUCT_DETAIL + id)
      redirect(`/products/${product.id}`)
    }
  }
}
