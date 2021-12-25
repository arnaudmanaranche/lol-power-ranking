import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from 'Utils/prisma'

export default async function updateRanking(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { ranking } = req.body

  const result = await prisma.ranking.update({
    where: {
      id: ranking.id
    },
    data: {
      data: ranking.data
    }
  })

  res.json(result)
}