import { User } from '@prisma/client'
import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { createUser } from 'Utils/api/users/createUser'
import { deleteUser } from 'Utils/api/users/deleteUser'

async function handler(req: NextApiRequest, res: NextApiResponse<User | null>): Promise<void> {
  const userId = req.query.id as string
  let response = null

  switch (req.method) {
    case 'DELETE':
      response = await deleteUser(userId)
      res.status(204).json(response)
      break
    case 'POST':
      response = await createUser(userId)
      res.json(response)
      break
    default:
      throw new Error(`Method ${req.method} is not allowed`)
  }
}

export default withSentry(handler)
