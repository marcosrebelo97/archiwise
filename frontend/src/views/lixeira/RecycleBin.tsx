'use client'
import React from 'react'

import { Breadcrumbs, Grid2, Stack } from '@mui/material'

import Typography from '@mui/material/Typography'

import { CardTrashDoc } from '@/components/card-doc/CardTrashDoc'
import { ContainerMessageEmpty } from '@/components/container/ContainerMessageEmpty'
import { SkeletonFile } from '@/components/skeleton/SkeletonFile'
import { useListDocsTrash } from '@/hooks/list/useListDocsTrash'

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
            <i className='ri-delete-bin-6-line' />
            Lixeira
          </Typography>
        </Breadcrumbs>
      </Stack>

      <Grid2 container spacing={2} className={'h-full'} alignContent={'start'}>
        {children}
      </Grid2>
    </Stack>
  )
}

export default function RecycleBin() {
  const { documents, isLoading, isError } = useListDocsTrash()

  const hasDocs = !isLoading && documents.length > 0
  const notHasDocs = !isLoading && documents.length === 0

  return (
    <Wrapper>
      {isLoading && <LoadingPage />}
      {isError && <h1>Error fetching documents :&#40;</h1>}
      {notHasDocs && (
        <ContainerMessageEmpty
          message='A lixeira está vazia.'
          urlIllustration='/images/illustrations/empty_trash.svg'
        />
      )}
      {hasDocs && documents.map(document => <CardTrashDoc key={document.id} document={document} />)}
    </Wrapper>
  )
}
