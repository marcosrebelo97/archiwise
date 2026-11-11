import type { InternalAxiosRequestConfig } from 'axios'

import { TOKEN_KEY_USER } from '@/types/project'

export const authInterceptor = (config: InternalAxiosRequestConfig<any>) => {
  const token = localStorage.getItem(TOKEN_KEY_USER) // Obter token do armazenamento

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}
