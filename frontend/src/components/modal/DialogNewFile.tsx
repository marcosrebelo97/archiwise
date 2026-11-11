import * as React from 'react'
import { useEffect } from 'react'

import { Autocomplete, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { useQueryClient } from '@tanstack/react-query'

import { LoadingButton } from '@components/button/LoadingButton'

import { IconFile } from '@components/card-doc/IconFile'

import { DialogNewCategory } from '@components/modal/DialogNewCategory'

import { documentsService } from '@/services/requests/documents'
import type { Category, DialogProps, UserDocument } from '@/types/project'
import { useToast } from '@/hooks/useToast'
import { formatFileSize } from '@/utils/util'

import type { CreateDocumentData } from '@/validation/createDocumentShema'
import { createDocumentSchema } from '@/validation/createDocumentShema'
import { useListCategories } from '@/hooks/list/useListCategories'

import { Queries } from '@/types/queries'

import { useAuthContext } from '@/hooks/contexts/useAuthContext'
import { addDocumentToList } from '@/hooks/edit/useUpdateMetadadoDoc'

interface Props extends DialogProps {
  fileSelected: File | null
}

export function DialogNewFile({ open, fileSelected, onClose }: Props) {
  const { notify } = useToast()
  const { data: listCategories, isLoading: isLoadingCategories } = useListCategories()
  const queryClient = useQueryClient()
  const { user } = useAuthContext()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm<CreateDocumentData>({
    resolver: zodResolver(createDocumentSchema)
  })

  const [categoryModalOpen, setCategoryModalOpen] = React.useState(false)

  const [classifiedCategory, setClassifiedCategory] = React.useState<Category | null>(null)
  const [isClassifying, setIsClassifying] = React.useState(listCategories !== undefined && listCategories.length > 0)

  const [progress, setProgress] = React.useState(10)

  function CircularProgressWithLabel(props: { value: number }) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant='determinate' {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant='caption' component='div' sx={{ color: 'text.secondary' }}>
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    )
  }

  async function classifyFile() {
    if (!fileSelected) return

    setIsClassifying(true)

    setProgress(0)

    const formData = new FormData()

    formData.append('file', fileSelected)
    formData.append('userId', user?.id ?? '')

    listCategories &&
      listCategories.forEach(category => {
        formData.append('categorias', category.name)
      })

    try {
      const urlFetch = `${process.env.NEXT_PUBLIC_CAT_API_URL}/classificar`

      const response = await fetch(urlFetch, {
        cache: 'force-cache',
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Erro ao classificar arquivo')
      }

      // Simulação de progresso gradual
      for (let i = 0; i <= 100; i += 10) {
        setProgress(prev => Math.min(prev + 10, 100))
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      const result = await response.json()

      console.log('Categoria:', result.categoria)
      const matchedCategory = listCategories?.find(category => category.name === result.categoria)

      console.log('Matched:', matchedCategory)

      if (matchedCategory) {
        setValue('categoryId', matchedCategory.id)
        setClassifiedCategory(matchedCategory)
      } else {
        setClassifiedCategory(null)
      }
    } catch (error) {
      console.error('Erro:', error)
      notify({
        type: 'error',
        title: 'Erro ao classificar arquivo',
        description: 'Ocorreu um erro ao classificar o arquivo.'
      })
    } finally {
      setIsClassifying(false)
      setProgress(100)
    }
  }

  async function onSubmit(data: CreateDocumentData) {
    if (isSubmitting || categoryModalOpen) return
    const formData = new FormData()

    formData.append('file', fileSelected as Blob)
    formData.append('name', data.name)
    data.categoryId && formData.append('categoryId', data.categoryId)
    await documentsService
      .create(formData)
      .then(res => {
        notify({
          type: 'success',
          title: 'Arquivo criado com sucesso',
          description: 'O arquivo foi criado com sucesso.'
        })

        if (res.data) {
          const { data } = res

          queryClient.setQueriesData<UserDocument[]>(
            {
              queryKey: [Queries.LIST_ALL_DOCUMENTS]
            },
            (oldData: any) => addDocumentToList(oldData, data)
          )

          if (data.categoryId) {
            queryClient.setQueriesData<UserDocument[]>(
              { queryKey: [Queries.LIST_DOCUMENTS_BY_CATEGORY, data.categoryId] },
              (oldData: any) => addDocumentToList(oldData, data)
            )
          }
        }

        queryClient.invalidateQueries({ queryKey: [Queries.DETAILS_DASHBOARD] });
      })
      .catch(() => {
        notify({
          type: 'error',
          title: 'Erro ao criar arquivo',
          description: 'Ocorreu um erro ao criar o arquivo selecionado.'
        })
      })
      .finally(() => {
        classifiedCategory && setClassifiedCategory(null)
        onClose()
      })
  }

  function handleCategoryModalOpen() {
    setCategoryModalOpen(true)
  }

  function handleCategoryModalClose() {
    setCategoryModalOpen(false)
  }

  useEffect(() => {
    if (fileSelected) {
      setValue('name', fileSelected.name)
      listCategories !== undefined && listCategories.length && classifyFile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileSelected])

  const emptyCategories = !listCategories || listCategories.length === 0

  const messageUser = emptyCategories
    ? 'Você não possui categorias cadastradas. Por favor, crie uma nova categoria.'
    : 'Não encontramos uma categoria correspondente ao arquivo. Por favor, selecione uma categoria existente ou\n'

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose()
        classifiedCategory && setClassifiedCategory(null)
      }}
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
          {fileSelected && <IconFile documentUser={fileSelected} />}
          <div className='flex flex-col gap-1'>
            <Typography variant='h6'>{fileSelected?.name}</Typography>
            <Typography variant='body2'>{formatFileSize(fileSelected?.size ?? 0)}</Typography>
          </div>
        </div>
        {/* Exibir indicador de progresso durante a classificação */}
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
          disabled={isSubmitting}
        />
        {isClassifying && (
          <Stack direction='row' alignItems='center' justifyContent='start' spacing={2} mt={2}>
            <CircularProgressWithLabel value={progress} />
            <Typography variant='body2'>Classificando arquivo...</Typography>
          </Stack>
        )}

        {/* Exibir categoria classificada */}
        {classifiedCategory && (
          <TextField
            margin='dense'
            id='classified-category'
            label='Categoria Classificada'
            value={classifiedCategory.name}
            fullWidth
            variant='outlined'
            InputProps={{
              readOnly: true
            }}
            className='mx-1'
            disabled={isSubmitting}
          />
        )}
        {!classifiedCategory && !isClassifying && (
          <>
            {!emptyCategories && (
              <Controller
                name='categoryId'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    getOptionKey={option => option.id}
                    options={listCategories ?? []}
                    getOptionLabel={option => option.name}
                    renderInput={params => (
                      <TextField className='mx-1' {...params} label='Categorias' variant='outlined' disabled={isSubmitting} />
                    )}
                    noOptionsText={'Nenhuma categoria encontrada'}
                    loading={isLoadingCategories}
                    disableClearable
                    onChange={(_, value) => {
                      field.onChange(value?.id)
                    }}
                    disabled={isSubmitting}
                  />
                )}
              />
            )}
            <Stack direction={'row'} mt={2} gap={1} alignItems={'center'}>
              <i className='ri-information-2-line' />
              <Typography variant='body2' color='textSecondary' m={0}>
                {messageUser}
              </Typography>
              <Button sx={{ color: 'primary.main' }} className={'flex justify-start'} onClick={handleCategoryModalOpen}>
                <Typography sx={{ color: 'primary.main' }} variant='body2' color='primary' m={0}>
                  Clique aqui para criar uma nova categoria.
                </Typography>
              </Button>
            </Stack>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button color={'secondary'} onClick={onClose}>
          Cancelar
        </Button>
        <LoadingButton variant={'contained'} type='submit' color={'primary'} loading={isSubmitting}>
          Enviar
        </LoadingButton>
      </DialogActions>
      <DialogNewCategory open={categoryModalOpen} onClose={handleCategoryModalClose} />
    </Dialog>
  )
}
