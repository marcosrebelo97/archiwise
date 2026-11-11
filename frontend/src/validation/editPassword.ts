import { z } from 'zod'

export const editPasswordSchema = z
  .object({
    currentPassword: z.string().min(4, 'Senha tem no mínimo 4 caracteres'),
    newPassword: z.string().min(4, 'Senha deve ter no mínimo 4 caracteres'),
    confirmPassword: z.string().min(4, 'Senha deve ter no mínimo 4 caracteres')
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'As senhas devem ser iguais',
    path: ['confirmPassword'] // Indica em qual campo a mensagem de erro será exibida
  })

export type EditPasswordData = z.infer<typeof editPasswordSchema>
