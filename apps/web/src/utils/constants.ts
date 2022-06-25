export const ROUTES = {
  HOME: '/',
  TOURNAMENTS: '/tournaments',
  SETTINGS: '/settings',
  MY_RANKINGS: '/my-rankings'
}

export const LINEUP_ORDER = ['top', 'jun', 'mid', 'adc', 'sup']

export const REGIONS = ['lec', 'lcs', 'lck', 'lpl', 'lfl']

export const DEFAULT_TITLE = 'LoL Power Ranking'
export const DEFAULT_DESCRIPTION = 'Share easily your League of Legends power rankings'

export const SUPABASE_EVENTS = {
  SIGNED_IN: 'SIGNED_IN',
  SIGNED_OUT: 'SIGNED_OUT'
}

export const API_ENDPOINT = {
  development: 'http://localhost:3000/api',
  preview: 'https://preview.lol-power-ranking.app/api',
  production: 'https://lol-power-ranking.app/api'
}[process.env.NEXT_PUBLIC_APP_ENV]
