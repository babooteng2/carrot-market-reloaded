import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function test() {
  // const token = await db.sMSToken.create({
  //   data: {
  //     token: "12112",
  //     user: {
  //       connect: {
  //         id: 1
  //       }
  //     }
  //   }
  // })
  const token = await db.sMSToken.findUnique({
    where: {
      id: 1,
    },
    include: {
      user: true,
    },
  })
}

test()

export default db
