import { Prisma, PrismaClient } from "@prisma/client"
import { unstable_cache as nextCache } from "next/cache"
import getSession from "./session"
import { PostType } from "@/app/posts/schema"
import { postCommentType } from "@/app/posts/schema"
import {
  CACHED_HOME_PRODUCTS,
  CACHED_LIFE_COMMENTS,
  CACHED_LIFE_DETAIL,
  CACHED_LIFE_POSTS,
  CACHED_LIKE_STATUS,
  CACHED_PRODUCT_DETAIL,
} from "./constants"

/* const db = new PrismaClient()
export default db */

declare global {
  var db: PrismaClient | undefined
}

export const db = globalThis.db || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalThis.db = db
}

export default db

/*= USER =*/

export const getGitHubUserByID = async (id: number) => {
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

export const getUserByID = async (id: number) => {
  const user = await db.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      avatar: true,
      username: true,
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

/*= PRODUCT =*/

async function getInitialProducts() {
  console.log("Products DB hit")
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
  [CACHED_HOME_PRODUCTS],
  {
    tags: [CACHED_HOME_PRODUCTS],
  }
)

export const getCachedProduct = async (id: number) => {
  const cachedOperation = nextCache(getProduct, [CACHED_PRODUCT_DETAIL], {
    tags: [CACHED_PRODUCT_DETAIL + id],
  })
  return cachedOperation(id)
}

export const getCachedProductTitle = nextCache(
  getProductTitle,
  ["product-title"],
  {
    tags: ["product-title"],
  }
)

export const deleteProductById = (id: number) => {
  const product = db.product.delete({
    where: {
      id: id,
    },
  })
  return product
}

export const modifyProductById = async (
  id: number,
  result: any,
  sessionId: number
) => {
  const product = await db.product.update({
    data: {
      title: result.data.title,
      price: result.data.price,
      description: result.data.description,
      photo: result.data.photo,
      user: {
        connect: {
          id: sessionId,
        },
      },
    },
    where: {
      id,
    },
  })
  return product
}

/* = POST = */

export async function createPost(data: PostType) {
  try {
    const session = await getSession()
    const post = db.post.create({
      data: {
        title: data.title,
        description: data.description,
        userId: session.id!,
      },
      select: {
        id: true,
      },
    })
    return post
  } catch (e) {
    console.log("= createPost Error =")
    return null
  }
}

export type TypeGetPost = Prisma.PromiseReturnType<typeof getPost>

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
    return post
  } catch (e) {
    console.error("= getPost Error = : ", e)
    return null
  }
}

export async function updatePost(postId: number, data: PostType) {
  try {
    const session = await getSession()
    const newPost = await db.post.update({
      where: {
        id: postId,
      },
      data: {
        ...data,
        user: {
          connect: {
            id: session.id,
          },
        },
      },
    })
    return newPost
  } catch (e) {
    console.error("= updatePost Error = : ", e)
    return null
  }
}

export async function deletePost(postId: number) {
  try {
    const post = await db.post.delete({
      where: {
        id: postId,
      },
      select: {
        id: true,
      },
    })
    return post
  } catch (e) {
    console.error("= deletePost Error = : ", e)
    return null
  }
}

export async function getPosts() {
  try {
    const posts = await db.post.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        views: true,
        created_at: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })
    return posts
  } catch (e) {
    console.error("= getPosts Error = : ", e)
    return null
  }
}

export const getCachedPosts = nextCache(getPosts, ["life-posts"], {
  tags: [CACHED_LIFE_POSTS],
})

export const getCachedPost = async (id: number) => {
  const cachedOperation = nextCache(getPost, [CACHED_LIFE_DETAIL], {
    tags: [CACHED_LIFE_DETAIL + id],
  })
  return cachedOperation(id)
}

/* = LIKE = */
export const likePost = async (postId: number, userId: number) => {
  console.log("= call likePost =")
  //await new Promise((r) => setTimeout(r, 5000))
  try {
    /* const session = await getSession() */
    await db.like.create({
      data: {
        postId,
        userId,
      },
    })
  } catch (e) {}
}

export const dislikePost = async (postId: number, userId: number) => {
  console.log("= call dislikePost =")
  //await new Promise((r) => setTimeout(r, 5000))
  try {
    await db.like.delete({
      where: {
        id: {
          postId,
          userId,
        },
      },
    })
  } catch (e) {}
}

async function getIsLikeStatus(postId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId,
      },
    },
  })
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  })
  return {
    isLiked: Boolean(isLiked),
    likeCount,
  }
}

export function getCachedLikeStatus(postId: number, userId: number) {
  const cachedOperation = nextCache(getIsLikeStatus, [CACHED_LIKE_STATUS], {
    tags: [CACHED_LIKE_STATUS + postId],
  })
  return cachedOperation(postId, userId)
}

/* = POST COMMENT = */

export const createPostComment = async (
  payload: string,
  postId: number,
  userId: number
) => {
  try {
    const newComment = db.comment.create({
      data: {
        payload,
        postId,
        userId,
      },
      /* select: {
        id: true,
      }, */
    })
    return newComment
  } catch (e) {
    console.error("= createPostComment Error = : ", e)
    return null
  }
}

export async function getPostComment(commentId: number) {
  try {
    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
    })
    return comment
  } catch (e) {
    console.error("= getPostComment Error = : ", e)
    return null
  }
}

