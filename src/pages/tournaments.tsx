import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import type { ReactElement } from 'react'

import Error from 'Components/Error'
import Tournament from 'Components/Tournament'
import { DEFAULT_TITLE } from 'Utils/constants'
import prisma from 'Utils/prisma'
import protectedRoute from 'Utils/protectedRoute'
import type { TOURNAMENT } from 'Utils/types'

const Tournaments = ({ tournaments }: { tournaments: TOURNAMENT[] }): ReactElement => (
  <div className="max-w-screen-md mx-auto">
    <Head>
      <title>{`Tournaments - ${DEFAULT_TITLE}`}</title>
    </Head>
    <div className="m-auto mb-10 prose lg:prose-xl">
      <h1 className="text-center dark:text-white">Select a tournament</h1>
    </div>
    {tournaments?.length === 0 ? (
      <Error className="text-center">
        <p>No tournament are available for the moment.</p>
        <p>Please try again later.</p>
      </Error>
    ) : (
      <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
        {tournaments?.map((tournament) => {
          return tournament.status ? (
            <Link
              key={tournament.pandascoreId}
              href={`/ranking/new/${tournament.id}`}
              prefetch={false}
            >
              <a>
                <Tournament {...tournament} />
              </a>
            </Link>
          ) : (
            <div className="opacity-50 cursor-not-allowed" key={tournament.pandascoreId}>
              <Tournament {...tournament} />
            </div>
          )
        })}
      </div>
    )}
  </div>
)

export const getServerSideProps: GetServerSideProps = (context) =>
  protectedRoute(context, async () => {
    const tournaments = await prisma.tournament.findMany({
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
    })

    return { tournaments }
  })

export default Tournaments
