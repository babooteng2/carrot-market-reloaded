import { getProduct } from "@/lib/db"
import { getIsOwner } from "@/lib/session"
import { formatToWon } from "@/lib/utils"
import CloseButton from "@/components/close-button"
import { UserIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function Modal({ params }: { params: { id: string } }) {
  const id = await Number(params.id)
  const product = await getProduct(id)
  if (isNaN(id) || !product) {
    return notFound()
  }
  const isOwner = await getIsOwner(Number(product.userId))

  return (
    <div className="absolute w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-60 left-0 top-0">
      <CloseButton />
      <div className="max-w-screen-sm h-1/2 flex justify-center w-full">
        <div className="aspect-square bg-neutral-700 text-neutral-200 rounded-md flex justify-center items-center">
          <img src={`${product.photo}/public`} alt={product.title} />
        </div>
      </div>
      <div className="relative aspect-square">
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
            <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
              Delete product
            </button>
          ) : (
            <Link
              className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
              href={""}
            >
              채팅하기
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
