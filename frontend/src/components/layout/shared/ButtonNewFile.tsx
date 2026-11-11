'use client'
import * as React from 'react'

import mime from 'mime'

import { alpha, styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import type { MenuProps } from '@mui/material/Menu'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { ListItemIcon } from '@mui/material'

import { DialogNewFile } from '@components/modal/DialogNewFile'
import { useToast } from '@/hooks/useToast'

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300]
    })
  }
}))

export const filesAllowed = ['pdf', 'doc', 'docx', 'pptx', 'ppt', 'xls', 'xlsx', 'odt', 'ods', 'odp']
export const mimesAllowed = filesAllowed.map(ext => mime.getType(ext)).filter(mime => mime) as string[]

export function ButtonNewFile() {
  const { notify } = useToast()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [fileSelected, setFileSelected] = React.useState<File | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  function handleOpenFile() {
    inputRef.current?.click()
    handleClose()
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    // @ts-ignore
    const file = event.target.files?.[0] // alterei aqui ?.

    if (file) {
      if (mimesAllowed.includes(file.type)) {
        setFileSelected(file)
      } else {
        notify({
          title: 'Arquivo inválido',
          description: 'O tipo de arquivo selecionado não é permitido',
          type: 'warning'
        })
      }
    }

    event.target.value = ''
  }

  function handleCloseDialog() {
    setFileSelected(null)
  }

  const showDialog = Boolean(fileSelected)

  return (
    <div>
      <input
        ref={inputRef}
        type='file'
        accept={['.pdf', '.doc', '.docx', '.pptx', '.ppt', '.xls', '.xlsx', '.odt', '.ods', '.odp'].join(',')}
        onChange={handleFileChange}
        hidden
      />{' '}
      <Button
        id='demo-customized-button'
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        variant='contained'
        disableElevation
        onClick={handleClick}
        endIcon={<i className='ri-add-line' />}
      >
        Novo
      </Button>
      <StyledMenu
        id='demo-customized-menu'
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpenFile}>
          <ListItemIcon className='mr-2'>
            <i className='ri-file-add-line' />
          </ListItemIcon>
          Upload arquivo
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon className='mr-2'>
            <i className='ri-folder-add-line' />
          </ListItemIcon>
          Upload pasta
        </MenuItem>
      </StyledMenu>
      {showDialog && <DialogNewFile fileSelected={fileSelected} onClose={handleCloseDialog} open={showDialog} />}
    </div>
  )
}
