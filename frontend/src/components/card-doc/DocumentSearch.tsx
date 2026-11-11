import { useState } from 'react'

import Image from 'next/image'

import { useRouter } from 'next/navigation'

import { Card, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import moment from 'moment'
import 'moment/locale/pt-br'

import Grid from '@mui/material/Grid2'

import IconButton from '@mui/material/IconButton'

import { ChipCategory } from '@components/card-doc/ChipCategory'
import { removeSubstring } from '@/app/utils/removeSubstring'
import { EditFileNameDialog } from '../modal/EditFileNameDialog'
import DialogMoveDocToTrash from '../modal/DialogMoveDocToTrash'
import { downloadFile } from '@/utils/files'
import { DialogEditCategoryFromDoc } from '../modal/DialogEditCategoryFromDoc'
import type { UserDocumentSearch } from '@/services/requests/documents'
import { useUpdateMetadadoDoc } from '@/hooks/edit/useUpdateMetadadoDoc'
import { IconFile } from '@components/card-doc/IconFile'

interface IDocumentCardProps {
  documentUser: UserDocumentSearch
}

// function highlightSnippets(snippets: string[], query: string): string[] {
//   if (!query) return snippets
//
//   // Divide a busca em palavras individuais, escapando caracteres especiais para regex
//   const queryWords = query
//     .split(/\s+/) // Divide por espaços
//     .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escapa caracteres especiais de regex
//     .filter(word => word.length > 0) // Remove strings vazias
//
//   if (queryWords.length === 0) return snippets
//
//   // Cria uma expressão regular para destacar todas as palavras-chave
//   const regex = new RegExp(`(${queryWords.join('|')})`, 'gi')
//
//   // Substitui cada palavra-chave por uma versão destacada
//   return snippets.map(
//     snippet => snippet.replace(regex, '<b>$1</b>') // Adiciona a tag <mark> para destacar
//   )
// }

const DocumentSearchCard = ({ documentUser }: IDocumentCardProps) => {
  const { push } = useRouter()

  // const highlightedSnippets = highlightSnippets(documentUser.snippets, searchQuery)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false) // Estado do diálogo de edição
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
  const [openEditCategoryDialog, setOpenEditCategoryDialog] = useState<boolean>(false)

  const { updateDocument } = useUpdateMetadadoDoc()

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
    <Card className=' p-2 flex flex-row border rounded-2xl shadow-md '>
      {/* Cabeçalho do card */}
      <Grid container spacing={2} sx={{ width: '100%' }}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} sx={{ minHeight: '200px' }}>
          <Tooltip title='Visualizar Arquivo'>
            <div onClick={() => goToViewDoc(documentUser.id)} className=' relative bg-white w-full h-full'>
              <Image
                src={previewUrl}
                alt='Document Preview'
                layout='fill'
                className='rounded-md shadow w-auto h-auto'
                style={{
                  cursor: 'pointer',
                  maxHeight: '500px',
                  minHeight: '200px',
                  objectPosition: 'top',
                  objectFit: 'cover'
                }}
              />
            </div>
          </Tooltip>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 8, lg: 9 }}>
          <div>
            <div className='flex items-center justify-between w-full'>
              <Tooltip title={'Visualizar Arquivo'}>
                <div
                  onClick={() => goToViewDoc(documentUser.id)}
                  className='flex items-center gap-2 pr-2 overflow-hidden text-ellipsis  hover:cursor-pointer hover:underline'
                >
                  <IconFile documentUser={documentUser} />

                  <span className='font-semibold text-sm'>{removeSubstring(documentUser.name)}</span>
                </div>
              </Tooltip>

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

            {/* Rodapé com data e categoria */}
            <div className='flex flex-row justify-between p-1 items-center'>
              <div className='flex flex-col mt-2'>
                <span className='font-semibold mb-2 text-sm'>
                  {moment(documentUser.uploadedAt).format('D [de] MMM. [de] YYYY')}
                </span>
                <span className='font-semibold text-sm'>{(documentUser.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>

              <div className='flex items-center'>
                <ChipCategory categoryId={documentUser.categoryId} />
              </div>
            </div>
            <p dangerouslySetInnerHTML={{ __html: documentUser.snippets }} />
            {/*{highlightedSnippets.map((snippet, index) => (*/}
            {/*  <p key={index} dangerouslySetInnerHTML={{ __html: snippet }} />*/}
            {/*))}*/}
          </div>
        </Grid>
      </Grid>

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
    </Card>
  )
}

export default DocumentSearchCard
