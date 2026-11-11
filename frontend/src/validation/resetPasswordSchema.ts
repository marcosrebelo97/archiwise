// validation/resetPasswordSchema.ts
import { z } from 'zod'

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
      .regex(/[a-zA-Z]/, { message: 'A senha deve conter pelo menos uma letra' })
      .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número' }),

    confirmPassword: z
      .string()
      .min(8, { message: 'A senha de confirmação deve ter no mínimo 8 caracteres' })
      .regex(/[a-zA-Z]/, { message: 'A senha de confirmação deve conter pelo menos uma letra' })
      .regex(/[0-9]/, { message: 'A senha de confirmação deve conter pelo menos um número' })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
  })

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
