import Link from 'next/link'
import type { ReactElement } from 'react'

const Footer = (): ReactElement => (
  <footer className="flex flex-col items-center py-5">
    <div className="flex">
      <p className="mb-3 mr-3">
        <Link href="https://lolpowerranking.statuspage.io/">
          <a target="_blank" rel="noreferrer noopener">
            Status
          </a>
        </Link>
      </p>
      <p className="mb-3">
        <Link href="/privacy-policy" prefetch={false}>
          <a>Privacy Policy</a>
        </Link>
      </p>
    </div>
    <p>
      Data provided by{' '}
      <Link href="https://pandascore.co/">
        <a className="text-primary" target="_blank" rel="noreferrer noopener">
          PandaScore
        </a>
      </Link>
    </p>
  </footer>
)

export default Footer
