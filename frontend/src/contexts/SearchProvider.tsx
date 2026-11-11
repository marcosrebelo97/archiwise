'use client'
import type { ReactNode } from 'react'
import { useEffect, useState, createContext } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import moment from 'moment'

export const enum TypeFile {
  PDF = 'pdf',
  DOCX = 'docx',
  PPTX = 'pptx',
  XLS = 'xlsx'
}

export enum RangeDate {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',

  // THIS_MONTH = 'this_month',
  CUSTOM = 'custom'
}

export const TypesChip = {
  [TypeFile.PDF]: {
    label: 'pdf',
    icon: '/doc-icons/pdf.png',
    value: [TypeFile.PDF]
  },
  [TypeFile.DOCX]: {
    label: 'docx',
    icon: '/doc-icons/doc.png',
    value: [TypeFile.DOCX]
  },
  [TypeFile.PPTX]: {
    label: 'pptx',
    icon: '/doc-icons/ppt.png',
    value: [TypeFile.PPTX]
  },
  [TypeFile.XLS]: {
    label: 'xls',
    icon: '/doc-icons/xls.png',
    value: [TypeFile.XLS]
  }
} as const

export const RangeDateChip = {
  [RangeDate.TODAY]: {
    label: 'Hoje',
    value: RangeDate.TODAY
  },
  [RangeDate.YESTERDAY]: {
    label: 'Ontem',
    value: RangeDate.YESTERDAY
  },
  [RangeDate.LAST_7_DAYS]: {
    label: 'Últimos 7 dias',
    value: RangeDate.LAST_7_DAYS
  },
  [RangeDate.LAST_30_DAYS]: {
    label: 'Últimos 30 dias',
    value: RangeDate.LAST_30_DAYS
  },

  // [RangeDate.THIS_MONTH]: {
  //   label: 'Este mês',
  //   value: RangeDate.THIS_MONTH
  // },
  [RangeDate.CUSTOM]: {
    label: 'Personalizado',
    value: RangeDate.CUSTOM
  }
}

type ContextSearch = {
  dateStart: string
  dateEnd: string
  types: TypeFile[]
  getRangeSelect: () => RangeDate | undefined
  handleTypes: (value: TypeFile[]) => void
  handleFilterDate: (type: RangeDate | undefined, dateStart: string, dateEnd: string) => void
  handleFilterAdvancedSearch: (options: OptionAdvancedSearch) => void
}

export const SearchContext = createContext<ContextSearch>({
  dateStart: '',
  dateEnd: '',
  types: [],
  getRangeSelect: () => undefined,
  handleTypes: () => {},
  handleFilterDate: () => {},
  handleFilterAdvancedSearch: () => {}
})

interface SearchProviderProps {
  children: ReactNode
}

interface OptionAdvancedSearch {
  category?: string
  types?: TypeFile[]
  dateStart?: string
  dateEnd?: string
  range?: RangeDate
  term?: string
}

export default function SearchProvider({ children }: SearchProviderProps) {
  const searchParams = useSearchParams()

  const { push } = useRouter()

  const [types, setTypes] = useState<TypeFile[]>([])
  const [dateStart, setDateStart] = useState<string>('')
  const [dateEnd, setDateEnd] = useState<string>('')

  useEffect(() => {
    const types = searchParams.get('types') || ''
    const dateStart = searchParams.get('dateStart') || ''
    const dateEnd = searchParams.get('dateEnd') || ''

    if (types.length) {
      setTypes(types.split(',') as TypeFile[])
    } else {
      setTypes([])
    }

    if (dateStart) {
      setDateStart(dateStart)
    } else {
      setDateStart('')
    }

    if (dateEnd) {
      setDateEnd(dateEnd)
    } else {
      setDateEnd('')
    }
  }, [searchParams])

  function handleTypes(values: TypeFile[]) {
    const params = new URLSearchParams(location.search)
    const value = values.join(',')

    if (value.length) {
      params.set('types', value)
    } else {
      params.delete('types')
    }

    push(`?${params.toString()}`)
  }

  function getDateRange(type: RangeDate) {
    const date = moment() // Momento atual no fuso local

    console.log('date', date)

    switch (type) {
      case RangeDate.TODAY:
        return {
          dateStart: date.format('YYYY-MM-DD')
        }
      case RangeDate.YESTERDAY:
        return {
          dateStart: date.subtract(1, 'day').format('YYYY-MM-DD')
        }
      case RangeDate.LAST_7_DAYS:
        return {
          dateStart: date.subtract(7, 'days').format('YYYY-MM-DD')
        }
      case RangeDate.LAST_30_DAYS:
        return {
          dateStart: date.subtract(30, 'days').format('YYYY-MM-DD')
        }
      default:
        return false
    }
  }

  function handleFilterDate(type: RangeDate | undefined, dateStart: string, dateEnd: string) {
    const params = new URLSearchParams(location.search)

    if (type === undefined) {
      params.delete('dateStart')
      params.delete('dateEnd')
    } else if (type === RangeDate.CUSTOM) {
      if (dateStart && dateEnd) {
        params.set('dateStart', dateStart)
        params.set('dateEnd', dateEnd)
      } else {
        params.delete('dateStart')
        params.delete('dateEnd')
      }
    } else {
      const date = getDateRange(type)

      if (date) {
        params.set('dateStart', date.dateStart)
        params.delete('dateEnd')
      }
    }

    push(`?${params.toString()}`)
  }

  function getRangeSelect() {
    if (!dateStart && !dateEnd) {
      return undefined
    }

    if (dateEnd && dateStart) {
      return RangeDate.CUSTOM
    }

    const dateToday = moment().format('YYYY-MM-DD')
    const dateYesterday = moment().subtract(1, 'day').format('YYYY-MM-DD')
    const date7Days = moment().subtract(7, 'days').format('YYYY-MM-DD')
    const date30Days = moment().subtract(30, 'days').format('YYYY-MM-DD')

    if (dateStart === dateToday) {
      return RangeDate.TODAY
    }

    if (dateStart === dateYesterday) {
      return RangeDate.YESTERDAY
    }

    if (dateStart === date7Days) {
      return RangeDate.LAST_7_DAYS
    }

    if (dateStart === date30Days) {
      return RangeDate.LAST_30_DAYS
    }

    return undefined
  }

  function handleFilterAdvancedSearch({ category, types, dateStart, dateEnd, range, term }: OptionAdvancedSearch) {
    const params = new URLSearchParams()

    if (category && category !== 'all') {
      console.log(category)
      params.set('categoryId', category)
    }

    if (types && types.length) {
      params.set('types', types.join(','))
    }

    if (range === RangeDate.CUSTOM) {
      if (dateStart && dateEnd) {
        params.set('dateStart', dateStart)
        params.set('dateEnd', dateEnd)
      }
    }

    if (range && range !== RangeDate.CUSTOM) {
      const date = getDateRange(range)

      if (date) {
        params.set('dateStart', date.dateStart)
        params.delete('dateEnd')
      }
    }

    if (term) {
      params.set('q', term)
    }

    push(`/pesquisa?${params.toString()}`)
  }

  return (
    <SearchContext.Provider
      value={{
        dateStart,
        dateEnd,
        types,
        getRangeSelect,
        handleTypes,
        handleFilterDate,
        handleFilterAdvancedSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
