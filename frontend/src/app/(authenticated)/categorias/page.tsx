import { CategoriesPage } from '@views/categories'

import CategoriesProvider from '@/contexts/CategoriesProvider'

export default function MyFilesPage() {
  return (
    <CategoriesProvider>
      <CategoriesPage />
    </CategoriesProvider>
  )
}
