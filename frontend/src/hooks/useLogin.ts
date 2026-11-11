'use client'
import { useMutation } from '@tanstack/react-query'

import { useCookie } from 'react-use'

import { AuthService } from '@/services/requests/auth'
import { COOKIE_KEY_USER, TOKEN_KEY_USER } from '@/types/project'

export const useLogin = () => {
  const [, update] = useCookie(COOKIE_KEY_USER)

  const { mutate: onLogin, isPending } = useMutation({
    mutationFn: AuthService.login,
    onSuccess: res => {
      if (res) {
        localStorage.setItem(TOKEN_KEY_USER, JSON.stringify(res.data))
        update(res.data.name)
      }
    }
  })

  return { onLogin, isPending }
}
