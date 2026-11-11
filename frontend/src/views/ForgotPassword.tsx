'use client'

// Next Imports
import Link from 'next/link'

// MUI Imports
import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Type Imports
import Box from '@mui/material/Box'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { isAxiosError } from 'axios'

import type { Mode } from '@core/types'

// Component Imports
import Form from '@components/Form'
import DirectionalIcon from '@components/DirectionalIcon'
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useRequestNewPassword } from '@/hooks/useRequestNewPassword'

import type { RequestNewPasswordData } from '@/validation/requestNewPasswordSchema'
import { requestNewPasswordSchema } from '@/validation/requestNewPasswordSchema'
import { useToast } from '@/hooks/useToast'

const ForgotPassword = ({ mode }: { mode: Mode }) => {
  const { onRequestNewPassword, isPending } = useRequestNewPassword()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RequestNewPasswordData>({
    resolver: zodResolver(requestNewPasswordSchema)
  })

  const { notify } = useToast()
  const { push } = useRouter()

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  async function onSubmit(data: RequestNewPasswordData) {
    onRequestNewPassword(data.email, {
      onError(error) {
        if (isAxiosError(error) && error.status === 404) {
          notify({
            type: 'error',
            description: 'Usuário não encontrado'
          })
        }
      },
      onSuccess() {
        localStorage.setItem('passwordResetSuccess', 'Enviamos um e-mail com instruções para redefinir sua senha')
        push('/login')
      }
    })
  }

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Box className='flex justify-center items-center mbe-6'>
            <Logo />
          </Box>
          <Typography variant='h4'>Esqueci a senha 🔒</Typography>
          <div className='flex flex-col gap-5'>
            <Typography className='mbs-1'>
              Digite seu e-mail e enviaremos instruções para redefinir sua senha
            </Typography>
            <Form noValidate autoComplete='off' className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
              <TextField
                autoFocus
                fullWidth
                label='Email'
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <Button fullWidth variant='contained' type='submit' loading={isPending}>
                Enviar link
              </Button>
              <Typography className='flex justify-center items-center' color='primary'>
                <Link href='/login' className='flex items-center'>
                  <DirectionalIcon ltrIconClass='ri-arrow-left-s-line' rtlIconClass='ri-arrow-right-s-line' />
                  <span>Voltar para o login</span>
                </Link>
              </Typography>
            </Form>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default ForgotPassword
