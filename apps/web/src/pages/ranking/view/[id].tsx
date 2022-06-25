import { track as PanelbearTrack } from '@panelbear/panelbear-js'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import type { ReactElement } from 'react'

import type { RANKING, RANKING_VALUES } from '@lpr/types'
import { Button, Team } from '@lpr/ui'
import Title from '@lpr/ui/src/Title'

import { apiInstance } from 'Utils/api'
import { DEFAULT_TITLE } from 'Utils/constants'
import prisma from 'Utils/prisma'
import redis, { ONE_YEAR_IN_SECONDS } from 'Utils/redis'
import supabase from 'Utils/supabase'

const ViewRanking = ({
  ranking,
  isEditMode
}: {
  ranking: RANKING
  isEditMode: boolean
}): ReactElement => {
  const copyRanking = Object.assign({}, ranking)

  const updateRanking = async () => {
    try {
      const res = await apiInstance.patch('/rankings', {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ranking })
      })
      const updatedRanking = res.data
      PanelbearTrack('UpdateRanking')
      return updatedRanking
    } catch (error) {
      return error
    }
  }

  const onUpdate = (value: RANKING_VALUES, playerId: number, teamId: number) => {
    const team = copyRanking.data.find((t) => t.id === teamId)

    const player = team?.players.find((p) => p.id === playerId)

    if (player) {
      player.value = value
    }

    return
  }

  return (
    <div className="max-w-screen-xl pt-10 mx-auto">
      <Head>
        <title>{`${ranking?.tournament?.name} - ${DEFAULT_TITLE}`}</title>
        <meta property="og:image" content={ranking?.tournament?.logo} key="og:image" />
        <meta property="og:image:secure_url" content={ranking?.tournament?.logo} />
        <meta property="og:image:width" content="200" />
        <meta property="og:image:height" content="200" />
        <meta property="og:image:alt" content={`${ranking?.tournament?.name} logo`} />
      </Head>
      <div className="flex justify-center items-center mb-10">
        <Image
          src={ranking.tournament.logo}
          alt={`${ranking?.tournament?.name} logo`}
          height={60}
          width={60}
          id={ranking?.tournament?.name}
          placeholder="blur"
          blurDataURL={ranking?.tournament?.base64}
        />
        <Title tag="h1" className="capitalize">
          {ranking?.tournament?.name}
        </Title>
      </div>
      <div className="grid gap-10 mx-auto sm:grid-cols-2 md:grid-cols-3">
        {copyRanking?.data?.map(({ id: teamId, logo, name, players, base64 }) => (
          <Team
            onUpdate={(value, playerId) => {
              onUpdate(value, playerId, teamId)
            }}
            key={teamId}
            id={teamId}
            logo={logo}
            base64={base64}
            disabled={!isEditMode}
            name={name}
            players={players}
          />
        ))}
      </div>
      {isEditMode ? (
        <div className="flex justify-center m-6">
          <Button
            onClick={updateRanking}
          >{`Update my ${ranking.tournament.name} power ranking`}</Button>
        </div>
      ) : null}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await supabase.auth.api.getUserByCookie(context.req)

  const {
    params: { id },
    query: { edit }
  } = context

  let ranking = null

  let cachedData = await redis.get(id)

  if (cachedData) {
    ranking = JSON.parse(cachedData)

    // TODO: tournament name and logo are not cached, so we need to fetch them again.
    const tournament = await prisma.tournament.findUnique({
      where: { id: ranking.tournamentId }
    })

    ranking.tournament = tournament
  } else {
    ranking = await prisma.ranking.findUnique({
      where: {
        id: id as string
      },
      select: {
        id: true,
        tournamentId: true,
        data: true,
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

    redis.set(id, JSON.stringify(ranking), 'ex', ONE_YEAR_IN_SECONDS)
  }

  if (!ranking) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      ranking,
      isEditMode: edit !== undefined && user?.id === ranking.userId
    }
  }
}

export default ViewRanking
