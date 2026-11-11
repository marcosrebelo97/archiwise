'use client'
import React, { useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import Link from 'next/link'

import Grid from '@mui/material/Grid2'

import { Breadcrumbs, Link as MUILink, Stack } from '@mui/material'

import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'

import Menu from '@mui/material/Menu'

import MenuItem from '@mui/material/MenuItem'

import { DialogEditCategory } from '@components/modal/DialogEditCategory'
import { DialogDeleteCategory } from '@components/modal/DialogDeleteCategory'

import { SkeletonFile } from '@components/skeleton/SkeletonFile'

import DocumentCard from '@components/card-doc/DocumentCard'

import { MenuItemDanger } from '@components/menu/Menu'
import { ContainerMessageEmpty } from '@components/container/ContainerMessageEmpty'

import { useListDocumentsByCategory } from '@/hooks/list/useListDocumentsByCategory'
import { useDetailsCategory } from '@/hooks/details/useDetailsCategory'
import { useCategoriesContext } from '@/hooks/contexts/useCategoriesContext'
import { FilterType } from '@views/search/FilterType'
import { FilterDate } from '@views/search/FilterDate'

function LoadingPage() {
  return Array.from({ length: 3 }).map((_, index) => <SkeletonFile key={index} />)
}

export function ListFilesCategoryPage() {
  const { id } = useParams<{ id: string }>()

  const { data: category } = useDetailsCategory(id)
  const { data: listFiles, isLoading: isLoadingFiles } = useListDocumentsByCategory(id)
  const { categoryEdit, categoryDelete, handleEditCategory, handleDeleteCategory } = useCategoriesContext()

  const { replace } = useRouter()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  function handleDelete() {
    handleDeleteCategory(category)
    handleClose()
  }

  function handleEdit() {
    handleEditCategory(category)
    handleClose()
  }

  const showEditCategoryDialog = Boolean(categoryEdit)
  const showDeleteCategoryDialog = Boolean(categoryDelete)

  function closeEditCategoryDialog() {
    handleEditCategory(undefined)
  }

  function closeDeleteCategoryDialog() {
    handleDeleteCategory(undefined)
  }

  const hasFiles = listFiles && listFiles.length > 0
  const isLoading = isLoadingFiles && !hasFiles

  return (
    <Stack spacing={2} className={'h-full'}>
      <Stack direction='row' spacing={2} alignItems={'center'} className={'h-10'}>
        <Breadcrumbs aria-label='breadcrumb' className='overflow-hidden'>
          <MUILink
            component={Link}
            href='/categorias'
            sx={{ display: 'flex', alignItems: 'center', color: 'text.primary', gap: 1}}
          >
            <i className='ri-list-check' />
            Categorias
          </MUILink>
          <Typography sx={{ color: 'text.primary' }} className='text-ellipsis break-all line-clamp-1'>{category?.name}</Typography>
        </Breadcrumbs>
        <div className={'flex-1'} />
        <Button variant='contained' color={'secondary'} type='button' onClick={handleClick}>
          <i className='ri-more-fill' style={{ fontSize: 22 }} />
        </Button>
      </Stack>
      <div className={'flex flex-row gap-2'}>
        <FilterType />
        <FilterDate />
      </div>
      <Grid container spacing={2} alignContent={'start'}>
        {isLoading && <LoadingPage />}
        {hasFiles && listFiles?.map(file => <DocumentCard key={file.id} documentUser={file} />)}
      </Grid>
      {!hasFiles && !isLoadingFiles && (
        <ContainerMessageEmpty
          message={'Não há arquivos cadastrados nesta categoria.'}
          urlIllustration={'/images/illustrations/empty_doc.svg'}
        />
      )}
      <DialogEditCategory open={showEditCategoryDialog} onClose={closeEditCategoryDialog} category={categoryEdit} />
      <DialogDeleteCategory
        open={showDeleteCategoryDialog}
        onClose={closeDeleteCategoryDialog}
        category={categoryDelete}
        onSucessDelete={() => {
          replace('/categorias')
        }}
      />
      <Menu
        id='menu-category'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem className='gap-3 pr-8' onClick={handleEdit}>
          <i className='ri-pencil-line' />
          <Typography color='text.primary'>Editar</Typography>
        </MenuItem>
        <MenuItemDanger className='gap-3' onClick={handleDelete}>
          <i className='ri-delete-bin-line' />
          <Typography color='text.primary'>Excluir</Typography>
        </MenuItemDanger>
      </Menu>
    </Stack>
  )
}
