import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { RANKING } from '@lpr/types'

import createRanking from 'Utils/api/rankings/createRanking'

async function handler(req: NextApiRequest, res: NextApiResponse<RANKING | null>): Promise<void> {
  let response = null

  switch (req.method) {
    case 'POST':
      const {
        body: { ranking, tournamentId, userId }
      } = req

      response = await createRanking(ranking, tournamentId, userId)
      res.json(response)
      break
    default:
      throw new Error(`Method ${req.method} is not allowed`)
  }
}

export default withSentry(handler)
