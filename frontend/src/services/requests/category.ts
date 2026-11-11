'use client'

import api from '@/services/api'
import type { CreateCategoryData } from '@/validation/createCategoryShema'
import type { EditCategoryData } from '@/validation/editCategoryShema'
import type { Category } from '@/types/project'

const listAll = async () => {
  const res = await api.get<Category[]>('categories')

  return res.data
}

const findOne = async (id: string) => {
  const res = await api.get<Category>(`/categories/${id}`)

  return res.data
}

const create = async (data: CreateCategoryData) => {
  const res = await api.post<Category>('/categories', data)

  return res.data
}

const update = async (categoryId: string, data: EditCategoryData) => {
  const res = await api.put<Category>(`/categories/${categoryId}`, data)

  return res.data
}

const remove = async (categoryId: string) => {
  await api.delete(`/categories/${categoryId}`)
}

export const categoryService = {
  create,
  findOne,
  listAll,
  update,
  remove
}
