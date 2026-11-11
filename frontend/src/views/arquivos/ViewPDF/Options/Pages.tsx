import { useEffect, useState } from 'react'

import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'

import { useViewPDFContext } from '@/hooks/contexts/useViewPDFContext'

export function Pages() {
  const {
    onHandleNextPage,
    onHandlePreviousPage,
    onHandlePageChange,
    pageNumber,
    numPages,
    isNextPageDisabled,
    isPreviousPageDisabled
  } = useViewPDFContext()

  const [pageNumberInput, setPageNumberInput] = useState<number>(pageNumber)

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      onHandlePageChange(pageNumberInput)
    }
  }

  function handleBlur() {
    onHandlePageChange(pageNumber)
  }

  useEffect(() => {
    setPageNumberInput(pageNumber)
  }, [pageNumber])

  return (
    <>
      <Tooltip title='Página anterior' arrow>
        <IconButton
          sx={{
            color: 'inherit'
          }}
          type={'button'}
          onClick={onHandlePreviousPage}
          disabled={isPreviousPageDisabled}
        >
          <i className='ri-arrow-up-s-line' />
        </IconButton>
      </Tooltip>
      <div className={'flex items-center gap-2'}>
        <TextField
          type='number'
          value={pageNumberInput}
          size={'small'}
          onChange={e => setPageNumberInput(Number(e.target.value))}
          onBlur={handleBlur}
          sx={{
            width: '70px',
            backgroundColor: 'white',
            borderRadius: '5px'
          }}
          onKeyDown={handleKeyDown}
        />
        /{numPages}
      </div>

      <Tooltip title='Próxima página' arrow>
        <IconButton
          sx={{
            color: 'inherit'
          }}
          type={'button'}
          onClick={onHandleNextPage}
          disabled={isNextPageDisabled}
        >
          <i className='ri-arrow-down-s-line' />
        </IconButton>
      </Tooltip>
    </>
  )
}
