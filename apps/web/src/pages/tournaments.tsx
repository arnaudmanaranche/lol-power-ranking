import { motion } from 'framer-motion'
import type { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import type { ReactElement } from 'react'

import type { TOURNAMENT } from '@lpr/types'
import { Error, Tournament } from '@lpr/ui'
import Title from '@lpr/ui/src/Title'

import { apiInstance } from 'Utils/api'
import { DEFAULT_TITLE } from 'Utils/constants'

const parent = {
  show: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const stat = {
  hidden: { opacity: 0 },
  show: { opacity: 1 }
}

const Tournaments = ({ tournaments }: { tournaments: TOURNAMENT[] }): ReactElement => (
  <div className="max-w-screen-md pt-10 mx-auto text-center">
    <Head>
      <title>{`Tournaments - ${DEFAULT_TITLE}`}</title>
    </Head>
    <div className="mb-10">
      <Title tag="h1">Select a tournament</Title>
    </div>
    {tournaments?.length === 0 ? (
      <Error className="text-center">
        <p>No tournament are available for the moment.</p>
        <p>Please try again later.</p>
      </Error>
    ) : (
      <motion.div
        variants={parent}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:grid-cols-3"
      >
        {tournaments?.map((tournament) => (
          <motion.div variants={stat} key={tournament.pandascoreId}>
            {tournament.status ? (
              <Link href={`/ranking/new/${tournament.id}`} prefetch={false}>
                <a>
                  <Tournament {...tournament} />
                </a>
              </Link>
            ) : (
              <div className="opacity-50 cursor-not-allowed">
                <Tournament {...tournament} />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    )}
  </div>
)

export const getStaticProps: GetStaticProps = async () => {
  const res = await apiInstance.get('/tournaments')

  return {
    props: {
      tournaments: res.data
    }
  }
}

export default Tournaments
