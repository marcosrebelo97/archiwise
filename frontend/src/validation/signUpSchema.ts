import { z } from 'zod'

export const signUpSchema = z.object({
  name: z
    .string({
      required_error: 'O nome é obrigatório'
    })
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
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

export type SignUpFormData = z.infer<typeof signUpSchema>
