'use client'

import type { MouseEvent } from 'react'

// React Imports
import { useRef, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

import { useLogout } from '@/hooks/useLogout'
import { useAuthContext } from '@/hooks/contexts/useAuthContext'
import Link from '@components/Link'
import UserAvatar from '@components/mui/UserAvatar'

// Styled component for badge content
// const BadgeContentSpan = styled('span')({
//   width: 8,
//   height: 8,
//   borderRadius: '50%',
//   cursor: 'pointer',
//   backgroundColor: 'var(--mui-palette-success-main)',
//   boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
// })

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  const { onLogout, isPending } = useLogout()
  const { user } = useAuthContext()

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const router = useRouter()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(url)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const name = user?.name || ''

  return (
    <>
      <div ref={anchorRef} className='mis-2'>
        <UserAvatar
          user={{ name: name }}
          ref={anchorRef}
          alt={name}
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
        />
      </div>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-4 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className='shadow-lg'>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-4 gap-2' tabIndex={-1}>
                    <UserAvatar
                      user={{ name: name }}
                      ref={anchorRef}
                      alt={name}
                      onClick={handleDropdownOpen}
                      className=' bs-[38px] is-[38px]'
                    />{' '}
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {user?.name}
                      </Typography>
                      <Typography variant='caption'>{user?.email}</Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <Link href={'/perfil'}>
                    <MenuItem className='gap-3' onClick={e => handleDropdownClose(e)}>
                      <i className='ri-user-3-line' />
                      <Typography color='text.primary'>Meu perfil</Typography>
                    </MenuItem>
                  </Link>

                  <div className='flex items-center plb-2 pli-4'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      disabled={isPending}
                      endIcon={<i className='ri-logout-box-r-line' />}
                      onClick={() => onLogout()}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Sair
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
