import React from 'react'

import Chip from '@mui/material/Chip'
import Popper from '@mui/material/Popper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import { Accordion, Radio, Stack } from '@mui/material'
import Button from '@mui/material/Button'

import FormControlLabel from '@mui/material/FormControlLabel'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import type { Moment } from 'moment'
import moment from 'moment'

import { RangeDate, RangeDateChip } from '@/contexts/SearchProvider'
import { useSearchContext } from '@/hooks/contexts/useSearch'

export function FilterDate() {
  const rangesAvailable = Object.values(RangeDateChip)
  const { dateStart: dateStartQuery, dateEnd: dateEndQuery, getRangeSelect, handleFilterDate } = useSearchContext()
  const rangeSelected = getRangeSelect()
  const [value, setValue] = React.useState<RangeDate>()
  const [dateStart, setDateStart] = React.useState<Moment | null>(moment())
  const [dateEnd, setDateEnd] = React.useState<Moment | null>(moment())

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    if (rangeSelected) setValue(rangeSelected)

    if (rangeSelected === RangeDate.CUSTOM) {
      dateStartQuery && setDateStart(moment(dateStartQuery))
      dateEndQuery && setDateEnd(moment(dateEndQuery))
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  function handleToggle(value: RangeDate) {
    setValue(value)
  }

  function clearAll() {
    setValue(undefined)
  }

  function finish() {
    if (value === RangeDate.CUSTOM) {
      if (dateStart && dateEnd) handleFilterDate(value, dateStart?.format('YYYY-MM-DD'), dateEnd?.format('YYYY-MM-DD'))
    } else {
      handleFilterDate(value, '', '')
    }

    setAnchorEl(null)
  }

  function onDelete() {
    handleFilterDate(undefined, '', '')
    setAnchorEl(null)
  }

  const label = rangeSelected ? RangeDateChip[rangeSelected].label : 'Criado'
  const hasOptionSelected = rangeSelected

  return (
    <>
      <Chip
        icon={<i className='ri-calendar-2-line' style={{ width: '15px' }} />}
        label={
          <div className={'flex items-center justify-center'}>
            {label} <i className='ri-arrow-down-s-fill' />
          </div>
        }
        onClick={handleClick}
        color={hasOptionSelected ? 'primary' : 'default'}
        onDelete={hasOptionSelected ? onDelete : undefined}
        clickable
      />
      <Popper open={open} anchorEl={anchorEl} placement='bottom-start' className={'z-50'}>
        <ClickAwayListener onClickAway={handleClose}>
          <Paper className={'mt-2'}>
            <MenuList autoFocus className={'p-4'}>
              {rangesAvailable.map(range => (
                <li key={range.value} tabIndex={-1}>
                  <FormControlLabel
                    control={
                      <Radio
                        value={range.value}
                        checked={value === range.value}
                        onChange={() => handleToggle(range.value)}
                      />
                    }
                    label={<div className={'flex items-center gap-2 '}>{range.label}</div>}
                  />
                </li>
              ))}
            </MenuList>
            <Accordion expanded={value === RangeDate.CUSTOM} elevation={0} className={'shadow-none px-4 pb-2'}>
              <div className={'hidden'} />
              <Stack spacing={2}>
                <DatePicker label='Data inicial' value={dateStart} onChange={newValue => setDateStart(newValue)} />
                <DatePicker label='Data final' value={dateEnd} onChange={newValue => setDateEnd(newValue)} />
              </Stack>
            </Accordion>
            <Stack direction={'row'} spacing={2} className={'p-4 pt-0 ml-5'} justifyContent={'end'}>
              <Button size={'small'} variant='outlined' type={'reset'} onClick={clearAll}>
                Limpar
              </Button>
              <Button size={'small'} variant='contained' onClick={finish}>
                Aplicar
              </Button>
            </Stack>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  )
}
