'use client'
import * as React from 'react'

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'

import { isAxiosError } from 'axios'

import { LoadingButton } from '@components/button/LoadingButton'

import type { Category, DialogProps } from '@/types/project'
import { useDeleteCategory } from '@/hooks/delete/useDeleteCategory'
import { useToast } from '@/hooks/useToast'

interface Props extends DialogProps {
  category?: Category
  onSucessDelete?: () => void
}

export function DialogDeleteCategory({ open, onClose, onSucessDelete, category }: Props) {
  const { onDeleteCategory, isPending } = useDeleteCategory()

  const { notify } = useToast()

  function onSubmit() {
    if (isPending) return

    onDeleteCategory(category!.id, {
      onSuccess() {
        onSucessDelete && onSucessDelete()
        notify({
          title: 'Categoria removida com sucesso',
          description: 'A categoria foi removida com sucesso.',
          type: 'success'
        })
        handleClose()
      },
      onError(error) {
        let messageError = 'Não foi possível excluir essa categoria.'

        if (isAxiosError(error) && error.response?.status === 409) {
          messageError = 'Não é possível deletar categorias com arquivos associados.'
        }

        notify({
          title: 'Erro ao excluir categoria',
          description: messageError,
          type: 'error'
        })
        handleClose()
      }
    })
  }

  function handleClose() {
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            onSubmit()
          }
        }
      }}
      fullWidth
    >
      <DialogTitle>Excluir categoria</DialogTitle>
      <DialogContent className='overflow-hidden'>
        <Typography variant='body1' gutterBottom className='line-clamp-4 break-words'>
          Deseja realmente excluir a categoria <strong>{category?.name}</strong>?<br />
          <strong> Essa ação não poderá ser desfeita.</strong>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color={'secondary'} onClick={onClose}>
          Cancelar
        </Button>
        <LoadingButton variant={'contained'} type='submit' color={'error'} loading={isPending}>
          Excluir
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
