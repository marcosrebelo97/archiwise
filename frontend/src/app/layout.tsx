import type { Metadata } from 'next'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata: Metadata = {
  title: 'ArchiWise',
  description: 'ArchiWise é um site para gerenciamento e classificação de seus arquivos de maneira fácil e intuitiva.',
  keywords: 'arquivos, documentos, gerenciamento, classificação, organização',
  metadataBase: new URL('https://archiwise.online')
}

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  return (
    <html id='__next' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <InitColorSchemeScript attribute='class' />

        {children}
      </body>
    </html>
  )
}

export default RootLayout
