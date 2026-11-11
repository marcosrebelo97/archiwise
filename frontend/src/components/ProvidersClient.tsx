'use client'

// Type Imports

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import type { ChildrenType } from '@core/types'

// Context Imports
// Component Imports
// Util Imports

type Props = ChildrenType

const ProvidersClient = ({ children }: Props) => {
  return <LocalizationProvider dateAdapter={AdapterMoment}>{children}</LocalizationProvider>
}

export default ProvidersClient
