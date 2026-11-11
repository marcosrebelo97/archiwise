import Image from 'next/image'

import { useRouter } from 'next/navigation'

import { Card, Tooltip } from '@mui/material'
import moment from 'moment'
import 'moment/locale/pt-br'

import { ChipCategory } from '@components/card-doc/ChipCategory'

import { IconFile } from '@components/card-doc/IconFile'

import type { UserDocument } from '@/types/project'
import { removeSubstring } from '@/app/utils/removeSubstring'
import { useUpdateMetadadoDoc } from '@/hooks/edit/useUpdateMetadadoDoc'
import { formatFileSize } from '@/utils/util'

interface IDocumentCardProps {
  documentUser: UserDocument
}

const CardDocBoard = ({ documentUser }: IDocumentCardProps) => {
  const { push } = useRouter()

  const { updateDocument } = useUpdateMetadadoDoc()

  moment.locale('pt-br')

  const goToViewDoc = (id: string) => {
    updateDocument({
      id,
      payload: {
        viewCount: documentUser.viewCount + 1
      }
    })
    push(`/arquivos/${id}`)
  }

  const previewUrl = documentUser.filePreviewPath ?? '/doc-icons/doc.png'

  return (
    <Card
      className='h-[19em] p-2 flex flex-col border rounded-2xl shadow-md '
      sx={{ width: '260px', minWidth: '260px' }}
    >
      {/* Cabeçalho do card */}
      <div className='flex items-center justify-between w-full'>
        <div className='flex items-center gap-2 pr-2 overflow-hidden text-ellipsis'>
          <IconFile documentUser={documentUser} />
          <Tooltip title={documentUser.name}>
            <div className='overflow-hidden'>
              <span className='font-semibold text-sm line-clamp-1 text-ellipsis break-words'>
                {removeSubstring(documentUser.name)}
              </span>
            </div>
          </Tooltip>
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
  )
}

export default CardDocBoard
