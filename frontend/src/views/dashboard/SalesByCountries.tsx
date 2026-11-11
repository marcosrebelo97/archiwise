'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Third-party Imports
// Type Imports

// Components Imports
import { useListAllDocuments } from '@/hooks/list/useListAllDocuments'
import CardDocBoard from '@/components/card-doc/CardDocBoard'
import Link from '@/components/Link'
import { SkeletonFileDash } from '@components/skeleton/SkeletonFileDash'

//
// type DataType = {
//   avatarLabel: string
//   avatarColor?: ThemeColor
//   title: string
//   subtitle: string
//   sales: string
//   trend: 'up' | 'down'
//   trendPercentage: string
// }

const MostViewdDocs = () => {
  const { documents, isLoading } = useListAllDocuments()

  const documentsWithViewCount = documents.filter(doc => doc.viewCount > 0)
  const documentsSort = [...documents].sort((docA, docB) => docB.viewCount - docA.viewCount)
  const hasDocsWithViewCount = documentsWithViewCount.length > 0
  const hasDocs = documents.length > 0

  return (
    <Card
      sx={{
        height: '100%'
      }}
    >
      <CardHeader
        title='Arquivos mais acessados'
        action={
          <Link href='/arquivos'>
            <Typography sx={{ color: '#EF8354' }}>Ver todos</Typography>
          </Link>
        }
      />
      <CardContent className={'overflow-x-auto'}>
        <div className={'flex flex-row gap-4 w-full '}>
          {isLoading && <SkeletonFileDash />}
          {hasDocsWithViewCount &&
            !isLoading &&
            documentsSort.slice(0, 3).map(doc => {
              return <CardDocBoard key={doc.id} documentUser={doc} />
            })}
          {!hasDocsWithViewCount && !hasDocs && !isLoading && (
            <Typography variant='h6' color='text.primary'>
              Não há arquivos listados.
            </Typography>
          )}
          {!hasDocsWithViewCount && hasDocs && !isLoading && (
            <Typography variant='h6' color='text.primary'>
              Sem registro de visualização de arquivos.
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default MostViewdDocs
