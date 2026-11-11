import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import Button from '@mui/material/Button'

import { LoadingButton } from '@components/button/LoadingButton'

import type { DialogProps, UserDocument } from '@/types/project'
import { useToast } from '@/hooks/useToast'
import { useMoveDocToTrash } from '@/hooks/edit/useMoveDocToTrash'

interface Props extends DialogProps {
  document?: UserDocument
}

export default function DialogMoveDocToTrash({ document, open, onClose }: Props) {
  const { notify } = useToast()

  const { updateDocument, isPending } = useMoveDocToTrash()

  function onSubmit() {
    if (isPending) return
    if (!document) return

    updateDocument(
      {
        id: document.id,
        payload: {
          isDeleted: true
        }
      },
      {
        onSuccess: () => {
          handleClose()
          notify({
            title: 'Movido com sucesso',
            description: 'O arquivo foi movido para lixeira com sucesso.',
            type: 'success'
          })
        },
        onError: () => {
          handleClose()
          notify({
            title: 'Erro ao mover',
            description: 'Erro ao mover arquivo para a lixeira.',
            type: 'error'
          })
        }
      }
    )
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
      <DialogTitle>Mover arquivo para Lixeira</DialogTitle>
      <DialogContent className='overflow-hidden'>
        <Typography variant='body1' gutterBottom className='line-clamp-4 break-words'>
          Deseja mover o arquivo <strong>{document?.name}</strong> para a lixeira?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color='secondary' onClick={handleClose}>
          Cancelar
        </Button>
        <LoadingButton variant='contained' color='error' type='submit' loading={isPending}>
          Mover para Lixeira
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
