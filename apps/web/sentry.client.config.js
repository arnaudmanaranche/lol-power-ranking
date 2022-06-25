import { init } from '@sentry/nextjs'
import { Integrations } from '@sentry/tracing'

init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 0.2,
  environment: process.env.NEXT_PUBLIC_APP_ENV
})
