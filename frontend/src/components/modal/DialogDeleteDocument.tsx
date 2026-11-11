import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import Button from '@mui/material/Button'

import { LoadingButton } from '@components/button/LoadingButton'

import type { DialogProps, UserDocument } from '@/types/project'

import { useToast } from '@/hooks/useToast'
import { useDeleteDocument } from '@/hooks/delete/useDeleteDocument'

interface Props extends DialogProps {
  document?: UserDocument
}

export default function DialogDeleteDocument({ document, open, onClose }: Props) {
  const { notify } = useToast()

  const { onDeleteDocument, isPending } = useDeleteDocument()

  function onSubmit() {
    if (!document) return
    onDeleteDocument(document.id, {
      onError: () => {
        notify({
          title: 'Erro ao Deletar',
          description: 'Erro ao deletar arquivo.',
          type: 'error'
        })
      },
      onSuccess: () => {
        notify({
          title: 'Sucesso ao Deletar',
          description: 'Arquivo permanentemente deletado.',
          type: 'info'
        })
        onClose()
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
      <DialogTitle>Deletar Arquivo Permanentemente</DialogTitle>
      <DialogContent className='overflow-hidden'>
        <Typography variant='body1' gutterBottom className='line-clamp-5 break-words'>
          Deseja deletar o arquivo <strong>{document?.name} permanentemente</strong>?<br />
          <strong> Essa ação não poderá ser desfeita.</strong>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color='secondary' onClick={handleClose}>
          Cancelar
        </Button>
        <LoadingButton variant='contained' color='error' type='submit' loading={isPending}>
          Deletar Permanentemente
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
