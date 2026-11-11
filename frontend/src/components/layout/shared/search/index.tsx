'use client'

// MUI Imports
import React from 'react'

import IconButton from '@mui/material/IconButton'

// Hook Imports

import Menu from '@mui/material/Menu'

import useVerticalNav from '@menu/hooks/useVerticalNav'
import { InputNavbar } from '@components/input/InputNavbar'
import { AdvancedSearch } from '@components/input/AdvancedSearch'

const NavSearch = () => {
  // Hooks
  const { isBreakpointReached } = useVerticalNav()

  const containerRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)

  function handleClick() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  return isBreakpointReached ? (
    <>
      <div ref={containerRef}>
        <IconButton className='text-textPrimary' onClick={handleClick}>
          <i className='ri-search-line' />
        </IconButton>{' '}
      </div>

      <Menu
        sx={{ width: '100vw' }}
        id='basic-menu'
        anchorEl={containerRef.current}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
        hideBackdrop={false}
        slotProps={{
          paper: {},
          root: {
            slotProps: {
              backdrop: {
                style: {
                  backgroundColor: 'rgba(0,0,0,0.5)'
                }
              }
            }
          }
        }}
      >
        <AdvancedSearch term={''} onClose={handleClose} isFocusTerm={true} />
      </Menu>
    </>
  ) : (
    <InputNavbar />
  )
}

//
// function DialogSearch() {
//   return (
//     <Dialog
//       open={true}
//       BackdropProps={{
//         sx: { alignItems: 'flex-start' }
//       }}
//       PaperProps={{
//         sx: { mt: 5 } // Move para cima (maior o valor, mais para baixo vai)
//       }}
//     >
//       <InputNavbar />
//     </Dialog>
//   )
// }

// <div className='flex items-center cursor-pointer gap-2'>
//   <IconButton className='text-textPrimary'>
//     <i className='ri-search-line' />
//   </IconButton>
//   <div className='whitespace-nowrap select-none text-textDisabled'>Teste ⌘K</div>
// </div>
export default NavSearch
