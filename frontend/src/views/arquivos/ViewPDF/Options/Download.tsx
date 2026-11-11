import { useState } from 'react'

import { useParams } from 'next/navigation'

import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'

import { downloadFile } from '@/utils/files'

import { useDetailsDoc } from '@/hooks/details/useDetailsDoc'

export function Download() {
  const { docId } = useParams<{ docId: string }>()

  const { data: document } = useDetailsDoc(docId)
  const [isDownloading, setIsDownloading] = useState(false)

  function downloadPDF() {
    if (!document) return
    setIsDownloading(true)
    downloadFile(document.filePath, document.name)
    setIsDownloading(false)
  }

  return (
    <Tooltip title='Download' arrow>
      <IconButton
        disabled={isDownloading}
        sx={{ color: 'inherit', display: { xs: 'none', sm: 'inline-flex' } }}
        onClick={downloadPDF}
      >
        <i className='ri-download-2-line' />
      </IconButton>
    </Tooltip>
  )
}
