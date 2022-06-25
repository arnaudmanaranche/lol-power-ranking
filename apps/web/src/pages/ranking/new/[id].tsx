import { track as PanelbearTrack } from '@panelbear/panelbear-js'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { ReactElement, useEffect, useState } from 'react'

import type { RANKING_VALUES, TEAM, TOURNAMENT } from '@lpr/types'
import { Button, Modal, Team } from '@lpr/ui'
import Title from '@lpr/ui/src/Title'

import TwitterIcon from 'Assets/twitter.svg'
import { useUser } from 'Contexts/user'
import { apiInstance } from 'Utils/api'
import { login } from 'Utils/auth'
import { API_ENDPOINT, DEFAULT_TITLE } from 'Utils/constants'
import prisma from 'Utils/prisma'
import redis, { ONE_YEAR_IN_SECONDS } from 'Utils/redis'

const Ranking = ({ tournament }: { tournament: TOURNAMENT }): ReactElement => {
  const { teams, id, logo, name, base64 } = tournament

  const user = useUser()
  const [isModalOpen, setModalOpen] = useState(false)
  const [rankingId, setRankingId] = useState('')
  const [ranking, setRanking] = useState<TEAM[] | null>(null)

  const toggleModal = () => setModalOpen((value) => !value)

  useEffect(() => {
    const hasUnsavedRanking = window.localStorage.getItem(tournament.id)

    if (hasUnsavedRanking) {
      setRanking(JSON.parse(hasUnsavedRanking))
    } else {
      setRanking(teams)
    }
  }, [teams, tournament.id])

  const createRanking = async () => {
    try {
      const res = await apiInstance.post('/rankings', {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ranking, tournamentId: id, userId: user.id })
      })
      const data = res.data
      PanelbearTrack('NewRanking')
      setRankingId(data.id)
      toggleModal()
      return data
    } catch (error) {
      return error
    }
  }

  const onChangePlayerValue = (value: RANKING_VALUES, playerId: number, teamId: number) => {
    const hasUnsavedRanking = window.localStorage.getItem(rankingId)
    const team = ranking.find((t) => t.id === teamId)

    const player = team?.players.find((p) => p.id === playerId)

    if (player) {
      player.value = value
    }

    if (!hasUnsavedRanking) {
      window.localStorage.setItem(tournament.id, JSON.stringify(ranking))
    }

    return
  }

  return (
    <div className="max-w-screen-xl pt-10 mx-auto">
      <Head>
        <title>{`${name} - ${DEFAULT_TITLE}`}</title>
        <meta property="og:image" content={logo} key="og:image" />
        <meta property="og:image:secure_url" content={logo} />
        <meta property="og:image:width" content="200" />
        <meta property="og:image:height" content="200" />
        <meta property="og:image:alt" content={`${name} logo`} />
      </Head>
      <div className="flex justify-center items-center mb-10">
        <Image
          src={logo}
          alt={`${name} logo`}
          height={70}
          width={70}
          id={name}
          placeholder="blur"
          blurDataURL={base64}
        />
        <Title tag="h1" className="capitalize">
          {name}
        </Title>
      </div>
      <div className="grid gap-10 px-6 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:px-0">
        {ranking?.map(({ id: teamId, logo, name, players, base64 }) => (
          <Team
            key={teamId}
            id={teamId}
            disabled={false}
            logo={logo}
            name={name}
            base64={base64}
            players={players}
            onUpdate={(value, playerId) => {
              onChangePlayerValue(value, playerId, teamId)
            }}
          />
        ))}
      </div>
      <div className="flex justify-center m-6">
        {user?.id ? (
          <Button onClick={createRanking}>{`Create my ${name} power ranking`}</Button>
        ) : (
          <Button onClick={login}>
            Login with Twitter <TwitterIcon className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
      <Modal title="Your power ranking was created" toggleModal={toggleModal} isOpen={isModalOpen}>
        <p className="mb-3">It&apos;s time to share it !</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Button
            href={`https://www.facebook.com/sharer/sharer.php?u=https://lol-power-ranking.app/ranking/view/${rankingId}`}
          >
            Share on Facebook
          </Button>
          <Button
            href={`https://twitter.com/intent/tweet?url=https://lol-power-ranking.app/ranking/view/${rankingId}`}
          >
            Share on Twitter
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    params: { id }
  } = context

  let tournament = null

  let cachedData = await redis.get(id)

  if (cachedData) {
    tournament = JSON.parse(cachedData)
  } else {
    tournament = await prisma.tournament.findUnique({
      where: {
        id: id as string
      }
    })

    redis.set(id, JSON.stringify(tournament), 'ex', ONE_YEAR_IN_SECONDS)
  }

  if (!tournament) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      tournament
    }
  }
}

export default Ranking
