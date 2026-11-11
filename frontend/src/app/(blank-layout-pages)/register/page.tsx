// Component Imports
import { revalidatePath } from 'next/cache'

import Register from '@views/Register'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const RegisterPage = () => {
  // Vars
  revalidatePath('/')

  const mode = getServerMode()

  return <Register mode={mode} />
}

export default RegisterPage
