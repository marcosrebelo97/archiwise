import React from 'react'

import { useSearchParams } from 'next/navigation'

import Chip from '@mui/material/Chip'
import Popper from '@mui/material/Popper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import { Stack } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'

import type { TypeFile } from '@/contexts/SearchProvider'
import { TypesChip } from '@/contexts/SearchProvider'
import { useSearchContext } from '@/hooks/contexts/useSearch'

export function FilterType() {
  const params = useSearchParams()
  const paramsTypes = params.get('types')
  const types = paramsTypes ? paramsTypes.split(',') : []

  const { handleTypes } = useSearchContext()
  const typesAvailable = Object.values(TypesChip)

  const [values, setValues] = React.useState<string[]>([])
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)

    if (types) setValues(types)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  function isSelected(value: string) {
    return values.indexOf(value) !== -1
  }

  function handleToggle(value: string) {
    setValues(oldValues => {
      const currentIndex = oldValues.indexOf(value)
      const newValues = [...oldValues]

      if (currentIndex === -1) {
        newValues.push(value)
      } else {
        newValues.splice(currentIndex, 1)
      }

      return newValues
    })
  }

  function clearAll() {
    setValues([])
  }

  function onFinished() {
    handleTypes(values as TypeFile[])
    setAnchorEl(null)
  }

  function onClose() {
    handleTypes([])
    setAnchorEl(null)
  }

  let label = 'Tipo'

  if (types.length) {
    label = types.length === 1 ? `${types[0]}` : `${types[0]} +${types.length - 1}`
  }

  return (
    <>
      <Chip
        icon={<i className='ri-file-paper-line' style={{ width: '15px' }} />}
        label={
          <div className={'flex items-center justify-center'}>
            {label} <i className='ri-arrow-down-s-fill' />
          </div>
        }
        onClick={handleClick}
        color={types.length ? 'primary' : 'default'}
        clickable
        onDelete={types.length ? onClose : undefined}
      />
      <Popper open={open} anchorEl={anchorEl} placement='bottom-start' className={'z-50'}>
        <ClickAwayListener onClickAway={handleClose}>
          <Paper className={'mt-2'}>
            <MenuList autoFocus className={'p-4'}>
              {typesAvailable.map(type => (
                <li key={type.value[0]} tabIndex={-1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={type.value[0]}
                        checked={isSelected(type.value[0])}
                        onChange={() => handleToggle(type.value[0])}
                      />
                    }
                    label={
                      <div className={'flex items-center gap-2 uppercase'}>
                        <img src={type.icon} alt={type.label} className={'w-5'} /> {type.label}
                      </div>
                    }
                  />
                </li>
              ))}
            </MenuList>
            <Stack direction={'row'} spacing={2} className={'p-4 pt-0 ml-5'}>
              <Button size={'small'} variant='outlined' type={'reset'} onClick={clearAll}>
                Limpar
              </Button>
              <Button size={'small'} variant='contained' onClick={onFinished}>
                Aplicar
              </Button>
            </Stack>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  )
}
