import { User } from '@prisma/client'

import prisma from 'Utils/prisma'

export async function createUser(id: string): Promise<User> {
  const user = await prisma.user.upsert({
    where: { id },
    update: { id },
    create: { id }
  })

  return user
}
