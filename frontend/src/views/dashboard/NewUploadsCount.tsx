'use client'
import CardStatVertical from '@/components/card-statistics/Vertical'
import { useDashboard } from '@/hooks/details/useDashboard'
import { useListAllDocuments } from '@/hooks/list/useListAllDocuments'

export const NewUploadsCount = () => {
  const { data, isSuccess, isError } = useDashboard()
  const newUploadsInYearCount = data?.newUploadsInYearCount
  const { documents } = useListAllDocuments()

  const percentageNewUploadsInYear =
    documents.length === 0 ? 0 : Math.ceil((Number(newUploadsInYearCount) / documents.length) * 100)

  const trend = percentageNewUploadsInYear > 0 ? 'positive' : percentageNewUploadsInYear < 0 ? 'negative' : 'neutral'

  console.log(trend)

  return (
    <CardStatVertical
      stats={isError ? 'Não foi possível encontrar essa informação' : newUploadsInYearCount}
      trend={trend}
      trendNumber={isSuccess ? `${percentageNewUploadsInYear}%` : '...'}
      title='Novos Arquivos'
      subtitle='Esse ano'
      avatarColor='primary'
      avatarIcon='ri-briefcase-3-line'
    />
  )
}
