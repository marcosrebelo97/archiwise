'use client'
import type { ReactNode } from 'react'
import { createContext, useState } from 'react'

import type { Category } from '@/types/project'

type ContextCategories = {
  categoryEdit?: Category
  categoryDelete?: Category
  handleEditCategory: (category: Category | undefined) => void
  handleDeleteCategory: (category: Category | undefined) => void
}

export const CategoriesContext = createContext<ContextCategories>({
  categoryEdit: undefined,
  categoryDelete: undefined,
  handleEditCategory: () => {},
  handleDeleteCategory: () => {}
})

interface CategoriesProviderProps {
  children: ReactNode
}

export default function CategoriesProvider({ children }: CategoriesProviderProps) {
  const [categoryEdit, setCategoryEdit] = useState<Category | undefined>(undefined)
  const [categoryDelete, setCategoryDelete] = useState<Category | undefined>(undefined)

  function handleEditCategory(category: Category | undefined) {
    setCategoryEdit(category)
  }

  function handleDeleteCategory(category: Category | undefined) {
    setCategoryDelete(category)
  }

  return (
    <CategoriesContext.Provider
      value={{
        categoryEdit,
        categoryDelete,
        handleEditCategory,
        handleDeleteCategory
      }}
    >
      {children}
    </CategoriesContext.Provider>
  )
}
