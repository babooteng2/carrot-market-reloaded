"use server"

import { getCachedProduct } from "@/lib/db"
import { notFound } from "next/navigation"
import ModifyProductForm from "./modify-product-form"

export default async function ModifyProduct({
  params,
}: {
  params: { id: string }
}) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return notFound()
  }
  const product = await getCachedProduct(id)
  if (product === null) return notFound()

  return <ModifyProductForm {...product} />
}
