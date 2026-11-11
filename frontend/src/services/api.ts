import axios from 'axios'

import { errorInterceptor } from './interceptors/errorInterceptor'

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  timeout: 10000, // Timeout de 10 segundos
  withCredentials: true // Importante para enviar e receber cookies
})

// api.interceptors.request.use(authInterceptor)
api.interceptors.response.use(
  response => response,
  error => errorInterceptor(error)
)

export default api
