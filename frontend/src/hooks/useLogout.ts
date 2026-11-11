'use client'
import { useRouter } from 'next/navigation'

import { useMutation } from '@tanstack/react-query'

import { useCookie } from 'react-use'

import { AuthService } from '@/services/requests/auth'
import { COOKIE_KEY_USER, TOKEN_KEY_USER } from '@/types/project'

export const useLogout = () => {
  const { push } = useRouter()
  const [, , clear] = useCookie(COOKIE_KEY_USER)
  const [, , clearToken] = useCookie('connect.sid')

  const { mutate: onLogout, isPending } = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      localStorage.removeItem(TOKEN_KEY_USER)
      clear()
      clearToken()
      push('/login')
    }
  })

  return { onLogout, isPending }
}
