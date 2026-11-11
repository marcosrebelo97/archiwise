'use client'
import React from 'react'

import { Breadcrumbs, Grid2, Stack } from '@mui/material'

import Typography from '@mui/material/Typography'

import { ContainerMessageEmpty } from '@/components/container/ContainerMessageEmpty'
import { SkeletonFile } from '@/components/skeleton/SkeletonFile'
import DocumentCard from '@/components/card-doc/DocumentCard'
import { useListFavoriteDocs } from '@/hooks/list/useListFavoriteDocuments'
import { FilterType } from '@views/search/FilterType'
import { FilterDate } from '@views/search/FilterDate'

function LoadingPage() {
  return Array.from({ length: 1 }).map((_, index) => <SkeletonFile key={index} />)
}

interface WrapperProps {
  children: React.ReactNode
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <Stack spacing={2} className={'h-full'}>
      <Stack spacing={2} className={'h-10'} alignItems={'center'} direction={'row'}>
        <Breadcrumbs aria-label='breadcrumb'>
          <Typography sx={{ display: 'flex', alignItems: 'center', color: 'text.primary', gap: 1 }}>
            <i className='ri-star-line' />
            Favoritos
          </Typography>
        </Breadcrumbs>
      </Stack>
      <div className={'flex flex-row gap-2'}>
        <FilterType />
        <FilterDate />
      </div>
      <Grid2 container spacing={2} className={'h-full'} alignContent={'start'}>
        {children}
      </Grid2>
    </Stack>
  )
}

export default function FavoriteFiles() {
  const { documents, isLoading, isError } = useListFavoriteDocs()

  const hasDocs = !isLoading && documents.length > 0
  const notHasDocs = !isLoading && documents.length === 0

  return (
    <Wrapper>
      {isLoading && <LoadingPage />}
      {isError && <h1>Error fetching documents :&#40;</h1>}
      {notHasDocs && (
        <ContainerMessageEmpty
          message='Não há arquivos favoritados.'
          urlIllustration='/images/illustrations/empty_favorite_list.svg'
        />
      )}
      {hasDocs && documents.map(document => <DocumentCard key={document.id} documentUser={document} />)}
    </Wrapper>
  )
}
