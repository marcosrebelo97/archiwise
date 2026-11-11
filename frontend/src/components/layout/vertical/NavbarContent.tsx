// MUI Imports
// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavSearch from '@components/layout/shared/search'
import UserDropdown from '@components/layout/shared/UserDropdown'
import NavToggle from './NavToggle'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { ButtonNewFile } from '@components/layout/shared/ButtonNewFile'
import ModeDropdown from '@components/layout/shared/ModeDropdown'

const NavbarContent = () => {
  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-2 sm:gap-4 flex-1'>
        <NavToggle />
        <NavSearch />
      </div>
      <div className='flex items-center'>
        <ButtonNewFile />
        <ModeDropdown />
        {/*<Tooltip title='Informações' PopperProps={{ className: 'capitalize' }}>*/}
        {/*  <IconButton className='text-textPrimary'>*/}
        {/*    <i className='ri-information-line' />*/}
        {/*  </IconButton>*/}
        {/*</Tooltip>*/}
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
