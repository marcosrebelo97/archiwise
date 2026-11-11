'use client'

// React Imports
import { useMemo } from 'react'

// MUI Imports
import type {} from '@mui/lab/themeAugmentation' //! Do not remove this import otherwise you will get type errors while making a production build
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, CssVarsProvider, darken, lighten, responsiveFontSizes } from '@mui/material/styles'
import type {} from '@mui/material/themeCssVarsAugmentation' //! Do not remove this import otherwise you will get type errors while making a production build
import { deepmerge } from '@mui/utils'

// Type Imports

import type { ChildrenType, Direction } from '@core/types'

// Component Imports
import ModeChanger from './ModeChanger'

// Config Imports
import primaryColorConfig from '@configs/primaryColorConfig'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Core Theme Imports
import defaultCoreTheme from '@core/theme'

type Props = ChildrenType & {
  direction: Direction
}

const ThemeProvider = (props: Props) => {
  // Props
  const { children, direction } = props

  // Hooks
  const { settings } = useSettings()

  // Merge the primary color scheme override with the core theme
  const theme = useMemo(() => {
    const newColorScheme = {
      colorSchemes: {
        light: {
          palette: {
            primary: {
              main: primaryColorConfig[0].main,
              light: lighten(primaryColorConfig[0].main as string, 0.2),
              dark: darken(primaryColorConfig[0].main as string, 0.1)
            }
          }
        },
        dark: {
          palette: {
            primary: {
              main: primaryColorConfig[0].main,
              light: lighten(primaryColorConfig[0].main as string, 0.2),
              dark: darken(primaryColorConfig[0].main as string, 0.1)
            }
          }
        }
      },

      cssVariables: {
        colorSchemeSelector: 'class'
      }
    }

    const coreTheme = responsiveFontSizes(
      createTheme(deepmerge(defaultCoreTheme(settings.mode || 'light', direction), newColorScheme))
    )

    return coreTheme
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.mode])

  return (
    <CssVarsProvider theme={theme}>
      <ModeChanger />
      <CssBaseline enableColorScheme />
      {children}
    </CssVarsProvider>
  )
}

export default ThemeProvider
