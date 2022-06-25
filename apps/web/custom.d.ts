declare module '*.svg'
interface Window {
  panelbear: any
}

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    NEXT_PUBLIC_APP_ENV: string
    NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_API_KEY: string
    NEXT_PUBLIC_PANELBEAR_SITE_ID: string
    NEXT_PUBLIC_SENTRY_DSN: string
    NEXT_PUBLIC_SUPABASE_ID: string
    NEXT_PUBLIC_SUPABASE_TOKEN: string
    PANDASCORE_TOKEN: string
    PRISMA_SERVICE_ROLE: string
    REDIS_URL: string
    UNSTABLE_REVALIDATE_SECRET: string
  }
}
