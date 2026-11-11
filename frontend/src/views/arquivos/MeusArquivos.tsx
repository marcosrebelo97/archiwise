'use client'
import React from 'react'

import { Breadcrumbs, Grid2, Stack } from '@mui/material'

import Typography from '@mui/material/Typography'

import DocumentCard from '@/components/card-doc/DocumentCard'
import { ContainerMessageEmpty } from '@/components/container/ContainerMessageEmpty'
import { SkeletonFile } from '@/components/skeleton/SkeletonFile'
import { useListAllDocuments } from '@/hooks/list/useListAllDocuments'
import { FilterType } from '@views/search/FilterType'
import { FilterDate } from '@views/search/FilterDate'

function LoadingPage() {
  return Array.from({ length: 6 }).map((_, index) => <SkeletonFile key={index} />)
}

export default function MyFiles() {
  const { documents, isLoading, isError } = useListAllDocuments()
  const hasDocs = !isLoading && documents.length > 0
  const notHasDocs = !isLoading && documents.length === 0

  return (
    <Stack spacing={2} className={'h-full'}>
      <Stack spacing={2} className={'h-10'} alignItems={'center'} direction={'row'}>
        <Breadcrumbs aria-label='breadcrumb'>
          <Typography sx={{ display: 'flex', alignItems: 'center', color: 'text.primary', gap: 1 }}>
            <i className='ri-file-line' />
            Meus arquivos
          </Typography>
          {/*<Typography sx={{ color: 'text.primary' }}>{category?.name}</Typography>*/}
        </Breadcrumbs>
      </Stack>
      <div className={'flex flex-row gap-2'}>
        <FilterType />
        <FilterDate />
      </div>
      <Grid2 container spacing={2} className={'h-full'} alignContent={'start'}>
        {isLoading && <LoadingPage />}
        {isError && <h1>Error fetching documents :&#40;</h1>}
        {hasDocs && documents.map(doc => <DocumentCard key={doc.id} documentUser={doc} />)}
        {notHasDocs && (
          <ContainerMessageEmpty
            message='Não há arquivos listados. Quer fazer algum upload? :)'
            urlIllustration={'/images/illustrations/empty_doc.svg'}
          />
        )}
      </Grid2>
    </Stack>
  )
}
