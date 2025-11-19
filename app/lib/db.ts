import { PrismaClient } from "@prisma/client"
import { unstable_cache as nextCache, revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

const db = new PrismaClient()
export default db

export const getUserByID = async (id: number) => {
  const user = await db.user.findUnique({
    where: {
      github_id: String(id),
    },
    select: {
      id: true,
    },
  })
  return user
}

export const isUniqueUsername = async (username: string) => {
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

export const createNewUserByGithub = async (
  newGitHubUsername: string,
  id: number,
  avatar_url: string,
  email: string
) => {
  const newUser = await db.user.create({
    data: {
      username: newGitHubUsername,
      github_id: String(id),
      avatar: avatar_url,
      email,
    },
    select: {
      id: true,
    },
  })
  return newUser
}

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    /* take: 1, */
    orderBy: {
      created_at: "desc",
    },
  })
  return products
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>

export async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  })
  return product
}

async function getProductTitle(id: number) {
  console.log("title")
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  })
  return product
}

export const getCachedProducts = nextCache(
  getInitialProducts,
  ["home-products"],
  {
    revalidate: 60,
  }
)

export const getCachedProductDetal = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
})

export const getCachedProductTitle = nextCache(
  getProductTitle,
  ["product-title"],
  {
    tags: ["product-title"],
  }
)
