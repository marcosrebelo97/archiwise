// Type Imports

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { ToastContainer } from 'react-toastify'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'

import type { ChildrenType, Direction } from '@core/types'

// Context Imports
import ThemeProvider from '@components/theme'
import { SettingsProvider } from '@core/contexts/settingsContext'
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'

// Component Imports
// Util Imports
import { getSettingsFromCookie } from '@core/utils/serverHelpers'

import ReactQueryClientProvider from '@/contexts/ReactQueryClientProvider'
import AuthProvider from '@/contexts/AuthProvider'

type Props = ChildrenType & {
  direction: Direction
}

const Providers = (props: Props) => {
  // Props
  const { children, direction } = props

  // Vars
  const settingsCookie = getSettingsFromCookie()

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: false }}>
      <VerticalNavProvider>
        <ReactQueryClientProvider>
          <SettingsProvider settingsCookie={settingsCookie} mode={'light'}>
            <ThemeProvider direction={direction}>
              <AuthProvider>{children}</AuthProvider>
              <ToastContainer draggable pauseOnFocusLoss={false} />
            </ThemeProvider>
          </SettingsProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryClientProvider>
      </VerticalNavProvider>
    </AppRouterCacheProvider>
  )
}

export default Providers
