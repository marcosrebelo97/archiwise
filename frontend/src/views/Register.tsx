'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

// Type Imports
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { isAxiosError } from 'axios'

import Box from '@mui/material/Box'

import type { Mode } from '@core/types'

// Component Imports
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

import type { SignUpFormData } from '@/validation/signUpSchema'
import { signUpSchema } from '@/validation/signUpSchema'
import { useToast } from '@/hooks/useToast'
import { useRegister } from '@/hooks/useRegister'
import { LoadingButton } from '@components/button/LoadingButton'

const Register = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  })

  const { push, refresh } = useRouter()
  const { notify } = useToast()
  const { onRegister, isPending } = useRegister()

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  async function onSubmit(data: SignUpFormData) {
    if (isPending) return
    onRegister(data, {
      onSuccess() {
        setTimeout(() => {
          push('/')
          refresh()
        }, 100)
      },
      onError(res) {
        if (isAxiosError(res) && res.response?.status === 409) {
          return notify({
            type: 'error',
            title: 'Erro ao fazer cadastro',
            description: 'Email já cadastrado.'
          })
        }

        notify({
          type: 'error',
          title: 'Erro ao fazer cadastro',
          description: 'Verifique os dados e tente novamente.'
        })
      }
    })
  }

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Box className='flex justify-center items-start mbe-6'>
            <Logo />
          </Box>
          <Typography variant='h4'>Realize seu cadastro 🚀</Typography>
          <div className='flex flex-col gap-5'>
            <Typography className='mbs-1'>Torne o gerenciamento do seus arquivos fácil!</Typography>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
              <TextField
                autoFocus
                fullWidth
                label='Nome'
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                fullWidth
                label='Email'
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                fullWidth
                label='Senha'
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
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              {/*<FormControlLabel*/}
              {/*  control={<Checkbox />}*/}
              {/*  label={*/}
              {/*    <>*/}
              {/*      <span>Eu aceito as </span>*/}
              {/*      <Link className='text-primary' href='/' onClick={e => e.preventDefault()}>*/}
              {/*        políticas de privacidade e uso.*/}
              {/*      </Link>*/}
              {/*    </>*/}
              {/*  }*/}
              {/*/>*/}
              <LoadingButton loading={isPending} fullWidth variant='contained' type='submit' disabled={isPending}>
                Cadastro
              </LoadingButton>
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>Já tem uma conta?</Typography>
                <Typography component={Link} href='/login' sx={{ color: 'primary.main' }}>
                  Entre aqui
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

export default Register
