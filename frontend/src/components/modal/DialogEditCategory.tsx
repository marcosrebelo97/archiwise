import * as React from 'react'
import { useEffect } from 'react'

import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { MuiColorInput } from 'mui-color-input'

import { LoadingButton } from '@components/button/LoadingButton'

import type { Category, DialogProps } from '@/types/project'
import type { EditCategoryData } from '@/validation/editCategoryShema'
import { editCategorySchema } from '@/validation/editCategoryShema'
import { useEditCategory } from '@/hooks/edit/useEditCategory'
import { useToast } from '@/hooks/useToast'

interface Props extends DialogProps {
  category?: Category
}

export function DialogEditCategory({ open, onClose, category }: Props) {
  const defaultColor = category?.color ?? '#32BAFF' // Cor padrão se for nula
  const [color, setColor] = React.useState(defaultColor)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<EditCategoryData>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      color: defaultColor
    }
  })

  const { onEditCategory, isPending } = useEditCategory()
  const { notify } = useToast()

  // Atualiza o estado de cor e também o valor no formulário
  const handleChange = (newValue: string) => {
    setColor(newValue)
    setValue('color', newValue) // Atualiza o campo color no formulário
  }

  useEffect(() => {
    if (category) {
      setValue('name', category.name)
      setValue('description', category.description)
      setValue('color', category.color ?? '#32BAFF')
      setColor(category.color ?? '#32BAFF')
    }
  }, [category, setValue])

  const isLoading = isSubmitting || isPending

  const canEdit =
    watch('name') !== category?.name ||
    watch('description') !== category?.description ||
    watch('color') !== (category?.color ?? '#32BAFF')

  function onSubmit(data: EditCategoryData) {
    if (isSubmitting || isPending) return

    if (!canEdit) {
      notify({
        title: 'Nenhuma alteração realizada',
        description: 'Para editar a categoria, é necessário realizar alguma alteração.',
        type: 'info'
      })

      return
    }

    const payload = {
      ...data,
      categoryId: category!.id
    }

    onEditCategory(payload, {
      onSuccess() {
        handleClose()
      },
      onError() {
        notify({
          title: 'Erro ao editar categoria',
          description: 'Ocorreu um erro ao editar a categoria, tente novamente.',
          type: 'error'
        })
        handleClose()
      }
    })
  }

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <Dialog
      disableRestoreFocus
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit(onSubmit)
        }
      }}
      fullWidth
    >
      <DialogTitle>Editar categoria</DialogTitle>
      <DialogContent>
        <Stack marginTop={1} direction={'row'} spacing={2}>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <TextField
                autoFocus
                fullWidth
                label='Nome'
                variant='outlined'
                {...field}
                value={field.value || ''}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ mt: 2 }}
                disabled={isLoading}
              />
            )}
          />
          <MuiColorInput
            isAlphaHidden
            margin='dense'
            label={'Cor'}
            format='hex'
            value={color}
            onChange={handleChange}
            sx={{ width: '60px' }}
            disabled={isLoading}
          />
        </Stack>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <TextField
              margin='dense'
              label='Descrição'
              multiline
              rows={4}
              fullWidth
              {...field}
              value={field.value || ''}
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={isLoading}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button color={'secondary'} onClick={onClose}>
          Cancelar
        </Button>
        <LoadingButton variant={'contained'} type='submit' loading={isLoading}>
          Editar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
