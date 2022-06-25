import { motion } from 'framer-motion'
import Image from 'next/image'
import type { ReactElement } from 'react'

import { Button } from '@lpr/ui'
import Title from '@lpr/ui/src/Title'

import { REGIONS, ROUTES } from 'Utils/constants'

const { TOURNAMENTS } = ROUTES

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

const Home = (): ReactElement => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex flex-col items-center w-full h-screen">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#03acbf"
            fillOpacity="1"
            d="M0,128L21.8,112C43.6,96,87,64,131,85.3C174.5,107,218,181,262,224C305.5,267,349,277,393,272C436.4,267,480,245,524,250.7C567.3,256,611,288,655,288C698.2,288,742,256,785,229.3C829.1,203,873,181,916,170.7C960,160,1004,160,1047,138.7C1090.9,117,1135,75,1178,64C1221.8,53,1265,75,1309,106.7C1352.7,139,1396,181,1418,202.7L1440,224L1440,0L1418.2,0C1396.4,0,1353,0,1309,0C1265.5,0,1222,0,1178,0C1134.5,0,1091,0,1047,0C1003.6,0,960,0,916,0C872.7,0,829,0,785,0C741.8,0,698,0,655,0C610.9,0,567,0,524,0C480,0,436,0,393,0C349.1,0,305,0,262,0C218.2,0,175,0,131,0C87.3,0,44,0,22,0L0,0Z"
          ></path>
        </svg>
        <Title className="my-10" tag="h1">
          Share easily your League of Legends power rankings
        </Title>
        <Button to={TOURNAMENTS}>CREATE YOURS</Button>
        <motion.div
          variants={parent}
          initial="hidden"
          animate="show"
          className="flex mt-20 space-x-20"
        >
          {REGIONS.map((region) => (
            <motion.div variants={stat} key={region} data-testid={region}>
              <Image
                src={`https://${process.env.NEXT_PUBLIC_SUPABASE_ID}.supabase.in/storage/v1/object/public/${region}/logo.png`}
                alt={`${region} logo`}
                className="drop-shadow-lg"
                height={80}
                width={80}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Home
