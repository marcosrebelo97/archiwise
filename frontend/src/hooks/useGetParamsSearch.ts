import { useSearchParams } from 'next/navigation'

export function useGetParamsSearch() {
  const params = useSearchParams()

  const term = params.get('q') || ''
  const types = params.get('types') || ''
  const startDate = params.get('dateStart') || ''
  const endDate = params.get('dateEnd') || ''
  const categoryId = params.get('categoryId') || ''

  return {
    ...(term && { term }),
    ...(types && { types }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(categoryId && { categoryId })
  }
}
