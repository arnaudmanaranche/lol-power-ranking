import { Ranking } from '@prisma/client'

import prisma from 'Utils/prisma'
import redis, { ONE_YEAR_IN_SECONDS } from 'Utils/redis'

async function createRanking(
  ranking: Ranking,
  tournamentId: string,
  userId: string
): Promise<Ranking> {
  const result = await prisma.ranking.create({
    data: {
      data: ranking.data,
      userId,
      tournamentId: tournamentId
    }
  })

  redis.set(result.id, JSON.stringify(result), 'ex', ONE_YEAR_IN_SECONDS)

  return result
}

export default createRanking
