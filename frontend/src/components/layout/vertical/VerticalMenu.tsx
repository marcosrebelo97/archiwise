// MUI Imports
import React, { useState } from 'react'

import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import IconButton from '@mui/material/IconButton'

import Tooltip from '@mui/material/Tooltip'

import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { DialogNewCategory } from '@components/modal/DialogNewCategory'
import ChevronRight from '@menu/svg/ChevronRight'
import { useSettings } from '@core/hooks/useSettings'
import { useListCategories } from '@/hooks/list/useListCategories'
import { Circle } from '@components/cicle'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: { scrollMenu: (container: any, isPerfectScrollbar: boolean) => void }) => {
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false)

  // Hooks
  const theme = useTheme()
  const { data } = useListCategories()
  const { isBreakpointReached, transitionDuration } = useVerticalNav()
  const { openSidebarCategories, handleSidebarCategories } = useSettings()
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  function openNewCategoryDialog(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation()
    setShowNewCategoryDialog(true)
  }

  function closeNewCategoryDialog() {
    setShowNewCategoryDialog(false)
  }

  const tooltipOpenCategory = openSidebarCategories ? 'Fechar categorias' : 'Abrir categorias'
  const listCategories = data || []

  const color = '#32BAFF'

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        menuItemStyles={menuItemStyles(theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        <MenuItem href='/' icon={<i className='ri-home-smile-line' />}>
          Dashboard
        </MenuItem>
        <MenuItem href='/arquivos' icon={<i className='ri-file-line' />} exactMatch={false} activeUrl='/arquivos'>
          Meus arquivos
        </MenuItem>
        <MenuItem
          href='/categorias'
          icon={<i className='ri-list-check' />}
          suffix={
            <div className={'flex flex-row'} onClick={e => e.stopPropagation()}>
              <Tooltip title='Adicionar nova categoria'>
                <IconButton
                  onClick={e => {
                    e.stopPropagation()
                    e.preventDefault()
                    openNewCategoryDialog(e)
                  }}
                  sx={{ color: 'inherit' }}
                >
                  <i className='ri-add-line' style={{ color: 'inherit' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={tooltipOpenCategory}>
                <IconButton
                  sx={{ color: 'inherit' }}
                  onClick={e => {
                    e.stopPropagation()
                    e.preventDefault()
                    handleSidebarCategories()
                  }}
                >
                  <StyledVerticalNavExpandIcon open={openSidebarCategories} transitionDuration={transitionDuration}>
                    <ChevronRight fontSize='1rem' style={{ color: 'inherit' }} />
                  </StyledVerticalNavExpandIcon>
                </IconButton>
              </Tooltip>
            </div>
          }
        >
          Categorias
        </MenuItem>
        {openSidebarCategories &&
          listCategories.map(category => (
            <MenuItem
              key={category.id}
              href={`/categorias/${category.id}`}
              icon={<Circle color={category.color ? category.color : color} size={22} />}
            >
              {category.name}
            </MenuItem>
          ))}
        <MenuItem href='/favoritos' icon={<i className='ri-star-line' />}>
          Favoritos
        </MenuItem>
        <MenuItem href='/lixeira' icon={<i className='ri-delete-bin-6-line' />}>
          Lixeira
        </MenuItem>
        {/*<SubMenu*/}
        {/*  href='/categorias'*/}
        {/*  label='Categorias'*/}
        {/*  icon={<i className='ri-list-check' />}*/}
        {/*  suffix={*/}
        {/*    <div className={'flex flex-row gap-4'}>*/}
        {/*      <Tooltip title='Adicionar nova categoria' onClick={e => e.stopPropagation()}>*/}
        {/*        <IconButton*/}
        {/*          onClick={e => {*/}
        {/*            e.stopPropagation()*/}
        {/*            openNewCategoryDialog(e)*/}
        {/*          }}*/}
        {/*        >*/}
        {/*          <i className='ri-add-line' />*/}
        {/*        </IconButton>*/}
        {/*      </Tooltip>*/}

        {/*      <StyledVerticalNavExpandIcon open={true} transitionDuration={transitionDuration}>*/}
        {/*        <ChevronRight fontSize='1rem' />*/}
        {/*      </StyledVerticalNavExpandIcon>*/}
        {/*    </div>*/}
        {/*  }*/}
        {/*>*/}
        {/*  <MenuItem href={`${process.env.NEXT_PUBLIC_PRO_URL}/front-pages/landing-page`} target='_blank'>*/}
        {/*    Landing*/}
        {/*  </MenuItem>*/}
        {/*  <MenuItem href={`${process.env.NEXT_PUBLIC_PRO_URL}/front-pages/pricing`} target='_blank'>*/}
        {/*    Pricing*/}
        {/*  </MenuItem>*/}
        {/*  <MenuItem href={`${process.env.NEXT_PUBLIC_PRO_URL}/front-pages/payment`} target='_blank'>*/}
        {/*    Payment*/}
        {/*  </MenuItem>*/}
        {/*  <MenuItem href={`${process.env.NEXT_PUBLIC_PRO_URL}/front-pages/checkout`} target='_blank'>*/}
        {/*    Checkout*/}
        {/*  </MenuItem>*/}
        {/*  <MenuItem href={`${process.env.NEXT_PUBLIC_PRO_URL}/front-pages/help-center`} target='_blank'>*/}
        {/*    Help Center*/}
        {/*  </MenuItem>*/}
        {/*</SubMenu>*/}
      </Menu>
      <DialogNewCategory open={showNewCategoryDialog} onClose={closeNewCategoryDialog} />
    </ScrollWrapper>
  )
}

export default VerticalMenu
