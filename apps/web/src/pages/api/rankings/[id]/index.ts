import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { RANKING } from '@lpr/types'

import deleteRanking from 'Utils/api/rankings/deleteRanking'
import updateRanking from 'Utils/api/rankings/updateRanking'

async function handler(req: NextApiRequest, res: NextApiResponse<RANKING | null>): Promise<void> {
  let response = null

  switch (req.method) {
    case 'DELETE':
      const rankingId = req.query.id as string

      response = await deleteRanking(rankingId)
      res.status(204).json(response)
      break
    case 'PATCH':
      const {
        body: { ranking }
      } = req

      response = await updateRanking(ranking)
      res.status(204).json(response)
      break
    default:
      throw new Error(`Method ${req.method} is not allowed`)
  }
}

export default withSentry(handler)
