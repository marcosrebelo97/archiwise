import { useMutation } from '@tanstack/react-query'

import { AuthService } from '@/services/requests/auth'

export function useRequestNewPassword() {
  const {
    mutate: onRequestNewPassword,
    isPending,
    error
  } = useMutation({
    mutationFn: (email: string) => AuthService.forgotPassword(email)
  })

  return { onRequestNewPassword, isPending, error }
}