export async function updatePostComment(
  commentId: number,
  data: postCommentType
) {
  try {
    const comment = await db.comment.update({
      where: {
        id: commentId,
        userId: data.userId,
        postId: data.postId,
      },
      data: {
        ...data,
      },
      select: {
        id: true,
      },
    })
    return comment
  } catch (e) {
    console.error("= deletePostComment Error = : ", e)
    return null
  }
}

export async function deletePostComment(commentId: number) {
  try {
    const comment = await db.comment.delete({
      where: {
        id: commentId,
      },
    })
    return comment
  } catch (e) {
    console.error("= deletePostComment Error = : ", e)
    return null
  }
}

export async function getInitialPostComments(postId: number) {
  try {
    const comments = await db.comment.findMany({
      where: {
        postId,
      },
      select: {
        id: true,
        userId: true,
        payload: true,
        updated_at: true,
        user: {
          select: {
            username: true,
          },
        },
        postId: true,
      },
      orderBy: {
        created_at: "desc",
      },
    })
    return comments
  } catch (e) {
    console.error("= getInitialPostComments Error = : ", e)
    return null
  }
}

export async function getCachedInitialPostComments(postId: number) {
  const cachedOperation = await nextCache(
    getInitialPostComments,
    [CACHED_LIFE_COMMENTS],
    { tags: [CACHED_LIFE_COMMENTS] }
  )
  return cachedOperation(postId)
}

export type InitialPostComments = Prisma.PromiseReturnType<
  typeof getInitialPostComments
>

/* = common = */

async function getTitle(cachedModelName: Prisma.ModelName, id: number) {
  const result = await (db as any)[cachedModelName].findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  })
  return result
}

export function getCachedTitle(cachedModelName: Prisma.ModelName, id: number) {
  const upperCasedName = cachedModelName.toUpperCase()
  const cachedOperation = nextCache(getTitle, [`${upperCasedName}-title`], {
    tags: [`${upperCasedName}-title-${id}`],
  })
  return cachedOperation(cachedModelName, id)
}

/* ========================================================== */
// 동적모델 접근방법 await (db[model] as any).findUnique
// 경고: Prisma는 동적 모델 이름을 직접 사용하는 것을 권장하지 않으며,
// 타입 안전성을 위해 모델별로 별도 함수를 작성하는 것이 좋습니다.

//  쿼리 리턴 타입 코드힌트를 위한 변수 등록
//  const result = await (db as any)[this._domain].findUnique({...})
//  여기서 db as any를 통해 반환된 값이 any가 되어 타입체크가 되지 않아 Args
//  타입 등록 필요
/* 
const postWithUserArgs = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: {
    user: {
      select: {
        username: true,
        avatar: true,
      },
    },
    _count: {
      select: {
        comments: true,
      },
    },
  },
})

type PostWithUser = Prisma.PostGetPayload<typeof postWithUserArgs>

const productfindUniqueArgs = Prisma.validator<Prisma.ProductDefaultArgs>()({})

type ProductFindUnique = Prisma.ProductGetPayload<typeof productfindUniqueArgs>

type FindUniqueArgs<N extends Prisma.ModelName> =
  Prisma.TypeMap["model"][N]["operations"]["findUnique"]["args"]

interface IDomainQuery {
  getTitle(model: Prisma.ModelName, id: number): Promise<string>
  getCachedTitle(model: Prisma.ModelName, id: number): Promise<string>
  getPost(model: Prisma.ModelName, id: number): Promise<PostWithUser | null>
  getCachedDataByModelName(model: Prisma.ModelName, id: Number): any
  //getProp(id:number): Promise<typeof this.getProp | null>
}

export class DomainQueryBuilder {
  build(sector: Prisma.ModelName): DomainQuery {
    return new DomainQuery(sector)
  }
}

//class DomainQuery implements IDomainQuery {
class DomainQuery {
  constructor(private readonly _domain: Prisma.ModelName) {}

  async getTitle(model: Prisma.ModelName, id: number): Promise<string> {
    const domain = model || this._domain
    const result = await (db as any)[domain].findUnique({
      where: {
        id,
      },
      select: {
        title: true,
      },
    })
    return result.title
  }

  async getCachedTitle(model: Prisma.ModelName, id: number): Promise<string> {
    const cachedOperation = nextCache(
      this.getTitle,
      [`${this._domain}-title`],
      {
        tags: [`${this._domain}-title-${id}`],
      }
    )
    return cachedOperation(model, id)
  }

  async getPost(
    model: Prisma.ModelName,
    id: number
  ): Promise<PostWithUser | null> {
    const domain = model || this._domain
    const post = await (db as any)[domain].update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      ...postWithUserArgs,
    })
    return post
  }

  async getCachedDataByModelName(
    model: Prisma.ModelName,
    id: number
  ): Promise<PostWithUser | null> {
    const cachedOperation = nextCache(
      this.getPost,
      [`${this._domain}-detail`],
      { tags: [`${this._domain}-detail`] }
    )
    return cachedOperation(model, id)
  }

  getProp = async <N extends Prisma.ModelName, Targs extends FindUniqueArgs<N>>(
    modelName: N,
    args: Targs
  ): Promise<ProductFindUnique> => {
    const result = await (db as any)[modelName].findUnique(args)
    return result
  }
}

//프리즈마 동적모델 리턴타입 추론 방법 -> 
// 미완 결론: 어떠한 방식으로든 리턴타입의 코드힌트를 받을 수 없다
// export const dynamicQuery = (modelName: Prisma.ModelName) => {
//  const model = modelName.charAt(0).toLowerCase() + modelName.slice(1)
//  const resource = new Resource(model, db)
//  return resource
//}
 */
