'use client'

// React Imports
import type { ReactElement } from 'react'
import { useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import type { AxiosError, AxiosResponse } from 'axios'

import { useCookie } from 'react-use'

import api from '@/services/api'
import { COOKIE_KEY_USER } from '@/types/project'

const LayoutWrapper = ({ verticalLayout }: { verticalLayout: ReactElement }) => {
  const { push } = useRouter()
  const [, , clear] = useCookie(COOKIE_KEY_USER)

  // useRef para armazenar o ID do interceptor e poder removê-lo no unmount
  const interceptorIdRef = useRef<number | null>(null)

  useEffect(() => {
    // Função de sucesso (opcional, aqui apenas retornamos a response)
    const onResponse = (response: AxiosResponse) => {
      return response
    }

    // Função de erro
    const onError = (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Aqui você faz a lógica desejada, por exemplo:
        // 1. Limpar cookies
        // 2. Redirecionar para login
        // 3. Mostrar mensagem de sessão expirada
        window.localStorage.clear()
        clear()
        push('/login?session=expired')
      }

      return Promise.reject(error)
    }

    // Adicionar o interceptor e guardar o ID
    const id = api.interceptors.response.use(onResponse, onError)

    interceptorIdRef.current = id

    // Retorno da função useEffect será chamado no "unmount"
    return () => {
      // Remover o interceptor quando o componente sair da tela
      if (interceptorIdRef.current !== null) {
        api.interceptors.response.eject(interceptorIdRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div className='flex flex-col flex-auto'>{verticalLayout}</div>
}

export default LayoutWrapper
