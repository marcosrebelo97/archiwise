import { useState } from 'react'

import Image from 'next/image'

import { Card, Menu, MenuItem, Tooltip, Typography } from '@mui/material'

import Grid from '@mui/material/Grid2'

import IconButton from '@mui/material/IconButton'

import type { UserDocument } from '@/types/project'
import { useToast } from '@/hooks/useToast'
import { useRestoreDoc } from '@/hooks/edit/useRestoreDoc'
import DialogDeleteDocument from '../modal/DialogDeleteDocument'
import { IconFile } from '@components/card-doc/IconFile'
import { removeSubstring } from '@/app/utils/removeSubstring'

interface Props {
  document: UserDocument
}

export const CardTrashDoc = ({ document }: Props) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)

  const { restoreDocument } = useRestoreDoc()

  const { notify } = useToast()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(anchorEl)

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const handleDropdownOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleRecoverDoc = () => {
    handleDropdownClose()
    if (!document.isDeleted) return
    restoreDocument(document.id, {
      onError: () => {
        notify({
          title: 'Falha ao resgatar o arquivo.',
          description: 'O resgate desse arquivo falhou. Tente novamente mais tarde.',
          type: 'error'
        })
      }
    })
  }

  const handleDeleteClick = () => {
    handleDropdownClose()
    setOpenDeleteDialog(true)
  }

  const previewUrl = document.filePreviewPath ?? '/doc-icons/doc.png'

  return (
    <Grid
      size={{
        xs: 12,
        sm: 6,
        md: 4,
        lg: 3
      }}
    >
      <Card className='h-[22em]  p-2 flex flex-col border rounded-2xl shadow-md '>
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-2 px-2 overflow-hidden text-ellipsis '>
            <IconFile documentUser={document} />
            <Tooltip title={removeSubstring(document.name)}>
              <div className='overflow-hidden text-ellipsis'>
                <span className='font-semibold text-sm line-clamp-1 text-ellipsis break-words'>
                  {removeSubstring(document.name)}
                </span>
              </div>
            </Tooltip>
          </div>

          <div className='relative'>
            <IconButton onClick={handleDropdownOpen}>
              <i className='ri-more-2-line text-lg cursor-pointer' />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleDropdownClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button'
              }}
            >
              <MenuItem className='gap-3' onClick={handleRecoverDoc}>
                <i className='ri-arrow-go-back-line'></i>
                <Typography color='text.primary'>Resgatar</Typography>
              </MenuItem>
              <MenuItem className='gap-3' onClick={handleDeleteClick}>
                <i className='ri-delete-bin-2-line text-red-500'></i>
                <Typography color='text.primary' className='text-red-500'>
                  Excluir Permanentemente
                </Typography>
              </MenuItem>
            </Menu>
          </div>
        </div>
        <div className='h-[80%] w-full my-2 relative'>
          <Image
            src={previewUrl}
            className='rounded-md shadow'
            layout='fill'
            alt='Document Preview'
            style={{ objectFit: 'cover', objectPosition: 'top' }}
          />
        </div>
      </Card>
      <DialogDeleteDocument
        document={document}
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false)
        }}
      />
    </Grid>
  )
}
