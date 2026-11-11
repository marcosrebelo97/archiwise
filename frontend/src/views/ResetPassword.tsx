'use client'

// Next Imports
import { useEffect, useState } from 'react'

import Link from 'next/link'

// MUI Imports
import { useRouter, useSearchParams } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

// Type Imports
import Box from '@mui/material/Box'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { isAxiosError } from 'axios'

import InputAdornment from '@mui/material/InputAdornment'

import { CircularProgress } from '@mui/material'

import type { Mode } from '@core/types'

// Component Imports
import Form from '@components/Form'
import DirectionalIcon from '@components/DirectionalIcon'
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useResetPassword } from '@/hooks/useResetPassword'

import type { ResetPasswordData } from '@/validation/resetPasswordSchema'
import { resetPasswordSchema } from '@/validation/resetPasswordSchema'
import { useToast } from '@/hooks/useToast'
import { AuthService } from '@/services/requests/auth'

const ResetPasswordPage = ({ mode }: { mode: Mode }) => {
  const { onResetPassword, isPending } = useResetPassword()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [isVerifyingToken, setIsVerifyingToken] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema)
  })

  const { notify } = useToast()
  const { push } = useRouter()

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  // State for managing password visibility
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword(prev => !prev)
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(prev => !prev)

  async function onSubmit(data: ResetPasswordData) {
    if (!token) return
    onResetPassword(
      { token, newPassword: data.password },
      {
        onError(error) {
          if (isAxiosError(error)) {
            notify({
              type: 'error',
              description: 'Houve um erro ao tentar redefinir sua senha.'
            })
          }
        },
        onSuccess() {
          localStorage.setItem('resetSuccess', 'Senha redefinida com sucesso!')

          push('/login')
        }
      }
    )
  }

  useEffect(() => {
    if (!token) {
      setIsVerifyingToken(false)
      setIsTokenValid(false)

      return
    }

    AuthService.verifyPasswordResetToken(token)
      .then(() => {
        setIsVerifyingToken(false)
        setIsTokenValid(true)
      })
      .catch(() => {
        setIsVerifyingToken(false)
        setIsTokenValid(false)
      })
      .finally(() => {
        setIsVerifyingToken(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Box className='flex justify-center items-center mbe-6'>
            <Logo />
          </Box>
          {!isVerifyingToken && !isTokenValid && (
            <>
              <Typography variant='h4' color='error'>
                Token inválido ou expirado
              </Typography>
              <Typography className='flex justify-center items-center mt-4' color='primary'>
                <Link href='/login' className='flex items-center'>
                  <DirectionalIcon ltrIconClass='ri-arrow-left-s-line' rtlIconClass='ri-arrow-right-s-line' />
                  <span>Voltar para o login</span>
                </Link>
              </Typography>
            </>
          )}
          {isVerifyingToken && (
            <Box className=' gap-4 flex justify-center flex-col items-center mbe-6'>
              <CircularProgress />
              <Typography variant='h5'>Verificando token...</Typography>
            </Box>
          )}

          {!isVerifyingToken && isTokenValid && (
            <>
              <Typography variant='h4'>Redefina sua senha 🔒</Typography>
              <div className='flex flex-col gap-5'>
                <Typography className='mbs-1'>Insira sua nova senha e confirme para completar a alteração</Typography>
                <Form noValidate autoComplete='off' className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    autoFocus
                    fullWidth
                    label='Nova Senha'
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
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
                              <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label='Confirmar Senha'
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              size='small'
                              edge='end'
                              onClick={handleClickShowConfirmPassword}
                              onMouseDown={e => e.preventDefault()}
                            >
                              <i className={showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                  <Button fullWidth variant='contained' type='submit' loading={isPending}>
                    Redefinir Senha
                  </Button>
                  <Typography className='flex justify-center items-center' color='primary'>
                    <Link href='/login' className='flex items-center'>
                      <DirectionalIcon ltrIconClass='ri-arrow-left-s-line' rtlIconClass='ri-arrow-right-s-line' />
                      <span>Voltar para o login</span>
                    </Link>
                  </Typography>
                </Form>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default ResetPasswordPage
