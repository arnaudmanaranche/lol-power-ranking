import { Tournament } from '@prisma/client'
import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getPlaiceholder } from 'plaiceholder'

import type { PLAYER } from '@lpr/types'

import { apiInstance } from 'Utils/api'
import { LINEUP_ORDER } from 'Utils/constants'
import prisma from 'Utils/prisma'

async function synchronizeTournament(
  req: NextApiRequest,
  res: NextApiResponse<Tournament>
): Promise<void> {
  const tournamentId: string = req.body.pandascoreId
  const tournamentRegion: string = req.body.region
  const tournamentLogo: string = req.body.logo
  const tournamentEvent: string = req.body.event
  const tournamentYear: number = req.body.year

  const organizedTeams = []

  const unorganizedTeams = await fetch(
    `https://api.pandascore.co/tournaments/${tournamentId}/rosters?token=${process.env.PANDASCORE_TOKEN}`
  ).then((response) => response.json())

  await Promise.all(
    unorganizedTeams.rosters.map(
      async ({
        acronym,
        id,
        name,
        players: unorganizedPlayers
      }: {
        acronym: string
        id: number
        name: string
        players: PLAYER[]
      }) => {
        const organizedPlayers: PLAYER[] = []

        unorganizedPlayers.sort(
          (a: PLAYER, b: PLAYER) => LINEUP_ORDER.indexOf(a.role) - LINEUP_ORDER.indexOf(b.role)
        )

        unorganizedPlayers.map(({ id, name, role }) => {
          organizedPlayers.push({
            id,
            name,
            role
          })
        })

        const teamLogo = `https://${
          process.env.NEXT_PUBLIC_SUPABASE_ID
        }.supabase.co/storage/v1/object/public/${tournamentRegion.toLowerCase()}/${
          acronym ? acronym.toLowerCase() : ''.toLowerCase()
        }.png`

        const { base64 } = await getPlaiceholder(teamLogo)

        organizedTeams.push({
          acronym,
          id,
          name,
          players: organizedPlayers,
          logo: teamLogo,
          base64
        })
      }
    )
  )

  const { base64 } = await getPlaiceholder(tournamentLogo)

  const tournament = await prisma.tournament.create({
    data: {
      name: `${tournamentRegion} - ${tournamentEvent} (${tournamentYear})`,
      pandascoreId: parseInt(tournamentId),
      teams: organizedTeams,
      logo: tournamentLogo,
      year: tournamentYear,
      base64
    }
  })

  await apiInstance.get(
    `/revalidate?secret=${process.env.UNSTABLE_REVALIDATE_SECRET}&path=tournaments`
  )

  res.json(tournament)
}

export default withSentry(synchronizeTournament)
