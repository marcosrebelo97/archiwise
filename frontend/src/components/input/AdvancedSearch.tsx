import React, { useEffect, useState } from 'react'

import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import { Autocomplete, Stack } from '@mui/material'

import Select from '@mui/material/Select'

import MenuItem from '@mui/material/MenuItem'

import type { Moment } from 'moment/moment'
import moment from 'moment/moment'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import { useListCategories } from '@/hooks/list/useListCategories'
import type { TypeFile } from '@/contexts/SearchProvider'
import { RangeDate, RangeDateChip, TypesChip } from '@/contexts/SearchProvider'
import { useSearchContext } from '@/hooks/contexts/useSearch'

interface Type {
  isFocusTerm?: boolean
  term: string
  onClose: () => void
}

export function AdvancedSearch({ isFocusTerm = false, term, onClose }: Type) {
  const { data: listCategories } = useListCategories()

  const {
    handleFilterAdvancedSearch,
    types: typesActual,
    getRangeSelect,
    dateEnd: dateEndCurrent,
    dateStart: dataStartCurrent
  } = useSearchContext()

  const inputTermRef = React.useRef<HTMLInputElement>(null)
  const [category, setCategory] = useState<{ name: string; id: string }>({ name: 'Todas', id: 'all' })
  const [search, setSearch] = useState(term)
  const [types, setTypes] = useState<TypeFile[]>(typesActual)
  const [range, setRange] = useState<string>(() => getRangeSelect() || 'any')
  const [dateStart, setDateStart] = React.useState<Moment | null>(dataStartCurrent ? moment(dataStartCurrent) : null)
  const [dateEnd, setDateEnd] = React.useState<Moment | null>(dateEndCurrent ? moment(dateEndCurrent) : null)
  const typesAvailable = Object.values(TypesChip)
  const rangesAvailable = Object.values(RangeDateChip)

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value)
  }

  const hasCustomRange = range === RangeDate.CUSTOM

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    handleFilterAdvancedSearch({
      term: search,
      types: types,
      range: range === 'any' ? undefined : (range as RangeDate),
      dateStart: dateStart?.format('YYYY-MM-DD'),
      dateEnd: dateEnd?.format('YYYY-MM-DD'),
      category: category.id === 'all' ? undefined : category.id
    })
    onClose()
  }

  function clearAll() {
    setTypes([])
    setRange('any')
    setDateStart(null)
    setDateEnd(null)
    setSearch('')
    setCategory({ name: 'Todas', id: 'all' })
  }

  useEffect(() => {
    if (isFocusTerm) {
      inputTermRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const optionsCategories = [{ name: 'Todas', id: 'all' }, ...(listCategories ?? [])]

  return (
    <Box
      className='flex  gap-2 flex-col w-full top-2 p-4'
      sx={{ width: '700px' }}
      component={'form'}
      onSubmit={onSubmit}
    >
      <MenuList className={'flex flex-col gap-2 p-2'}>
        <Grid container rowSpacing={2} alignItems={'center'}>
          <Grid
            size={{
              xs: 3,
              md: 2
            }}
          >
            <Typography variant='h6'>Categoria</Typography>
          </Grid>
          <Grid
            size={{
              xs: 9,
              md: 10
            }}
          >
            <Autocomplete<{ name: string; id: string }>
              renderInput={params => <TextField {...params} size={'small'} variant='outlined' />}
              options={optionsCategories}
              getOptionLabel={option => option.name ?? 'Todas'}
              getOptionKey={option => option.id}
              value={category as any}
              multiple={false}
              onChange={(event, value) => setCategory(value || { name: 'Todas', id: 'all' })}
            />
          </Grid>
          <Grid
            size={{
              xs: 3,
              md: 2
            }}
          >
            <Typography variant='h6'>Tipo</Typography>
          </Grid>
          <Grid
            size={{
              xs: 9,
              md: 10
            }}
          >
            <Autocomplete
              multiple
              renderInput={params => <TextField {...params} size={'small'} variant='outlined' />}
              options={typesAvailable.map(type => type.label)}
              value={types as any}
              onChange={(event, value) => setTypes(value as TypeFile[])}
            />
          </Grid>
          <Grid
            size={{
              xs: 3,
              md: 2
            }}
          >
            <Typography variant='h6'>Data</Typography>
          </Grid>
          <Grid
            size={{
              xs: 9,
              md: 10
            }}
          >
            <div className={'flex flex-col gap-1'}>
              <Select
                variant='outlined'
                size={'small'}
                sx={{ width: '180px' }}
                value={range || 'tese'}
                onChange={e => setRange(e.target.value)}
                defaultValue={'any'}
              >
                <MenuItem value={'any'}>Qualquer período</MenuItem>
                {rangesAvailable.map(range => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </Select>
              {hasCustomRange && (
                <>
                  <Typography variant='h6' className={'mt-2 mb-2'}>
                    Entre
                  </Typography>
                  <Stack spacing={2} direction={'row'}>
                    <DatePicker label='Data inicial' value={dateStart} onChange={newValue => setDateStart(newValue)} />
                    <DatePicker label='Data final' value={dateEnd} onChange={newValue => setDateEnd(newValue)} />
                  </Stack>
                </>
              )}
            </div>
          </Grid>
          <Grid
            size={{
              xs: 3,
              md: 2
            }}
          >
            <Typography variant='h6'>Termo</Typography>
          </Grid>
          <Grid
            size={{
              xs: 9,
              md: 10
            }}
          >
            <TextField
              size={'small'}
              fullWidth
              placeholder={'Termo ...'}
              value={search}
              onChange={handleSearch}
              autoFocus
              ref={inputTermRef}
            />
          </Grid>
        </Grid>
      </MenuList>
      <div className={'flex flex-row items-center justify-end gap-2 p-2'}>
        <Button variant={'text'} type={'reset'} onClick={clearAll}>
          Limpar
        </Button>
        <Button variant={'contained'} color={'primary'} type={'submit'}>
          Pesquisar
        </Button>
      </div>
    </Box>
  )
}
