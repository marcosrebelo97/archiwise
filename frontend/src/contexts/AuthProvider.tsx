'use client'
import type { ReactNode } from 'react'
import { createContext, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import type { User } from '@/types/project'
import { TOKEN_KEY_USER } from '@/types/project'

type ContextAuth = {
  isLogged: boolean
  user: User | null
  login: (email: string) => void
  logout: () => void
  update: (user: any) => void
}

export const AuthContext = createContext<ContextAuth>({
  isLogged: false,
  user: null,
  login: () => {},
  logout: () => {},
  update: () => {}
})

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const { push } = useRouter()

  const isLogged = !!user

  useEffect(() => {
    const user = localStorage.getItem(TOKEN_KEY_USER)

    if (user) {
      const userParsed = JSON.parse(user) as User

      setUser(userParsed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function login(email: string) {
    // setEmail(email)
    localStorage.setItem('user', JSON.stringify(email))
    push('/')
  }

  function logout() {
    // setEmail(null)
    localStorage.removeItem('user')
  }

  function update(user: any) {
    // setEmail(email)
    console.log(user)
    localStorage.setItem('user', JSON.stringify(name))
    setUser(user)
  }

  return <AuthContext.Provider value={{ user, isLogged, login, logout, update }}>{children}</AuthContext.Provider>
}
