'use client'

import { useParams } from 'next/navigation'

import Link from 'next/link'

import { pdfjs } from 'react-pdf'

import { Breadcrumbs, Link as MUILink, Stack, Tooltip } from '@mui/material'

import Typography from '@mui/material/Typography'

import Box from '@mui/material/Box'

import { SkeletonFile } from '@/components/skeleton/SkeletonFile'
import { ContainerMessageEmpty } from '@/components/container/ContainerMessageEmpty'
import { useDetailsDoc } from '@/hooks/details/useDetailsDoc'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

import ViewPDFProvider from '@/contexts/ViewPDFProvider'
import { ViewPDF } from '@views/arquivos/ViewPDF'
import { IconFile } from '@components/card-doc/IconFile'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

function LoadingPage() {
  return Array.from({ length: 1 }).map((_, index) => <SkeletonFile key={index} />)
}

export default function ViewFile() {
  const { docId } = useParams<{ docId: string }>()
  const { data: document, isError, isLoading } = useDetailsDoc(docId)

  if (isLoading) return <LoadingPage />
  if (isError) return <h3 className='text-left text-red-500 pl-6'>Erro ao carregar arquivo.</h3>

  if (!document) {
    return (
      <ContainerMessageEmpty message='Arquivo não encontrado.' urlIllustration='/images/illustrations/empty_doc.svg' />
    )
  }

  const categoryName = document.category ? document.category.name : 'Sem categoria'

  return (
    <Stack direction={'column'} spacing={2} className={'h-full'}>
      <Stack spacing={2} className={'h-10'} alignItems={'center'} direction={'row'}>
        <Breadcrumbs
          aria-label='breadcrumb'
          className={'overflow-hidden'}
          sx={{
            '& .MuiBreadcrumbs-li': {
              overflow: 'hidden'
            }
          }}
        >
          <MUILink
            component={Link}
            href='/arquivos'
            sx={{ display: 'flex', alignItems: 'center', color: 'text.primary', gap: 1 }}
          >
            <i className='ri-file-line' />
            Meus arquivos
          </MUILink>
          <Typography className={'text-ellipsis overflow-hidden line-clamp-1 break-all'} sx={{ color: 'text.primary' }}>
            {document?.name}
          </Typography>
        </Breadcrumbs>
      </Stack>
      <Box className='flex items-center gap-4 w-full p-6 shadow-lg rounded-lg border overflow-hidden'>
        <IconFile documentUser={document} />
        <Tooltip title={document.name}>
          <Typography variant={'h4'} className={'text-ellipsis overflow-hidden max-w-[900px] break-all line-clamp-2'}>
            {document.name}
          </Typography>
        </Tooltip>
        <div className={'flex-1'} />
        <Tooltip title={categoryName}>
          <div
            className='text-white text-xs p-2 rounded-lg w-fit w-max-[300px] '
            style={{ backgroundColor: `${document.category ? document.category.color : 'gray'}` }}
          >
            <p className='overflow-hidden text-ellipsis line-clamp-1 break-all'>{categoryName}</p>
          </div>
        </Tooltip>
        {/*<h2 className='text-2xl font-bold text-gray-800'>{document.name}</h2>*/}
      </Box>

      {/*<iframe*/}
      {/*  src={`http://${document.fileViewPath}`}*/}
      {/*  className='w-[93%] h-[70vh] border-none shadow-lg rounded-lg mt-4'*/}
      {/*/>*/}
      <ViewPDFProvider>
        <ViewPDF urlPDF={document.fileViewPath} />
      </ViewPDFProvider>
    </Stack>
  )
}
