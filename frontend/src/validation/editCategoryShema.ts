import { z } from 'zod'

export const editCategorySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.optional(z.string().max(255)).or(z.null()),
  color: z.optional(z.string().max(9))
})

export type EditCategoryData = z.infer<typeof editCategorySchema>
