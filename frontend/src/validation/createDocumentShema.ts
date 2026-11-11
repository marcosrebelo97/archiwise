import { z } from 'zod'

export const filesAllowed = ['pdf', 'doc', 'docx', 'pptx', 'ppt', 'xls', 'xlsx', 'odt', 'ods', 'odp']

export const createDocumentSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters')
    .refine(name => name.trim() === name, {
      message: 'Name must not have leading or trailing spaces'
    })
    .refine(
      name => {
        const parts = name.split('.')

        if (parts.length < 2) return false
        const extension = parts.pop()?.toLowerCase()
        const baseName = parts.join('.').trim()

        return baseName.length >= 3 && filesAllowed.includes(extension ?? '')
      },
      {
        message: `Name must have a valid extension (${filesAllowed.join(', ')}) and at least 3 characters before the extension`
      }
    ),
  categoryId: z.optional(z.string())
})

export type CreateDocumentData = z.infer<typeof createDocumentSchema>
