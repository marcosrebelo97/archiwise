import type { AxiosError } from 'axios'

export const errorInterceptor = (error: AxiosError) => {
  console.error('errorInterceptor', error)

  return Promise.reject(error)
}
