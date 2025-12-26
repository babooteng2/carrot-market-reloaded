import { Prisma, PrismaClient } from "@prisma/client"
import { unstable_cache as next_cache } from "next/cache"

export class Resource {
  resourceType: string
  prisma: PrismaClient

  constructor(type: string, _prisma: PrismaClient) {
    this.resourceType = type
    this.prisma = _prisma
  }

  getModel(modelName?: string) {
    const m = modelName ? modelName : this.resourceType
    return (this.prisma as any)[m]
  }

  async browse(options?: any) {
    if (options == null) {
      options = {
        take: 10,
        skip: 0,
      }
    }
    var model = await this.getModel()
    try {
      var output = await model.findMany(options)
    } catch (err) {
      output = { error: err, message: "Something went wrong." }
    }
    return output
  }

  async read(options?: any) {
    if (options == null) {
      options = {
        take: 10,
        skip: 0,
      }
    }
    var model = await this.getModel()
    try {
      var output = await model.findUnique(options)
    } catch (err) {
      output = { error: err, message: "Something went wrong." }
    }
    return output
  }

  async get(id: number, cachedModelName?: Prisma.ModelName) {
    var model = await this.getModel(cachedModelName)
    var output = null
    try {
      const item = await model.findUnique({
        where: {
          id,
        },
      })
      output = item
    } catch (err) {
      output = { error: err, message: "Something went wrong." }
    }
    return output
  }

  async add(data: any) {
    var model = await this.getModel()
    var output = null
    try {
      const item = await model.create({
        data: data,
      })
      output = item
    } catch (err) {
      output = { error: err, message: "Something went wrong." }
    }
    return output
  }

  async edit(id: number, data: any) {
    var model = await this.getModel()
    var output = null
    try {
      const item = await model.update({
        where: {
          id,
        },
        data: data,
      })
      output = item
    } catch (err) {
      output = { error: err, message: "Something went wrong." }
    }
    return output
  }

  async delete(id: number) {
    var model = await this.getModel()
    var output = null
    try {
      const item = await model.delete({
        where: {
          id,
        },
      })
      output = item
    } catch (err) {
      output = { error: err, message: "Something went wrong." }
    }
    return output
  }

  async getTitle(
    id: number,
    cachedModelName?: string
  ): Promise<IqueryRetrunType["getTitle"] & { error: Error; message: string }> {
    var output = null
    var model = await this.getModel(cachedModelName)
    try {
      const item = await model.findUnique({
        where: {
          id,
        },
        ...getTitleArgs,
      })
      output = item
    } catch (err) {
      output = { error: err, message: "Something went wrong." }
    }
    return output
  }

  async getCachedTitle(id: number) {
    let modelName = this.resourceType.toUpperCase()
    const cachedOperation = next_cache(this.getTitle, [`${modelName}-TITLE`], {
      tags: [`${modelName}-TITLE-${id}`],
    })
    modelName = this.resourceType
    console.log("getCachedTitle - modelName : ", modelName)
    return cachedOperation(id, modelName)
  }

  async getPost(
    id: number,
    cachedModelName?: string
  ): Promise<IqueryRetrunType["getPost"] & { error: Error; message: string }> {
    var model = await this.getModel()
    var output = null
    try {
      const item = await model.findUnique({
        where: {
          id,
        },
        ...postWithUserArgs,
      })
      output = item
    } catch (err) {
      output = { error: err, message: "Something went wrong." }
    }
    return output
  }

  async getCachedPost(id: number) {
    const modelName = this.resourceType.toUpperCase()
    const cachedOperation = next_cache(this.getPost, [`${modelName}-DETAIL`], {
      tags: [`${modelName}-DETAIL-${id}`],
    })
    console.log("getCachedPost - resourceType: ", this.resourceType)
    return cachedOperation(id, this.resourceType)
  }
}

const getTitleArgs = Prisma.validator<Prisma.ProductDefaultArgs>()({
  select: { title: true },
})

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

type GetTitle = Prisma.ProductGetPayload<typeof getTitleArgs>
type PostWithUser = Prisma.PostGetPayload<typeof postWithUserArgs>

interface IqueryRetrunType {
  getTitle: GetTitle
  getPost: PostWithUser
}
