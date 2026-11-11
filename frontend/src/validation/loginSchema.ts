import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'O email é obrigatório'
    })
    .email({ message: 'Email inválido' }),
  password: z
    .string({
      required_error: 'A senha é obrigatória'
    })
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
})

export type LoginFormData = z.infer<typeof loginSchema>
