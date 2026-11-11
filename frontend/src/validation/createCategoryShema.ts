import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  color: z.string().max(9).optional(),
})

export type CreateCategoryData = z.infer<typeof createCategorySchema>
