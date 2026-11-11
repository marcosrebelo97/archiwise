import React from 'react'

import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Popper from '@mui/material/Popper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'

import { CircularProgress } from '@mui/material'

import { useViewPDFContext } from '@/hooks/contexts/useViewPDFContext'

export function Search() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const {
    isLoadingSearch,
    labelSearch,

    searchString,
    onHandleSearch,

    onHandlePreviousIndexSearch,
    onHandleNextIndexSearch
  } = useViewPDFContext()

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    onHandleSearch(e.target.value)
  }

  return (
    <>
      <Tooltip title='Pesquisar' arrow>
        <IconButton
          sx={{
            color: 'inherit'
          }}
          type={'button'}
          onClick={handleClick}
        >
          <i className='ri-search-line' />
        </IconButton>
      </Tooltip>
      <Popper open={open} anchorEl={anchorEl} placement='bottom-start' className={'z-50'}>
        <ClickAwayListener onClickAway={handleClose}>
          <Paper className={'mt-2 p-3 flex flex-col gap-4'}>
            <TextField
              autoFocus
              size={'small'}
              placeholder={'Procurar'}
              value={searchString}
              onChange={handleSearch}
              slotProps={{
                input: {
                  endAdornment: !searchString ? (
                    <i className='ri-search-line' />
                  ) : isLoadingSearch ? (
                    <CircularProgress size={20} />
                  ) : (
                    labelSearch
                  )
                }
              }}
            />
            <div className={'flex flex-row gap-2 '}>
              <Tooltip title='Termo anterior' arrow>
                <IconButton
                  sx={{
                    color: 'inherit'
                  }}
                  type={'button'}
                  onClick={onHandlePreviousIndexSearch}

                  // disabled={isPreviousPageDisabled}
                >
                  <i className='ri-arrow-up-s-line' />
                </IconButton>
              </Tooltip>
              <Tooltip title='Próximo termo' arrow>
                <IconButton
                  sx={{
                    color: 'inherit'
                  }}
                  type={'button'}
                  onClick={onHandleNextIndexSearch}

                  // disabled={isNextPageDisabled}
                >
                  <i className='ri-arrow-down-s-line' />
                </IconButton>
              </Tooltip>
            </div>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  )
}
