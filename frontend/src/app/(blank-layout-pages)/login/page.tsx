// Component Imports
import { revalidatePath } from 'next/cache'

import Login from '@views/Login'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const LoginPage = () => {
  // Vars
  revalidatePath('/', 'page')

  const mode = getServerMode()

  return <Login mode={mode} />
}

export default LoginPage
