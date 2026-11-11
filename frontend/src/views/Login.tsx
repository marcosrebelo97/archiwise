'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import { useRouter, useSearchParams } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// Type Imports
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import Box from '@mui/material/Box'

import type { Mode } from '@core/types'

// Component Imports
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

import type { LoginFormData } from '@/validation/loginSchema'
import { loginSchema } from '@/validation/loginSchema'
import { useLogin } from '@/hooks/useLogin'
import { useToast } from '@/hooks/useToast'
import { LoadingButton } from '@components/button/LoadingButton'

const Login = ({ mode }: { mode: Mode }) => {
  // States
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const { push } = useRouter()
  const { notify } = useToast()
  const { onLogin, isPending } = useLogin()
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  async function onSubmit(data: LoginFormData) {
    if (isPending) return
    onLogin(data, {
      onSuccess() {
        push('/')

        // setTimeout(() => {
        //   refresh()
        // }, 100)
      },
      onError() {
        notify({
          type: 'error',
          title: 'Erro ao fazer login',
          description: 'Verifique suas credenciais e tente novamente.'
        })
      }
    })
  }

  useEffect(() => {
    if (searchParams.get('session')) {
      notify({ type: 'error', title: 'Sessão expirada', description: 'Insira suas credenciais novamente.' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    const successMessageRequired = localStorage.getItem('passwordResetSuccess')

    if (successMessageRequired) {
      notify({
        type: 'success',
        description: successMessageRequired
      })

      // Limpar a mensagem após exibir
      localStorage.removeItem('passwordResetSuccess')
    }

    const resetSuccessMessageRequired = localStorage.getItem('resetSuccess')

    if (resetSuccessMessageRequired) {
      notify({
        type: 'success',
        description: resetSuccessMessageRequired
      })

      // Limpar a mensagem após exibir
      localStorage.removeItem('resetSuccess')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Box className='flex justify-center items-center mbe-6'>
            <Logo />
          </Box>
          <div className='flex flex-col gap-5'>
            <div>
              <Typography variant='h4'>{`Bem vindo ao ${themeConfig.templateName}!👋🏻`}</Typography>
              <Typography className='mbs-1'>Faça login em sua conta e comece a aventura</Typography>
            </div>
            <form autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
              <TextField
                autoFocus
                fullWidth
                label='Email'
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                fullWidth
                label='Senha'
                error={!!errors.password}
                helperText={errors.password?.message}
                type={isPasswordShown ? 'text' : 'password'}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          size='small'
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                {...register('password')}
              />
              <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                {/*<FormControlLabel control={<Checkbox />} label='Lembrar credenciais' />*/}
                <div></div>
                <Typography
                  className='text-end'
                  sx={{ color: 'primary.main' }}
                  component={Link}
                  href='/forgot-password'
                >
                  Esqueceu a senha?
                </Typography>
              </div>
              <LoadingButton loading={isPending} fullWidth variant='contained' type='submit'>
                Entrar
              </LoadingButton>
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>Novo na plataforma?</Typography>
                <Typography component={Link} href='/register' sx={{ color: 'primary.main' }}>
                  Criar conta
                </Typography>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default Login
