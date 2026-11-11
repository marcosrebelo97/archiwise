'use client'

import api from '@/services/api'
import type { UpdateUserDocument, UserDocument, RestoreUserDocument } from '@/types/project'

interface DocumentQueryParams {
  categoryId?: string
  startDate?: string
  endDate?: string
  title?: string
  term?: string
  isDeleted?: boolean
  types?: string
  isFavorite?: boolean
}

function getParamsSearch(queryParams?: DocumentQueryParams) {
  const params = new URLSearchParams()

  // Se queryParams existir, adiciona os parâmetros que foram informados
  if (queryParams) {
    if (queryParams.categoryId) {
      params.append('categoryId', queryParams.categoryId)
    }

    if (queryParams.startDate) {
      params.append('startDate', queryParams.startDate)
    }

    if (queryParams.endDate) {
      params.append('endDate', queryParams.endDate)
    }

    if (queryParams.title) {
      params.append('title', queryParams.title)
    }

    if (queryParams.term) {
      params.append('term', queryParams.term)
    }

    if (queryParams.isDeleted) {
      params.append('isDeleted', `${queryParams.isDeleted}`)
    }

    if (queryParams.types) {
      params.append('types', queryParams.types)
    }

    if (queryParams.isFavorite) {
      params.append('isFavorite', `${queryParams.isFavorite}`)
    }
  }

  return params
}

const create = async (data: FormData) => {
  const res = await api.post<UserDocument>('/docs', data)

  return res
}

const findOne = async (id: string) => {
  const res = await api.get<UserDocument>(`docs/${id}`)

  return res.data
}

const restoreOne = async (id: string, payload: RestoreUserDocument) => {
  const res = await api.put<UserDocument>(`/docs/restore/${id}`, payload)

  return res.data
}

const listAll = async (queryParams?: DocumentQueryParams) => {
  // Instancia o objeto URLSearchParams
  const params = getParamsSearch(queryParams)

  // Realiza a requisição passando o objeto URLSearchParams como parâmetro
  const res = await api.get<UserDocument[]>('/docs', {
    params
  })

  return res.data
}

export interface UserDocumentSearch extends UserDocument {
  snippets: string[]
}

const search = async (queryParams: DocumentQueryParams) => {
  const params = getParamsSearch(queryParams)

  const res = await api.get<UserDocumentSearch[]>('/docs/search', {
    params
  })

  return res.data
}

const update = async (id: string, payload: UpdateUserDocument) => {
  const res = await api.put<UserDocument>(`docs/${id}`, payload)

  return res.data
}

const download = async (id: string) => {
  const res = await api.get(`/docs/download/${id}`, {
    responseType: 'blob'
  })

  return res
}

const deleteOne = async (id: string) => {
  const res = await api.delete<UserDocument>(`docs/${id}`)

  return res.data
}

export const documentsService = {
  create,
  findOne,
  listAll,
  update,
  download,
  search,
  deleteOne,
  restoreOne
}
