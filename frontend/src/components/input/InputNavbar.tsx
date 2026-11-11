import * as React from 'react'
import { useEffect, useRef } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'

import ClickAwayListener from '@mui/material/ClickAwayListener'

import Tooltip from '@mui/material/Tooltip'

import { useDebounce } from 'react-use'

import Menu from '@mui/material/Menu'

import { useListCategories } from '@/hooks/list/useListCategories'
import { ListSearch } from '@components/input/ListSearch'
import { AdvancedSearch } from '@components/input/AdvancedSearch'
import { useRegisterSearch } from '@/hooks/create/useRegisterSearch'
import { useSearchContext } from '@/hooks/contexts/useSearch'

const CustomSelect = styled(Select)(() => ({
  // Remove a borda
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },

  '& .MuiInputBase-input': {
    padding: '0 0 0 10px'
  },

  // Remove o ícone padrão
  '& .MuiSelect-icon': {
    display: 'none'
  },

  // Ajusta o padding e fonte conforme necessário
  padding: 0,
  fontSize: '16px',
  backgroundColor: 'transparent' // Opcional: define fundo transparente
}))

export function InputNavbar() {
  const pathname = usePathname()
  const { data } = useListCategories()

  const { handleFilterAdvancedSearch } = useSearchContext()

  const previousPathname = useRef(pathname)
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState(' ')
  const [debouncedValue, setDebouncedValue] = React.useState('')
  const containerRef = React.useRef<HTMLDivElement>(null)

  const [isSearchAdvanced, setIsSearchAdvanced] = React.useState(false)
  const [isFocusInput, setIsFocusInput] = React.useState(false)
  const { push } = useRouter()
  const { onRegisterSearch } = useRegisterSearch()

  const [] = useDebounce(
    () => {
      setDebouncedValue(search)
    },
    500,
    [search]
  )

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value)
  }

  function clearSearch() {
    setSearch('')
    setCategory(' ')
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      clearSearch()
    }

    if (event.key === 'Enter' && search.trim().length > 0) {
      onRegisterSearch(search)
      clearSearch()
      push(`/pesquisa?q=${search}`)
    }
  }

  function handleClickAway() {
    setIsFocusInput(false)
  }

  function handleFocus() {
    setIsFocusInput(true)
  }

  function handleSearchAdvanced() {
    setIsSearchAdvanced(prev => !prev)
  }

  function handleCloseAdvanced() {
    setIsSearchAdvanced(false)
  }

  const isShowList = search.length > 0 && isFocusInput
  const isShowClear = search.length > 0
  const listCategories = data || []

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      clearSearch()
    }

    previousPathname.current = pathname
  }, [pathname])

  function onSearch() {
    clearSearch()
    if (!search.trim().length && category === ' ') return
    handleFilterAdvancedSearch({
      term: search,

      category: category === ' ' ? undefined : category
    })
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div
        className={'w-full flex-col gap-1 relative z-10'}
        onClick={handleFocus}
        style={{
          maxWidth: '800px'
        }}
        ref={containerRef}
      >
        <Paper
          component='form'
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', maxWidth: '800px' }}
        >
          {/*<IconButton sx={{ p: '10px' }} aria-label='menu'>*/}
          {/*  <MenuIcon />*/}
          {/*</IconButton>*/}
          <CustomSelect
            labelId='demo-simple-select-helper-label'
            id='demo-simple-select-helper'
            label='Age'
            sx={{ width: '140px' }}
            IconComponent={() => null}
            onFocus={handleFocus}
            onChange={e => {
              setCategory(e.target.value as string)
            }}
            value={category}

            // SelectProps={{ IconComponent: () => null }}
          >
            <MenuItem value=' '>
              <em>Todas</em>
            </MenuItem>
            {listCategories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </CustomSelect>
          <Divider sx={{ height: 28, m: 0.5, mr: 1 }} orientation='vertical' />
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            onKeyDown={handleKeyDown}
            placeholder='Pesquisar arquivos'
            inputProps={{ 'aria-label': 'pesquisar arquivos' }}
            value={search}
            onChange={handleSearch}
          />

          {isShowClear && (
            <Tooltip title={'Limpar pesquisa'}>
              <IconButton sx={{ p: '10px' }} aria-label='filtro' onClick={clearSearch}>
                <i className='ri-close-line' />
              </IconButton>
            </Tooltip>
          )}

          <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
          <Tooltip title='Filtros avançados'>
            <IconButton sx={{ p: '10px' }} aria-label='filtro' onClick={handleSearchAdvanced}>
              <i className='ri-equalizer-fill' />
            </IconButton>
          </Tooltip>
          <Tooltip title={'Pesquisar'}>
            <IconButton type='button' sx={{ p: '10px' }} aria-label='pesquisa' onClick={onSearch}>
              <i className='ri-search-line' />
            </IconButton>
          </Tooltip>
        </Paper>
        {isShowList && !isSearchAdvanced && (
          <ListSearch categoryId={category} search={debouncedValue} onClose={clearSearch} />
        )}
        <Menu
          id='basic-menu'
          anchorEl={containerRef.current}
          open={isSearchAdvanced}
          onClose={handleCloseAdvanced}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
          hideBackdrop={false}
          slotProps={{
            paper: {
              style: {
                width: containerRef.current?.clientWidth
              }
            },
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
          <AdvancedSearch term={search} onClose={handleCloseAdvanced} />
        </Menu>
      </div>
    </ClickAwayListener>
  )
}
