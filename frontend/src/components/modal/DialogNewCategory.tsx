import * as React from 'react'

import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { MuiColorInput } from 'mui-color-input'

import { LoadingButton } from '@components/button/LoadingButton'

import type { DialogProps } from '@/types/project'
import type { CreateCategoryData } from '@/validation/createCategoryShema'
import { createCategorySchema } from '@/validation/createCategoryShema'
import { useCreateCategory } from '@/hooks/create/useCreateCategory'

export function DialogNewCategory({ open, onClose }: DialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateCategoryData>({
    resolver: zodResolver(createCategorySchema)
  })

  const [value, setValue] = React.useState('#ffffff')

  const handleChange = (newValue: string) => {
    setValue(newValue)
  }

  const { onCreateCategory, isPending } = useCreateCategory()

  function onSubmit(data: CreateCategoryData) {
    if (isSubmitting || isPending) return
    onCreateCategory(data, {
      onSuccess() {
        handleClose()
      }
    })
  }

  function handleClose() {
    reset()
    onClose()
  }

  const isLoading = isSubmitting || isPending

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
      <DialogTitle>Nova categoria</DialogTitle>
      <DialogContent>
        <Stack marginTop={1} direction={'row'} spacing={2}>
          <TextField
            autoFocus
            required
            margin='dense'
            id='name'
            label='Nome'
            type='text'
            fullWidth
            variant='outlined'
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isLoading}
          />
          <MuiColorInput
            isAlphaHidden
            margin='dense'
            label={'Cor'}
            format='hex'
            value={value}
            {...register('color')}
            onChange={handleChange}
            sx={{ width: '60px' }}
            disabled={isLoading}
          />
        </Stack>

        <TextField margin='dense' label='Descrição' multiline rows={4} fullWidth {...register('description')}  disabled={isLoading} />
      </DialogContent>
      <DialogActions>
        <Button color={'secondary'} onClick={onClose}>
          Cancelar
        </Button>
        <LoadingButton variant={'contained'} type='submit' loading={isLoading}>
          Criar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
