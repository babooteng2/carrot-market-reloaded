import { getCachedProducts } from "@/lib/db"
import ProductList from "@/components/product-list"
import { PlusIcon } from "@heroicons/react/24/solid"
import Link from "next/link"

export const metadata = { title: "Home" }

export const dynamic = "force-dynamic"

export default async function Products() {
  const initialProducts = await getCachedProducts()
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/products/add"
        className="bg-orange-500 flex items-center justify-center 
          rounded-full size-16 fixed bottom-24 right-8 text-white 
          transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  )
}
