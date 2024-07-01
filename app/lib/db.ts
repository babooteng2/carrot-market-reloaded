import { PrismaClient } from "@prisma/client"

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
