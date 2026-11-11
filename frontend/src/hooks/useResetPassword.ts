import { useMutation } from '@tanstack/react-query'

import { AuthService } from '@/services/requests/auth'

export function useResetPassword() {
  const {
    mutate: onResetPassword,
    isPending,
    error
  } = useMutation({
    mutationFn: (data: { newPassword: string; token: string }) => AuthService.resetPassword(data)
  })

  return { onResetPassword, isPending, error }
}
