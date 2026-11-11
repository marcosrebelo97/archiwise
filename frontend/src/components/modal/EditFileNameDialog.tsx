'use client'

import { useEffect } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useToast } from '@/hooks/useToast'

import type { DialogProps, UserDocument } from '@/types/project'
import { createDocumentSchema } from '@/validation/createDocumentShema'
import { useUpdateMetadadoDoc } from '@/hooks/edit/useUpdateMetadadoDoc'

interface EditFileDialogProps extends DialogProps {
  document: UserDocument
}

export function EditFileNameDialog({ open, document, onClose }: EditFileDialogProps) {
  const { notify } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<{ name: string }>({
    resolver: zodResolver(createDocumentSchema)
  })

  useEffect(() => {
    if (!document) return // Evita erro caso o arquivo não seja encontrado

    setValue('name', document.name)
  }, [document, setValue])

  const { updateDocument, isPending } = useUpdateMetadadoDoc()

  function onSubmit(data: { name: string }) {
    updateDocument(
      {
        id: document.id,
        payload: {
          name: data.name
        }
      },
      {
        onSuccess: () => {
          onClose()
          notify({
            type: 'success',
            title: 'Arquivo atualizado',
            description: 'O nome do arquivo foi atualizado com sucesso.'
          })
        },
        onError: () => {
          notify({
            type: 'error',
            title: 'Erro ao atualizar arquivo',
            description: 'Ocorreu um erro ao atualizar o nome do arquivo.'
          })
        }
      }
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        root: {
          'aria-labelledby': 'dialog-title'
        },
        paper: {
          'aria-labelledby': 'dialog-title',
          role: 'form',
          component: 'form',
          onSubmit: handleSubmit(onSubmit)
        }
      }}
      fullWidth
    >
      <DialogTitle>Renomear Arquivo</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin='dense'
          id='name'
          label='Novo Nome do Arquivo'
          type='text'
          fullWidth
          variant='outlined'
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          disabled={isPending}
        />
      </DialogContent>
      <DialogActions>
        <Button color='secondary' onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button variant='contained' type='submit' disabled={isPending}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
