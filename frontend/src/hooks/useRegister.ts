'use client'
import { useMutation } from '@tanstack/react-query'

import { useCookie } from 'react-use'

import { AuthService } from '@/services/requests/auth'
import { COOKIE_KEY_USER, TOKEN_KEY_USER } from '@/types/project'

export const useRegister = () => {
  const [, update] = useCookie(COOKIE_KEY_USER)

  const { mutate: onRegister, isPending } = useMutation({
    mutationFn: AuthService.signup,
    onSuccess: res => {
      if (res) {
        localStorage.setItem(TOKEN_KEY_USER, JSON.stringify(res.data))
        update(res.data.name)
      }
    }
  })

  return { onRegister, isPending }
}
