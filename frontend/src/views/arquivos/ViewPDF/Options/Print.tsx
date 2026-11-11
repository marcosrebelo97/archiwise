import { useState } from 'react'

import { useParams } from 'next/navigation'

import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import printJS from 'print-js'

import { useDetailsDoc } from '@/hooks/details/useDetailsDoc'

export function Print() {
  const { docId } = useParams<{ docId: string }>()

  const [isLoadingPrint, setIsLoadingPrint] = useState(false)

  const { data: document } = useDetailsDoc(docId)

  function printPDF() {
    if (!document) return
    setIsLoadingPrint(true)
    printJS({
      printable: `http://${document.fileViewPath}`, // URL do arquivo a ser impresso
      type: 'pdf', // Define que o tipo do arquivo é PDF
      onError: error => console.error('Erro ao imprimir:', error),
      onLoadingEnd: () => setIsLoadingPrint(false)
    })
  }

  return (
    <Tooltip title='Imprimir' arrow>
      <IconButton
        sx={{ color: 'inherit', display: { xs: 'none', sm: 'inline-flex' } }}
        onClick={printPDF}
        loading={isLoadingPrint}
      >
        <i className='ri-printer-line' />
      </IconButton>
    </Tooltip>
  )
}
