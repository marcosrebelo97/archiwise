import Box from '@mui/material/Box'
import { Document } from 'react-pdf'

import { Skeleton } from '@mui/material'

import { useViewPDFContext } from '@/hooks/contexts/useViewPDFContext'
import { ToolbarPDF } from '@views/arquivos/ViewPDF/Toolbar'
import { PageWrapper } from '@views/arquivos/ViewPDF/PageWrapper'

interface Props {
  urlPDF: string
}

export function ViewPDF({ urlPDF }: Props) {
  const { containerRef, numPages, onDocumentLoadSuccess } = useViewPDFContext()

  return (
    <Box
      tabIndex={0} // Torna o container focável
      ref={containerRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: 'secondary.mainOpacity',
        maxHeight: '100vh',
        minHeight: '200px',
        flex: 1
      }}
      className={'rounded-lg '}
    >
      <ToolbarPDF />
      <div className={'w-full h-full flex overflow-auto pb-8'}>
        <Document
          file={urlPDF}
          loading={
            <Skeleton
              variant='rectangular'
              sx={{
                width: {
                  xs: '90%',
                  sm: '90%',
                  md: '50%',
                  lg: '50%'
                },
                height: {
                  xs: '700px',
                  sm: '700px',
                  md: '1000px',
                  lg: '1000px'
                }
              }}
            />
          }
          onLoadSuccess={onDocumentLoadSuccess}
          className={'items-center overflow-visible p-3 h-full w-auto mx-auto my-4 mb-4'}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <PageWrapper key={`page_${index + 1}`} pageNumber={index + 1} containerRef={containerRef} />
          ))}
        </Document>
      </div>
    </Box>
  )
}
