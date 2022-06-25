import prisma from 'Utils/prisma'
import redis from 'Utils/redis'

async function deleteRanking(id: string): Promise<void> {
  const ranking = await prisma.ranking.delete({
    where: { id }
  })

  redis.del(ranking.id)
}

export default deleteRanking
