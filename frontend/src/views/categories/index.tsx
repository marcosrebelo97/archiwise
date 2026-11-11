'use client'
import React, { useState } from 'react'

import Grid from '@mui/material/Grid2'

import { Breadcrumbs, Stack } from '@mui/material'

import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'

import { SkeletonCategory } from '@components/skeleton/SkeletonCategory'
import { DialogNewCategory } from '@components/modal/DialogNewCategory'
import { useListCategories } from '@/hooks/list/useListCategories'
import { CardCategory } from '@components/card/CardCategory'
import { useCategoriesContext } from '@/hooks/contexts/useCategoriesContext'
import { DialogEditCategory } from '@components/modal/DialogEditCategory'
import { DialogDeleteCategory } from '@components/modal/DialogDeleteCategory'
import { ContainerMessageEmpty } from '@components/container/ContainerMessageEmpty'

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      size={{
        lg: 3,
        md: 4,
        sm: 6,
        xs: 12
      }}
    >
      {children}
    </Grid>
  )
}

function LoadingPage() {
  return Array.from({ length: 4 }).map((_, index) => (
    <Wrapper key={index}>
      <SkeletonCategory key={index} />
    </Wrapper>
  ))
}

export function CategoriesPage() {
  const { categoryEdit, categoryDelete, handleEditCategory, handleDeleteCategory } = useCategoriesContext()
  const { data: listCategories, isLoading } = useListCategories()
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false)

  const showEditCategoryDialog = Boolean(categoryEdit)
  const showDeleteCategoryDialog = Boolean(categoryDelete)

  const openNewCategoryDialog = () => {
    setShowNewCategoryDialog(true)
  }

  const closeNewCategoryDialog = () => {
    setShowNewCategoryDialog(false)
  }

  function closeEditCategoryDialog() {
    handleEditCategory(undefined)
  }

  function closeDeleteCategoryDialog() {
    handleDeleteCategory(undefined)
  }

  const hasCategories = listCategories && listCategories.length > 0

  return (
    <Stack spacing={2} className={'h-full w-full'}>
      <Stack direction='row' spacing={2} alignItems={'center'} className={'h-10'}>
        <Breadcrumbs aria-label='breadcrumb'>
          <Typography sx={{ display: 'flex', alignItems: 'center', color: 'text.primary', gap: 1 }}>
            <i className='ri-list-check' />
            Categorias
          </Typography>
        </Breadcrumbs>
        <div className={'flex-1'} />
        <Button variant='contained' color={'secondary'} onClick={openNewCategoryDialog} type='button'>
          Criar Categoria
        </Button>
      </Stack>
      <Grid container spacing={2} alignContent={'start'}>
        {isLoading && <LoadingPage />}
        {hasCategories &&
          listCategories.map(category => (
            <Wrapper key={category.id}>
              <CardCategory category={category} />
            </Wrapper>
          ))}
      </Grid>
      {!isLoading && !hasCategories && (
        <ContainerMessageEmpty
          message={'Você ainda não possui categorias cadastradas.'}
          urlIllustration={'/images/illustrations/empty_category.svg'}
        />
      )}
      <DialogNewCategory open={showNewCategoryDialog} onClose={closeNewCategoryDialog} />
      <DialogEditCategory open={showEditCategoryDialog} onClose={closeEditCategoryDialog} category={categoryEdit} />
      <DialogDeleteCategory
        open={showDeleteCategoryDialog}
        onClose={closeDeleteCategoryDialog}
        category={categoryDelete}
      />
    </Stack>
  )
}
