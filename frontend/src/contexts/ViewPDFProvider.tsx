'use client'
import type { ReactNode } from 'react'
import React, { useEffect, createContext, useCallback, useRef, useState } from 'react'

import { useParams } from 'next/navigation'

import type { PDFDocumentProxy } from 'pdfjs-dist'
import { useDebounce, usePinchZoom } from 'react-use'
import { ZoomState } from 'react-use/lib/usePinchZoom'

import type { TextItem } from 'pdfjs-dist/types/src/display/api'

import { usePdfTextSearch } from '@/hooks/usePdfTextSearch'
import { useDetailsDoc } from '@/hooks/details/useDetailsDoc'

export type ZoomValue = 'number' | 'page-width' | 'page-fit' | 'auto'

type ContextViewPDF = {
  containerRef: React.RefObject<HTMLDivElement>
  indexSearchSelected: number
  labelSearch: string
  numPages?: number
  pageNumber: number
  scale: number
  searchString?: string
  scaleLabel?: string
  width?: number
  zoom: ZoomValue

  customTextRenderer: any
  setNumPages: (numPages: number) => void
  setPageNumber: (pageNumber: number) => void
  onHandleSearch: (e: string) => void
  onHandlePageChange: (page: number) => void
  onHandleNextPage: () => void
  onHandleNextIndexSearch: () => void
  onHandlePreviousIndexSearch: () => void
  onHandlePreviousPage: () => void
  onHandleWidthChange: (e: number) => void
  onHandleZoomChange: (e: ZoomValue | number) => void
  onDocumentLoadSuccess: (pdf: PDFDocumentProxy) => void
  onPageLoadSuccess: (e: any) => void
  registerRef: (id: string, node: HTMLElement) => void
  onZoomIn: () => void
  onZoomOut: () => void

  isLoading: boolean
  isLoadingSearch: boolean
  isNextPageDisabled: boolean
  isPreviousPageDisabled: boolean
}

export const ViewPDFContext = createContext<ContextViewPDF>({
  containerRef: { current: null },
  indexSearchSelected: 0,
  labelSearch: '',
  pageNumber: 1,
  scale: 1,
  scaleLabel: 'Auto',
  width: undefined,
  searchString: '',
  zoom: 'page-width',

  customTextRenderer: undefined,
  onHandleSearch: () => {},
  setNumPages: () => {},
  setPageNumber: () => {},
  onHandleNextPage: () => {},
  onHandlePageChange: () => {},
  onHandlePreviousPage: () => {},
  onHandleNextIndexSearch: () => {},
  onHandlePreviousIndexSearch: () => {},
  onDocumentLoadSuccess: () => {},
  onHandleWidthChange: () => {},
  onHandleZoomChange: () => {},
  onPageLoadSuccess: () => {},
  onZoomIn: () => {},
  onZoomOut: () => {},
  registerRef: () => {},

  isLoading: false,
  isLoadingSearch: false,
  isNextPageDisabled: false,
  isPreviousPageDisabled: false
})

interface ViewPDFProviderProps {
  children: ReactNode
}
const MIN_SCALE = 0.5
const MAX_SCALE = 3.0
const SCALE_STEP = 0.2

function highlightPattern(text: string, pattern: string, actualIndex: number, setActualIndex: any) {
  const splitText = text.split(pattern)

  if (splitText.length <= 1 || !pattern) {
    return text
  }

  const matches = text.match(pattern)

  if (!matches) {
    return text
  }

  const result = splitText
    .reduce<
      string[]
    >((arr, element, index) => (matches[index] ? [...arr, element, `<mark id=search-pdf-${actualIndex} key=${actualIndex}>${matches[index]}</mark>`] : [...arr, element]), [])
    .join('')

  setActualIndex(actualIndex + 1)

  return result
}

