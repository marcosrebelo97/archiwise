import React from 'react'

import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Popper from '@mui/material/Popper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'

import { useViewPDFContext } from '@/hooks/contexts/useViewPDFContext'

const valuesZoom = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4]

export function Zoom() {
  const { scaleLabel, zoom, scale, onHandleZoomChange, onZoomIn, onZoomOut } = useViewPDFContext()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  return (
    <>
      <Tooltip title='Reduzir' arrow>
        <IconButton
          sx={{
            color: 'inherit'
          }}
          onClick={onZoomOut}
        >
          <i className='ri-zoom-out-line' />
        </IconButton>
      </Tooltip>
      <Button color={'inherit'} sx={{ display: { xs: 'none', sm: 'inline-flex' } }} onClick={handleClick}>
        {scaleLabel}
        <i className='ri-arrow-down-s-fill' />
      </Button>

      <Tooltip title='Ampliar' arrow>
        <IconButton
          sx={{
            color: 'inherit'
          }}
          onClick={onZoomIn}
        >
          <i className='ri-zoom-in-line' />
        </IconButton>
      </Tooltip>
      <Popper open={open} anchorEl={anchorEl} placement='bottom-start' className={'z-50'}>
        <ClickAwayListener onClickAway={handleClose}>
          <Paper className={'mt-2 py-1'}>
            <MenuList autoFocus className={'p-0'}>
              <MenuItem
                onClick={() => {
                  onHandleZoomChange('auto')
                  handleClose()
                }}
                className={'px-3'}
                selected={zoom === 'auto'}
              >
                Original
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onHandleZoomChange('page-fit')
                  handleClose()
                }}
                className={'px-3'}
              >
                Ajustar á janela
              </MenuItem>

              <MenuItem
                onClick={() => {
                  onHandleZoomChange('page-width')
                  handleClose()
                }}
                className={'px-3'}
              >
                Largura da pagina
              </MenuItem>
              <Divider />
              {valuesZoom.map(value => (
                <MenuItem
                  key={value}
                  onClick={() => {
                    onHandleZoomChange(value)
                    handleClose()
                  }}
                  className={'px-3'}
                  selected={scale === value && zoom === 'number'}
                >
                  {value * 100}%
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  )
}
