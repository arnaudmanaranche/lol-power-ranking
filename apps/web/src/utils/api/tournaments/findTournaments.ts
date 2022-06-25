import { TOURNAMENT } from '@lpr/types'

import prisma from 'Utils/prisma'
import redis, { ONE_YEAR_IN_SECONDS } from 'Utils/redis'

async function findTournaments(): Promise<Omit<TOURNAMENT, 'teams'>[]> {
  const result = await prisma.tournament.findMany({
    select: {
      teams: false,
      id: true,
      name: true,
      pandascoreId: true,
      status: true,
      logo: true,
      base64: true,
      year: true
    }
  })

  redis.set('allTournaments', JSON.stringify(result), 'ex', ONE_YEAR_IN_SECONDS)

  return result
}

export default findTournaments