export default function ViewPDFProvider({ children }: ViewPDFProviderProps) {
  const { docId } = useParams<{ docId: string }>()
  const { data: documentFile } = useDetailsDoc(docId)

  const containerRef = useRef<HTMLDivElement>(null)
  const refsPages = useRef<Record<string, HTMLElement>>({})

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1)
  const [zoom, setZoom] = useState<ZoomValue>('page-width')

  const [height, setHeight] = useState<number>()
  const [width, setWidth] = useState<number>()

  const [searchString, setSearchString] = useState<string>('')
  const [debouncedSearchString, setDebouncedSearchString] = useState<string>('')
  const [indexSearchSelected, setIndexSearchSelected] = useState<number>(-1)
  const [actualIndex, setActualIndex] = useState(0)

  const urlPDF = documentFile?.fileViewPath || ''

  const [searchResults, isLoadingSearch] = usePdfTextSearch(urlPDF, debouncedSearchString)
  const { zoomingState } = usePinchZoom(containerRef)

  const customTextRenderer: any = useCallback(
    (textItem: { pageIndex: number; pageNumber: number; itemIndex: number } & TextItem) => {
      if (!textItem) return null

      return highlightPattern(textItem.str, debouncedSearchString, actualIndex, setActualIndex)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearchString]
  )

  useDebounce(
    () => {
      setDebouncedSearchString(searchString)
      setActualIndex(0)
      setIndexSearchSelected(-1)
      setTimeout(() => {
        const teste = document.getElementById('search-pdf-0')

        if (teste) {
          teste.scrollIntoView({ behavior: 'smooth', block: 'center' })
          setIndexSearchSelected(0)
        }
      }, 1000)
    },
    1000,
    [searchString]
  )

  const labelSearch = `${indexSearchSelected + 1}/${searchResults}`

  function onHandleNextIndexSearch() {
    if (indexSearchSelected === searchResults - 1) return

    setIndexSearchSelected(indexSearchSelected + 1)
    const teste = document.getElementById(`search-pdf-${indexSearchSelected + 1}`)

    if (teste) {
      teste.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  function onHandlePreviousIndexSearch() {
    if (indexSearchSelected === 0) return

    setIndexSearchSelected(indexSearchSelected - 1)
    const teste = document.getElementById(`search-pdf-${indexSearchSelected - 1}`)

    if (teste) {
      teste.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // Função para registrar a ref de cada opção
  function registerRef(id: string, node: HTMLElement) {
    refsPages.current[id] = node
  }

  // Função para rolar a página até a opção selecionada
  function scrollToOption(id: string) {
    const node = refsPages.current[id]

    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  function zoomIn() {
    setZoom('number')
    setScale(prev => Math.min(prev + SCALE_STEP, MAX_SCALE))
  }

  function zoomOut() {
    setZoom('number')
    setScale(prev => Math.max(prev - SCALE_STEP, MIN_SCALE))
  }

  useEffect(() => {
    onHandleZoomChange('page-width')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width])
  useEffect(() => {
    if (zoomingState === ZoomState.ZOOMING_IN) {
      // perform zoom in scaling
      setScale(scale + 0.1)
    } else if (zoomingState === ZoomState.ZOOMING_OUT) {
      // perform zoom out in scaling
      setScale(scale - 0.1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomingState])

  useEffect(() => {
    const container = containerRef.current

    if (!container || !document) return

    // Função para tratar eventos de teclado
    function handleKeyDown(e: KeyboardEvent) {
      // Só processa se o container estiver ativo (focado)

      if (document.activeElement !== container) return

      if (e.key) {
        // Em alguns teclados, ao pressionar Ctrl +, o valor de e.key pode ser "="
        if (e.key === '+' || e.key === '=') {
          e.preventDefault()
          zoomIn()
        } else if (e.key === '-') {
          e.preventDefault()
          zoomOut()
        }
      }
    }

    // Função para tratar eventos de roda do mouse
    function handleWheel(e: WheelEvent) {
      // Só processa se o container estiver ativo (focado)
      if (document.activeElement !== container) return

      if (e.ctrlKey) {
        e.preventDefault() // Impede o zoom padrão do navegador

        if (e.deltaY < 0) {
          zoomIn()
        } else if (e.deltaY > 0) {
          zoomOut()
        }
      }
    }

    // Adiciona os event listeners diretamente no container
    container.addEventListener('keydown', handleKeyDown)
    container.addEventListener('wheel', handleWheel, { passive: false })

    // Remove os listeners ao desmontar o componente
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      container.removeEventListener('wheel', handleWheel)
    }
  }, [containerRef])

  function onHandleWidthChange(e: number) {
    if (Boolean(width)) return
    setWidth(e)
  }

  function onHandlePageChange(page: number) {
    if (page < 1) setPageNumber(1)
    if (numPages && page > numPages) setPageNumber(numPages)

    scrollToOption(String(page))

    setPageNumber(page)
  }

  function onHandleNextPage() {
    onHandlePageChange(pageNumber + 1)
  }

  function onHandlePreviousPage() {
    onHandlePageChange(pageNumber - 1)
  }

  function onHandleSearch(e: string) {
    setSearchString(e)
  }

  function onDocumentLoadSuccess(pdf: PDFDocumentProxy): void {
    const { numPages } = pdf

    setIsLoading(false)
    setNumPages(numPages)
  }

  function onPageLoadSuccess(e: any) {
    if (height || width) return
    setHeight(e.getViewport({ scale }).height)
    setWidth(e.getViewport({ scale }).width)
  }

  function onHandleZoomChange(e: ZoomValue | number) {
    if (typeof e === 'number') {
      setZoom('number')
      setScale(e)

      return
    }

    setZoom(e)

    if (e === 'auto') {
      setScale(1)
    }

    if (e === 'page-width') {
      const widthContainer = containerRef.current?.clientWidth
      const widthPdf = width

      if (widthContainer && widthPdf) {
        const newScale = widthContainer / widthPdf

        setScale(newScale)
      }
    }

    if (e === 'page-fit') {
      const heightContainer = containerRef.current?.clientHeight
      const heightPdf = height

      if (heightContainer && heightPdf) {
        const newScale = heightContainer / heightPdf

        setScale(newScale - 0.1)
      }
    }
  }

  function getScaleLabel() {
    if (zoom === 'number') {
      return `${Math.round(scale * 100)}%`
    }

    if (zoom === 'auto') {
      return 'Original'
    }

    if (zoom === 'page-width') {
      return 'Largura da página'
    }

    if (zoom === 'page-fit') {
      return 'Página inteira'
    }

    return 'Auto'
  }

  const isNextPageDisabled = pageNumber === numPages
  const isPreviousPageDisabled = pageNumber === 1
  const scaleLabel = getScaleLabel()

  return (
    <ViewPDFContext.Provider
      value={{
        containerRef,
        indexSearchSelected,
        labelSearch,
        numPages,
        pageNumber,
        scale,
        scaleLabel,
        searchString,
        width,
        zoom,
        customTextRenderer,
        onHandleSearch,
        onHandleWidthChange,
        setNumPages,
        setPageNumber,
        onHandleNextPage,
        onHandlePageChange,
        onHandleNextIndexSearch,
        onHandlePreviousIndexSearch,
        onHandlePreviousPage,
        onHandleZoomChange,
        onDocumentLoadSuccess,
        onPageLoadSuccess,
        onZoomIn: zoomIn,
        onZoomOut: zoomOut,
        registerRef,

        isLoading,
        isLoadingSearch,
        isNextPageDisabled,
        isPreviousPageDisabled
      }}
    >
      {children}
    </ViewPDFContext.Provider>
  )
}
