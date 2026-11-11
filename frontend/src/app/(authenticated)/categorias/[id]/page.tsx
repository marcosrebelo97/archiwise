import { ListFilesCategoryPage } from '@views/categories/listFiles'

import CategoriesProvider from '@/contexts/CategoriesProvider'

export default function MyFilesPage() {

return (
    <CategoriesProvider>
      <ListFilesCategoryPage />
    </CategoriesProvider>
  )
}
