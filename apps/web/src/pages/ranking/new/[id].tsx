import { Dialog, Transition } from '@headlessui/react'
import { track as PanelbearTrack } from '@panelbear/panelbear-js'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Fragment, ReactElement, useRef, useState } from 'react'

import type { PLAYER, RANKING_VALUES, TOURNAMENT } from '@lpr/types'
import { Button, Team } from '@lpr/ui'

import { useUser } from 'Contexts/user'
import { login } from 'Utils/auth'
import { DEFAULT_TITLE } from 'Utils/constants'
import prisma from 'Utils/prisma'
import redis, { ONE_YEAR_IN_SECONDS } from 'Utils/redis'

const Ranking = ({ tournament }: { tournament: TOURNAMENT }): ReactElement => {
  const user = useUser()
  const [open, setOpen] = useState(false)
  const cancelButtonRef = useRef()

  const { teams, id, logo, name, base64 } = tournament

  function closeModal() {
    setOpen(false)
  }

  function openModal() {
    setOpen(true)
  }

  const [rankingId, setRankingId] = useState('')

  const ranking = teams

  const createRanking = async () => {
    const newRanking = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ranking, tournamentId: id, userId: user?.id })
    }

    try {
      const fetchResponse = await fetch('/api/ranking/new', newRanking)
      const data = await fetchResponse.json()
      PanelbearTrack('NewRanking')
      setRankingId(data.id)
      openModal()
      return data
    } catch (error) {
      return error
    }
  }

  const onUpdate = (value: RANKING_VALUES, playerId: number, teamId: number) => {
    const team = ranking.find((t) => t.id === teamId)

    const player = team?.players.find((p) => p.id === playerId)

    if (player) {
      player.value = value
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
      <div className="flex flex-col items-center mb-10">
        <Image
          src={logo}
          alt={`${name} logo`}
          height={70}
          width={70}
          id={name}
          placeholder="blur"
          blurDataURL={base64}
        />
        <div className="prose lg:prose-xl">
          <h1 className="capitalize dark:text-white">{name}</h1>
        </div>
      </div>
      <div className="grid gap-10 px-6 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:px-0">
        {ranking?.map(
          ({
            id: teamId,
            logo,
            name,
            players,
            base64
          }: {
            id: number
            logo: string
            name: string
            base64: string
            players: PLAYER[]
          }) => (
            <Team
              key={teamId}
              id={teamId}
              disabled={false}
              logo={logo}
              name={name}
              base64={base64}
              players={players}
              onUpdate={(value, playerId) => {
                onUpdate(value, playerId, teamId)
              }}
            />
          )
        )}
      </div>
      <div className="flex justify-center m-6">
        {user?.id ? (
          <Button onClick={createRanking}>{`Create my ${name} power ranking`}</Button>
        ) : (
          <Button onClick={login}>Login with Twitter</Button>
        )}
      </div>
      <Transition show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto bg-opacity-75 bg-dark"
          initialFocus={cancelButtonRef}
          static
          open={open}
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title as="h3" className="mb-6 text-lg font-medium leading-6 text-gray-900">
                  Your power ranking was created.
                  <br />
                  It&apos;s time to share your power ranking.
                </Dialog.Title>
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
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
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
