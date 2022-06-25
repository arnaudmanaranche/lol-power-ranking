import { Switch } from '@headlessui/react'
import type { User } from '@supabase/gotrue-js'
import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'

import { Button } from '@lpr/ui'
import Title from '@lpr/ui/src/Title'

import { useSetUser } from 'Contexts/user'
import { apiInstance } from 'Utils/api'
import { logout } from 'Utils/auth'
import { ROUTES } from 'Utils/constants'
import supabase from 'Utils/supabase'

const LIGHT = 'light'
const DARK = 'dark'
const { HOME } = ROUTES

const Settings = ({ user }: { user: User }): ReactElement => {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const setUser = useSetUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  const deleteMyAccount = async () => {
    try {
      await logout()
      await apiInstance.delete(`/users/${user.id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setUser(null)
      router.push(ROUTES.HOME)
    } catch (error) {
      return error
    }
  }

  if (!mounted) return null

  return (
    <div className="max-w-screen-md pt-10 mx-auto">
      <Title tag="h1">Settings</Title>
      <p className="text-md mt-10">
        Email: <span>{user.email}</span>
      </p>
      <hr className="my-6" />
      <div className="flex items-center">
        <span className="mr-3">Toggle mode:</span>
        <Switch
          checked={theme === DARK}
          onChange={() => {
            theme === DARK ? setTheme(LIGHT) : setTheme(DARK)
          }}
          className={`${theme === DARK ? 'bg-primaryDark' : 'bg-dark'}
          relative shrink-0 inline-flex h-[24px] w-[50px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">Toggle mode</span>
          <span
            aria-hidden="true"
            className={`${theme === DARK ? 'translate-x-[26px]' : 'translate-x-0'}
            pointer-events-none inline-block h-[20px] w-[20px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
          />
        </Switch>
      </div>
      <hr className="my-6" />
      <div>
        <p className="mb-1">Please be aware that deleting your account means that :</p>
        <ul className="mb-5 list-disc list-inside">
          <li className="pl-2">all your account data and personal information will be deleted.</li>
          <li className="pl-2">
            all your rankings will be deleted and will no longer be viewable and editable.
          </li>
        </ul>
        <Button onClick={deleteMyAccount}>Delete my account</Button>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await supabase.auth.api.getUserByCookie(context.req)

  if (!user) {
    return {
      redirect: {
        destination: HOME,
        permanent: false
      }
    }
  }

  return {
    props: {
      user
    }
  }
}

export default Settings
