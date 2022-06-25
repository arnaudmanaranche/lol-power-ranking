import { Tournament } from '@prisma/client'
import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import findTournaments from 'Utils/api/tournaments/findTournaments'

async function handler(req: NextApiRequest, res: NextApiResponse<any>): Promise<void> {
  let response = null

  switch (req.method) {
    case 'GET':
      response = await findTournaments()
      res.json(response)
      break
    default:
      throw new Error(`Method ${req.method} is not allowed`)
  }
}

export default withSentry(handler)
