import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { RANKING, TOURNAMENT } from '@lpr/types'

import prisma from 'Utils/prisma'
import redis, { ONE_YEAR_IN_SECONDS } from 'Utils/redis'

type TOURNAMENT_WITHOUT_TEAM = Omit<TOURNAMENT, 'teams'>
type RANKING_WITHOUT_TOURNAMENT = Omit<RANKING, 'tournament'>

interface RANKINGS_BY_USER extends RANKING_WITHOUT_TOURNAMENT {
  tournament: TOURNAMENT_WITHOUT_TEAM
}

async function getRankingsByUser(
  req: NextApiRequest,
  res: NextApiResponse<Omit<RANKINGS_BY_USER, 'data'>[]>
): Promise<void> {
  const userId = req.query.id as string

  const result = await prisma.ranking.findMany({
    where: {
      userId
    },
    select: {
      id: true,
      tournamentId: true,
      data: false,
      tournament: {
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
      },
      userId: true
    }
  })

  redis.set(`${userId}_rankings`, JSON.stringify(result), 'ex', ONE_YEAR_IN_SECONDS)

  res.json(result)
}

export default withSentry(getRankingsByUser)
