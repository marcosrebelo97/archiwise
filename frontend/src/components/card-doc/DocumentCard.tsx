'use client'
import { useState } from 'react'

import Image from 'next/image'

import { useRouter } from 'next/navigation'

import { Card, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import moment from 'moment'
import 'moment/locale/pt-br'

import Grid from '@mui/material/Grid2'

import IconButton from '@mui/material/IconButton'

import { ChipCategory } from '@components/card-doc/ChipCategory'

import type { UserDocument } from '@/types/project'
import { removeSubstring } from '@/app/utils/removeSubstring'
import { EditFileNameDialog } from '../modal/EditFileNameDialog'
import DialogMoveDocToTrash from '../modal/DialogMoveDocToTrash'
import { downloadFile } from '@/utils/files'
import { DialogEditCategoryFromDoc } from '../modal/DialogEditCategoryFromDoc'
import { IconFile } from '@components/card-doc/IconFile'
import { useToast } from '@/hooks/useToast'
import { useUpdateFavoriteDoc } from '@/hooks/edit/useUpdateFavoriteDoc'
import { formatFileSize } from '@/utils/util'

interface IDocumentCardProps {
  documentUser: UserDocument
}

const DocumentCard = ({ documentUser }: IDocumentCardProps) => {
  const { push } = useRouter()
  const { notify } = useToast()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false) // Estado do diálogo de edição
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
  const [openEditCategoryDialog, setOpenEditCategoryDialog] = useState<boolean>(false)

  const { updateDocument } = useUpdateFavoriteDoc()

  const isOpen = Boolean(anchorEl)

  moment.locale('pt-br')

  const handleDropdownOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const goToViewDoc = (id: string) => {
    updateDocument({
      id,
      payload: {
        viewCount: documentUser.viewCount + 1
      }
    })
    push(`/arquivos/${id}`)
  }

  const handleChangeDocFromFavorites = () => {
    handleDropdownClose()

    if (documentUser.isFavorite) {
      updateDocument(
        {
          id: documentUser.id,
          payload: {
            isFavorite: false
          }
        },
        {
          onSuccess() {
            notify({ type: 'success', description: 'Arquivo removido dos favoritos' })
          }
        }
      )

      return
    }

    updateDocument(
      {
        id: documentUser.id,
        payload: {
          isFavorite: true
        }
      },
      {
        onSuccess() {
          notify({ type: 'success', description: 'Arquivo adicionado aos favoritos' })
        }
      }
    )
  }

  const handleEditClick = () => {
    handleDropdownClose()
    setOpenEditDialog(true)
  }

  const handleMoveToTrashClick = () => {
    handleDropdownClose()
    setOpenDeleteDialog(true)
  }

  const handleEditCategoryClick = () => {
    handleDropdownClose()
    setOpenEditCategoryDialog(true)
  }

  function handleClickDownload() {
    handleDropdownClose()
    downloadFile(documentUser.filePath, documentUser.name)
  }

  const previewUrl = documentUser.filePreviewPath ?? '/doc-icons/doc.png'

  return (
    <Grid
      size={{
        xs: 12,
        sm: 6,
        md: 4,
        lg: 3
      }}
    >
      <Card className='h-[25em] p-2 flex flex-col border rounded-2xl shadow-md '>
        {/* Cabeçalho do card */}
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-2 pr-2l overflow-hidden text-ellipsis'>
            <IconFile documentUser={documentUser} />
            <Tooltip title={removeSubstring(documentUser.name)}>
              <div className='overflow-hidden'>
                <span className='font-semibold text-sm line-clamp-1 text-ellipsis break-words'>
                  {removeSubstring(documentUser.name)}
                </span>
              </div>
            </Tooltip>
          </div>

          {/* Ícone do menu */}
          <div className='relative'>
            <IconButton onClick={handleDropdownOpen}>
              <i className='ri-more-2-line text-lg cursor-pointer' />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleDropdownClose}
              slotProps={{
                paper: {
                  className: 'shadow-lg min-w-[150px]'
                }
              }}
            >
              <MenuItem className='gap-3' onClick={handleEditClick}>
                <i className='ri-edit-line' />
                <Typography color='text.primary'>Renomear</Typography>
              </MenuItem>
              <MenuItem className='gap-3' onClick={handleChangeDocFromFavorites}>
                <i className={documentUser.isFavorite ? 'ri-star-fill' : 'ri-star-line'} />
                <Typography color='text.primary'>
                  {documentUser.isFavorite ? 'Tirar dos Favoritos' : 'Adicionar aos Favoritos'}
                </Typography>
              </MenuItem>
              <MenuItem className='gap-3' onClick={handleEditCategoryClick}>
                <i className='ri-edit-box-line' />
                <Typography color='text.primary'>Mudar Categoria</Typography>
              </MenuItem>
              <MenuItem className='gap-3' onClick={handleClickDownload}>
                <i className='ri-download-line' />
                <Typography color='text.primary'>Baixar</Typography>
              </MenuItem>
              <MenuItem className='gap-3' onClick={handleMoveToTrashClick}>
                <i className='ri-delete-bin-line text-red-500' />
                <Typography color='text.primary' className='text-red-500'>
                  Mover para lixeira
                </Typography>
              </MenuItem>
            </Menu>
          </div>
        </div>

        {/* Área de imagem */}
        <button onClick={() => goToViewDoc(documentUser.id)} className='h-[70%] w-full my-2 relative bg-white'>
          <Tooltip title='Visualizar Arquivo'>
            <Image
              src={previewUrl}
              alt='Document Preview'
              layout='fill'
              className='rounded-md shadow'
              style={{ cursor: 'pointer', objectFit: 'cover', objectPosition: 'top' }}
            />
          </Tooltip>
        </button>

        {/* Rodapé com data e categoria */}
        <div className='flex flex-row justify-between p-1 items-end'>
          <div className='flex flex-col mt-2'>
            <span className='font-semibold mb-2 text-sm'>
              {moment(documentUser.uploadedAt).format('D [de] MMM. [de] YYYY')}
            </span>
            <span className='font-semibold text-sm'>{formatFileSize(documentUser.size)}</span>
          </div>

          <div className='flex items-center'>
            <ChipCategory categoryId={documentUser.categoryId} />
          </div>
        </div>
      </Card>

      {/* Diálogo de edição */}
      <EditFileNameDialog open={openEditDialog} document={documentUser} onClose={() => setOpenEditDialog(false)} />
      <DialogMoveDocToTrash
        open={openDeleteDialog}
        document={documentUser}
        onClose={() => setOpenDeleteDialog(false)}
      />
      <DialogEditCategoryFromDoc
        open={openEditCategoryDialog}
        onClose={() => setOpenEditCategoryDialog(false)}
        document={documentUser}
      />
    </Grid>
  )
}

export default DocumentCard
