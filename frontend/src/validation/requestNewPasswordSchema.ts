import { z } from 'zod'

export const requestNewPasswordSchema = z.object({
  email: z
    .string({
      required_error: 'O email é obrigatório'
    })
    .email({ message: 'Email inválido' })
})

export type RequestNewPasswordData = z.infer<typeof requestNewPasswordSchema>
