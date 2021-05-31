import { Dialog, Transition } from '@headlessui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Fragment, useRef, useState } from 'react'

import Button from 'Components/Button'
import Team from 'Components/Team'
import { DEFAULT_TITLE } from 'Utils/constants'
import prisma from 'Utils/prisma'
import { PLAYER, TOURNAMENT } from 'Utils/types'

type Props = {
  tournament: TOURNAMENT
}

const Ranking: React.FC<Props> = ({ tournament }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const cancelButtonRef = useRef()

  // Make a clean loading state
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const { teams, id, logo, name } = tournament

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
      body: JSON.stringify({ ranking, tournamentId: id })
    }

    try {
      const fetchResponse = await fetch('/api/ranking/new', newRanking)
      const data = await fetchResponse.json()
      setRankingId(data.id)
      return data
    } catch (error) {
      return error
    }
  }

  const onUpdate = (value: string, playerId: number, teamId: number) => {
    const team = ranking.find((t) => t.id === teamId)

    const player = team?.players.find((p) => p.id === playerId)

    if (player) {
      player.value = value
    }

    return
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <Head>
        <title>{`${name} - ${DEFAULT_TITLE}`}</title>
        <meta property="og:image" content={logo} key="og:image" />
        <meta property="og:image:secure_url" content={logo} />
        <meta property="og:image:width" content="200" />
        <meta property="og:image:height" content="200" />
        <meta property="og:image:alt" content={`${name} logo`} />
      </Head>
      <div className="m-auto mb-10 prose lg:prose-xl">
        <h1 className="flex items-center justify-center mb-4 capitalize">
          <Image src={logo} alt={`${name} logo`} height={60} width={60} />
          <p>{name}</p>
        </h1>
      </div>
      <div className="grid gap-10 px-6 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:px-0">
        {ranking?.map(
          ({
            id: teamId,
            logo,
            name,
            players
          }: {
            id: number
            logo: string
            name: string
            players: PLAYER[]
          }) => (
            <Team
              key={teamId}
              id={teamId}
              disabled={false}
              logo={logo}
              name={name}
              players={players}
              onUpdate={(value, playerId) => {
                onUpdate(value, playerId, teamId)
              }}
            />
          )
        )}
      </div>
      <div className="m-6 text-center">
        <Button
          onClick={() => {
            openModal()
            createRanking()
          }}
        >{`Create my ${name} power raking`}</Button>
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
                <Dialog.Title as="h3" className="mb-10 text-lg font-medium leading-6 text-gray-900">
                  Your power ranking was created.
                  <br />
                  It's time to share your power ranking.
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

export const getStaticPaths: GetStaticPaths = async () => {
  const tournaments = await prisma.tournament.findMany()

  const paths = tournaments.map((tournament) => ({
    params: { id: tournament.id }
  }))

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params

  const tournament = await prisma.tournament.findUnique({
    where: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      id
    }
  })

  if (!tournament) {
    return {
      notFound: true
    }
  }

  return {
    props: { tournament },
    revalidate: 3600
  }
}

export default Ranking
