import type { AuthChangeEvent, Session, User } from '@supabase/gotrue-js'

import supabase from 'Utils/supabase'

import { apiInstance } from './api'

const logout = async (): Promise<void> => {
  await supabase.auth.signOut()
}

const login = async (): Promise<void> => {
  const redirectTo = window.location.href

  await supabase.auth.signIn(
    {
      provider: 'twitter'
    },
    {
      redirectTo
    }
  )
}

const handleAuthChange = async (event: AuthChangeEvent, session: Session): Promise<void> => {
  await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify({ event, session })
  })
}

const handleLogin = async (user: User): Promise<void> => {
  await apiInstance.post(`/users/${user.id}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify({ userId: user.id })
  })
}

export { handleAuthChange, handleLogin, login, logout }
