import { z } from 'zod'

export const editPerfilSchema = z.object({
  name: z.string().min(3).max(100)
})

export type EditPerfilData = z.infer<typeof editPerfilSchema>
