import React, { useEffect } from 'react'

import { useInView } from 'react-intersection-observer'
import { Page } from 'react-pdf'

import { Skeleton } from '@mui/material'

import { useViewPDFContext } from '@/hooks/contexts/useViewPDFContext'

interface PageWrapperProps {
  pageNumber: number
  containerRef: React.RefObject<HTMLDivElement>
}

export function PageWrapper({ containerRef, pageNumber }: PageWrapperProps) {
  const { ref: inViewRef, inView } = useInView({
    root: containerRef.current,

    /*
      threshold: 0 significa que qualquer parte visível aciona o observer.
      Se você quiser que pelo menos 50% da página esteja visível, use threshold: 0.5.
      Você também pode ajustar o rootMargin para afinar o "momento" em que a página é considerada no topo.
    */
    threshold: 0,
    rootMargin: '-50% 0px -50% 0px' // Ajuste para que a área de interseção seja o centro do container
  })

  const { scale, customTextRenderer, onPageLoadSuccess, registerRef, setPageNumber } = useViewPDFContext()

  useEffect(() => {
    if (inView) {
      setPageNumber(pageNumber)
    }
  }, [inView, pageNumber, setPageNumber])

  // Criamos uma função que combina a ref do useInView com o nosso registro
  function setRefs(node: HTMLElement | null) {
    // Passa o elemento para o hook para que ele monitore a visibilidade
    inViewRef(node)

    // Se o elemento existir, registra-o usando a função fornecida
    if (node) {
      registerRef(String(pageNumber), node)
    }
  }

  return (
    <div ref={setRefs}>
      <Page
        className={'mb-4'}
        pageNumber={pageNumber}
        scale={scale}
        customTextRenderer={customTextRenderer}
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
        onLoadSuccess={e => {
          if (pageNumber === 1) {
            onPageLoadSuccess(e)
          }
        }}
      />
    </div>
  )
}
