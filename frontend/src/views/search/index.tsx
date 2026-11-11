'use client'
import React from 'react'

import { useSearchParams } from 'next/navigation'

import { ButtonGroup, Grid2, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'

import Button from '@mui/material/Button'

import Tooltip from '@mui/material/Tooltip'

import { useSearchDocs } from '@/hooks/useSearchDocs'
import DocumentCard from '@components/card-doc/DocumentCard'
import { ContainerMessageEmpty } from '@components/container/ContainerMessageEmpty'
import { FilterType } from '@views/search/FilterType'
import { FilterDate } from '@views/search/FilterDate'
import DocumentSearchCard from '@components/card-doc/DocumentSearch'
import { SkeletonFileSearch } from '@components/skeleton/SkeletonFileSearch'

const enum TypeView {
  LIST = 'list',
  CARD = 'card'
}

export function SearchPage() {
  const [typeView, setTypeView] = React.useState<TypeView>(TypeView.LIST)
  const searchParams = useSearchParams()
  const term = searchParams.get('q') || ''

  const { data, isLoading } = useSearchDocs()
  const hasDocs = !isLoading && data && data?.length > 0
  const notHasDocs = !isLoading && data && data?.length === 0

  function handleTypeView(type: TypeView) {
    setTypeView(type)
  }

  const isViewList = typeView === TypeView.LIST

  return (
    <Stack spacing={2} className={'h-full w-full'}>
      <Typography variant={'h4'}>Resultados para: {term}</Typography>
      <Stack spacing={2} direction={'row'} justifyContent={'space-between'}>
        <div className={'flex flex-row gap-2'}>
          <FilterType />
          <FilterDate />
        </div>
        <ButtonGroup variant='contained' aria-label='Basic button group' color={'secondary'} size={'small'}>
          <Tooltip title={'Visualização em lista'}>
            <Button
              onClick={() => handleTypeView(TypeView.LIST)}
              variant={typeView === TypeView.LIST ? 'contained' : 'outlined'}
            >
              <i className='ri-file-list-line' />
            </Button>
          </Tooltip>
          <Tooltip title={'Visualização em cards'}>
            <Button
              onClick={() => handleTypeView(TypeView.CARD)}
              variant={typeView === TypeView.CARD ? 'contained' : 'outlined'}
            >
              <i className='ri-grid-line' />
            </Button>
          </Tooltip>
        </ButtonGroup>{' '}
      </Stack>

      <Grid2 container spacing={2} alignContent={'start'}>
        {hasDocs && !isViewList && data?.map(doc => <DocumentCard key={doc.id} documentUser={doc} />)}
      </Grid2>
      {isLoading && (
        <Stack spacing={2}>
          {Array.from({ length: 2 }).map((_, index) => (
            <SkeletonFileSearch key={index} />
          ))}
        </Stack>
      )}

      {hasDocs && isViewList && (
        <Stack spacing={2}>{data?.map(doc => <DocumentSearchCard key={doc.id} documentUser={doc} />)}</Stack>
      )}

      {notHasDocs && (
        <ContainerMessageEmpty
          message='Não encontramos arquivos para a sua busca'
          urlIllustration={'/images/illustrations/empty_search.svg'}
        />
      )}
    </Stack>
  )
}
