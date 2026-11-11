import { useEffect, useState } from 'react'

import { Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'

import { LoadingButton } from '@components/button/LoadingButton'
import { DialogNewCategory } from '@components/modal/DialogNewCategory'
import { documentsService } from '@/services/requests/documents'
import type { DialogProps } from '@/types/project'
import { useToast } from '@/hooks/useToast'
import { formatFileSize, iconTypeFile } from '@/utils/util'
import type { CreateDocumentData } from '@/validation/createDocumentShema'
import { createDocumentSchema } from '@/validation/createDocumentShema'
import { useListCategories } from '@/hooks/list/useListCategories'
import { Queries } from '@/types/queries'

interface Props extends DialogProps {
  fileSelected: File | null
}

export function DialogNewFile({ open, fileSelected, onClose }: Props) {
  const { notify } = useToast()
  const { data, isLoading: isLoadingCategories } = useListCategories()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm<CreateDocumentData>({
    resolver: zodResolver(createDocumentSchema)
  })

  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  const srcIcon = fileSelected ? iconTypeFile(fileSelected.type) : ''

  //ponto onde sobe o arquivo para o servidor.
  async function onSubmit(data: CreateDocumentData) {
    if (isSubmitting || categoryModalOpen) return
    const formData = new FormData()

    formData.append('file', fileSelected as Blob)
    formData.append('name', data.name)
    data.categoryId && formData.append('categoryId', data.categoryId)
    await documentsService
      .create(formData)
      .then(() => {
        notify({
          type: 'success',
          title: 'Arquivo criado com sucesso',
          description: 'O arquivo foi criado com sucesso.'
        })
        queryClient.invalidateQueries({
          queryKey: [Queries.LIST_ALL_DOCUMENTS]
        })
        data.categoryId &&
          queryClient.invalidateQueries({
            queryKey: [Queries.LIST_DOCUMENTS_BY_CATEGORY, data.categoryId]
          })
      })
      .catch(() => {
        notify({
          type: 'error',
          title: 'Erro ao criar arquivo',
          description: 'Ocorreu um erro ao criar o arquivo.'
        })
      })
      .finally(() => {
        onClose()
      })
  }

  useEffect(() => {
    if (fileSelected) {
      setValue('name', fileSelected.name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileSelected])

  function handleCategoryModalOpen() {
    setCategoryModalOpen(true)
  }

  function handleCategoryModalClose() {
    setCategoryModalOpen(false)
  }

  const emptyCategories = !data || data.length === 0

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit(onSubmit)
        }
      }}
      fullWidth
    >
      <DialogTitle>Novo Arquivo</DialogTitle>
      <DialogContent>
        <div className='flex flex-row gap-3 mb-2'>
          <img src={srcIcon} alt='file' className='w-10 h-10' />
          <div className='flex flex-col gap-1'>
            <Typography variant='h6'>{fileSelected?.name}</Typography>
            <Typography variant='body2'>{formatFileSize(fileSelected?.size ?? 0)}</Typography>
          </div>
        </div>
        <TextField
          autoFocus
          required
          margin='dense'
          id='name'
          label='Nome do Arquivo'
          className='mx-1'
          type='text'
          fullWidth
          variant='outlined'
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
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
        {!emptyCategories && (
          <Controller
            name='categoryId'
            control={control}
            render={({ field }) => (
              <Autocomplete
                getOptionKey={option => option.id}
                options={data ?? []}
                getOptionLabel={option => option.name}
                renderInput={params => <TextField className='mx-1' {...params} label='Categoria' variant='outlined' />}
                noOptionsText={'Nenhuma categoria encontrada'}
                loading={isLoadingCategories}
                onChange={(_, value) => {
                  field.onChange(value?.id)
                }}
              />
            )}
          />
        )}
        {!emptyCategories && (
          <Stack direction={'row'} mt={2} gap={1} alignItems={'center'}>
            <i className='ri-information-2-line' />
            <Typography variant='body2' color='textSecondary' m={0}>
              Não achou a categoria que deseja?
            </Typography>
            <Button sx={{ color: 'primary.main' }} className={'flex justify-start'} onClick={handleCategoryModalOpen}>
              <Typography sx={{ color: 'primary.main' }} variant='body2' color='primary' m={0}>
                Clique aqui para criar uma nova categoria.
              </Typography>
            </Button>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button color={'secondary'} onClick={onClose}>
          Cancelar
        </Button>
        <LoadingButton variant={'contained'} type='submit' color={'primary'} loading={isSubmitting}>
          Criar
        </LoadingButton>
      </DialogActions>
      <DialogNewCategory open={categoryModalOpen} onClose={handleCategoryModalClose} />
    </Dialog>
  )
}
