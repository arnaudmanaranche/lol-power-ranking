import { Ranking } from '@prisma/client'

import prisma from 'Utils/prisma'
import redis, { ONE_YEAR_IN_SECONDS } from 'Utils/redis'

async function updateRanking(ranking: Ranking): Promise<Ranking> {
  const result = await prisma.ranking.update({
    where: {
      id: ranking.id
    },
    data: {
      data: ranking.data
    }
  })

  redis.set(result.id, JSON.stringify(result), 'ex', ONE_YEAR_IN_SECONDS)

  return result
}

export default updateRanking
