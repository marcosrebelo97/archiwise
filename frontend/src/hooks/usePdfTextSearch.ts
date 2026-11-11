import { useEffect, useState } from 'react'

import { pdfjs } from 'react-pdf'

export const usePdfTextSearch = (file: string, searchString: string) => {
  const [pages, setPages] = useState<string[]>([])
  const [totalOccurrences, setTotalOccurrences] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    pdfjs.getDocument(file).promise.then(async docData => {
      const pageCount = docData._pdfInfo.numPages

      const pagePromises = Array.from({ length: pageCount }, async (_, pageNumber) => {
        const pageData = await docData.getPage(pageNumber + 1)
        const textContent = await pageData.getTextContent()

        return textContent.items.map(item => ('str' in item ? item.str : '')).join(' ')
      })

      try {
        const pagesText = await Promise.all(pagePromises)

        setPages(pagesText)
      } finally {
        setIsLoading(false)
      }
    })
  }, [file])

  useEffect(() => {
    // Se não houver termo de busca, zera a contagem
    if (!searchString || !searchString.length) {
      setTotalOccurrences(0)

      return
    }

    setIsLoading(true)

    // Cria uma regex com flag global e case-insensitive
    const regex = new RegExp(searchString, 'gi')
    let count = 0

    pages.forEach(text => {
      // Procura todas as ocorrências na página
      const matches = text.match(regex)

      if (matches) {
        count += matches.length
      }
    })

    setTotalOccurrences(count)
    setIsLoading(false)
  }, [pages, searchString])

  return [totalOccurrences, isLoading] as const
}
