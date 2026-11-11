export const TOKEN_KEY_USER = 'token_user'
export const COOKIE_KEY_USER = 'cookie_user'
export interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

export interface DialogProps {
  open: boolean
  onClose: () => void
}

export interface UserDocument {
  id: string
  name: string
  size: number
  categoryId: string
  createdAt: string
  filePreviewPath: string
  fileViewPath: string
  filePath: string
  userId: string
  uploadedAt: string
  viewCount: number
  type: string
  category: DocCategory
  isDeleted: boolean
  isFavorite: boolean
}
export type UpdateUserDocument = Partial<
  Pick<UserDocument, 'name' | 'viewCount' | 'categoryId' | 'isDeleted' | 'isFavorite'>
>

export type RegisterSearch = {
  termSearched: string
}

export type RestoreUserDocument = Pick<UserDocument, 'isDeleted'>
export interface DocumentQueryParams {
  categoryId?: string
  startDate?: string
  endDate?: string
  isDeleted?: boolean
}

export interface Category {
  id: string
  name: string
  description: string
  createdAt: string
  userId: string
  color: string
}

export interface DocCategory {
  id: string
  name: string
  color: string
}
export type CategoryUploads = {
  month: string
  data: { categoryName: string; uploads: number; color: string | null }[]
}[]

export type Search = {
  termSearched: string
  id: string
}
