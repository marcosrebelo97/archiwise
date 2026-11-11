import { z } from "zod";

export const editCategoryFromDocument = z.object({
  categoryId: z.optional(z.string()),
  name: z.optional(z.string()),
})

export type EditCategoryFromDocType = z.infer<typeof editCategoryFromDocument>
