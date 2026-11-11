import { useState } from 'react'

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import { ListItemIcon, ListItemText } from '@mui/material'

import { useViewPDFContext } from '@/hooks/contexts/useViewPDFContext'

export function MoreOptions() {
  const { numPages, onHandlePageChange } = useViewPDFContext()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  function handleFirstPage() {
    onHandlePageChange(1)
    handleClose()
  }

  function handleLastPage() {
    onHandlePageChange(numPages || 1)
    handleClose()
  }

  return (
    <>
      <Tooltip title='Opções' arrow>
        <IconButton
          sx={{
            color: 'inherit'
          }}
          onClick={handleClick}
        >
          <i className='ri-more-2-fill'></i>
        </IconButton>
      </Tooltip>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuItem onClick={handleFirstPage}>
          <ListItemIcon className={'mr-2'}>
            <i className='ri-arrow-up-double-line' />{' '}
          </ListItemIcon>
          <ListItemText>Início</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLastPage}>
          <ListItemIcon className={'mr-2'}>
            <i className='ri-arrow-down-double-fill' />{' '}
          </ListItemIcon>
          <ListItemText>Fim</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon className={'mr-2'}>
            <i className='ri-information-2-line' />
          </ListItemIcon>
          <ListItemText>Propriedades</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
