import React, { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import type { EditCategoryFromDocType } from '@/validation/editCategoryFromDoc'
import { editCategoryFromDocument } from '@/validation/editCategoryFromDoc'

import type { DialogProps, UserDocument } from '@/types/project'
import { useListCategories } from '@/hooks/list/useListCategories'
import { LoadingButton } from '../button/LoadingButton'
import { useToast } from '@/hooks/useToast'
import { DialogNewCategory } from './DialogNewCategory'
import { useUpdateCategoryDoc } from '@/hooks/edit/useUpdateCategoryDoc'

interface Props extends DialogProps {
  document?: UserDocument
}

export function DialogEditCategoryFromDoc({ open, onClose, document }: Props) {
  const { data: categories, isLoading: isLoadingCategories } = useListCategories()
  const { notify } = useToast()
  const [categoryModalOpen, setCategoryModalOpen] = React.useState(false)

  const { updateDocument, isPending } = useUpdateCategoryDoc()

  useEffect(() => {
    if (document?.category) {
      setValue('name', document.category.name)
      setValue('categoryId', document.categoryId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { control, handleSubmit, setValue, watch } = useForm<EditCategoryFromDocType>({
    resolver: zodResolver(editCategoryFromDocument),
    defaultValues: {
      name: document?.category?.name || '',
      categoryId: document?.category?.id || ''
    }
  })

  const onSubmit = (data: EditCategoryFromDocType) => {
    if (watch('categoryId') === document?.categoryId) {
      return
    }

    updateDocument(
      {
        id: document!.id,
        payload: {
          categoryId: data.categoryId
        },
        idOldCategory: document?.categoryId
      },
      {
        onSuccess: () => {
          handleClose()
        },
        onError: () => {
          handleClose()
          notify({
            title: 'Erro',
            description: 'Erro ao editar a categoria do arquivo.',
            type: 'error'
          })
        }
      }
    )
  }

  const handleClose = () => {
    onClose()
  }

  function handleCategoryModalOpen() {
    setCategoryModalOpen(true)
  }

  function handleCategoryModalClose() {
    setCategoryModalOpen(false)
  }

  const emptyCategories = !categories || categories.length === 0

  return (
    <Dialog
      disableRestoreFocus
      open={open}
      fullWidth
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit(onSubmit)
        }
      }}
    >
      <DialogTitle>Mudar Categoria de Arquivo</DialogTitle>
      <DialogContent>
        <div className='flex flex-col gap-2 mb-2'>
          <div className='mb-2 overflow-hidden'>
            <Typography variant='body1' color='text.primary' className='text-ellipsis break-all line-clamp-1'>
              De: {document?.category?.name ?? 'Sem Categoria'}
            </Typography>
          </div>
          <div className='flex flex-col'>
            <Typography color='text.primary' variant='body1'>
              Para:
            </Typography>
            <Controller
              name='categoryId'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  getOptionKey={option => option.id}
                  options={categories ?? []}
                  className='mt-2'
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField className='mx-1' label='Categoria' variant='outlined' {...params} />
                  )}
                  noOptionsText={'Nenhuma Categoria Encontrada'}
                  loading={isLoadingCategories}
                  onChange={(_, value) => {
                    field.onChange(value?.id)
                  }}
                  disabled={isPending}
                />
              )}
            />
          </div>
          {emptyCategories && (
            <Stack direction={'row'} mt={2} gap={1} alignItems={'center'}>
              <i className='ri-information-2-line' />
              <Typography variant='body2' color='textSecondary' m={0}>
                Você não têm categorias cadastradas:
              </Typography>
              <Button sx={{ color: 'primary.main' }} className={'flex justify-start'} onClick={handleCategoryModalOpen}>
                <Typography sx={{ color: 'primary.main' }} variant='body2' color='primary' m={0}>
                  Clique aqui para criar uma nova categoria.
                </Typography>
              </Button>
            </Stack>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button color='secondary' onClick={onClose}>
          Cancelar
        </Button>
        <LoadingButton color='primary' variant='contained' type='submit' loading={isPending}>
          Mudar Categoria
        </LoadingButton>
      </DialogActions>
      <DialogNewCategory open={categoryModalOpen} onClose={handleCategoryModalClose} />
    </Dialog>
  )
}
