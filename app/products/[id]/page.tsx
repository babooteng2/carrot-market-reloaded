import { getCachedProductDetal, getCachedProductTitle } from "@/app/lib/db"
import { getIsOwner } from "@/app/lib/session"
import { formatToWon } from "@/app/lib/utils"
import { UserIcon } from "@heroicons/react/24/solid"
import { revalidateTag } from "next/cache"
import Image from "next/image"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(Number(params.id))
  return {
    title: `Product ${product?.title}`,
  }
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string }
}) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return notFound()
  }
  //const product = await getProduct(id)
  const product = await getCachedProductDetal(id)
  if (!product) {
    return notFound()
  }
  const isOwner = await getIsOwner(product.userId)
  const revalidate = async () => {
    "use server"
    revalidateTag("product-title")
  }
  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          priority={true}
          sizes="sizes=(max-width: 320px) 280px,
            (max-width: 480px) 440px,
            800px"
          src={`${product.photo}/public`}
          className="object-cover"
          alt={product.title}
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              alt={product.user.username}
              width={40}
              height={40}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-lg">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <form action={revalidate}>
            <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
              Revalidate title cache
            </button>
          </form>
        ) : null}
        {/* {isOwner ? (
          <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
            Delete product
          </button>
        ) : null}
        <Link
          className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
          href={""}
        >
          채팅하기
        </Link> */}
      </div>
    </div>
  )
}
