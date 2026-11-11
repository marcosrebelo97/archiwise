'use client'

// MUI Imports
import * as React from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'

import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import TextField from '@mui/material/TextField'

import InputAdornment from '@mui/material/InputAdornment'

import IconButton from '@mui/material/IconButton'

import Typography from '@mui/material/Typography'

import { ListItem, Stack } from '@mui/material'

import MenuList from '@mui/material/MenuList'

import { useMutation } from '@tanstack/react-query'

import type { EditPasswordData } from '@/validation/editPassword'
import { editPasswordSchema } from '@/validation/editPassword'
import { AuthService } from '@/services/requests/auth'
import { useToast } from '@/hooks/useToast'

const SecurityPassword = () => {
  const { notify } = useToast()
  const [isPasswordShown, setIsPasswordShown] = React.useState(false)
  const [isNewPasswordShown, setIsNewPasswordShown] = React.useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = React.useState(false)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<EditPasswordData>({
    resolver: zodResolver(editPasswordSchema)
  })

  const { mutate: onUpdate, isPending } = useMutation({
    mutationFn: ({ currentPassword, newPassword }: EditPasswordData) =>
      AuthService.updatePassword({ newPassword, password: currentPassword }),

    onSuccess: res => {
      if (res) {
        notify({ type: 'success', description: 'Senha atualizada com sucesso' })
      }
    },
    onError: () => {
      notify({ type: 'error', description: 'Senha atual não confere' })
    }
  })

  function onSubmit(data: EditPasswordData) {
    if (isPending) return
    onUpdate(data)
  }

  function handleClickShowPassword() {
    setIsPasswordShown(!isPasswordShown)
  }

  function handleClickShowNewPassword() {
    setIsNewPasswordShown(!isNewPasswordShown)
  }

  function handleClickShowConfirmPassword() {
    setIsConfirmPasswordShown(!isConfirmPasswordShown)
  }

  function handleReset() {
    reset()
  }

  const newPassword = watch().newPassword
  const hasLength = newPassword && newPassword.length >= 4

  const canSubmit = newPassword && watch().confirmPassword && watch().currentPassword && hasLength

  return (
    <Card>
      <CardHeader title='Mudar Senha' />
      <CardContent className='flex flex-col items-start gap-6' component={'form'} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              md: 6
            }}
          >
            <Controller
              name='currentPassword'
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label='Senha'
                  id='password'
                  type={isPasswordShown ? 'text' : 'password'}
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword ? errors.currentPassword.message : ''}
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
                  {...field}
                  autoComplete='current-password'
                />
              )}
            />{' '}
          </Grid>
          <Grid
            size={{
              xs: 0,
              md: 6
            }}
          />
          <Grid
            size={{
              xs: 12,
              md: 6
            }}
          >
            <Controller
              name='newPassword'
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label='Nova Senha'
                  type={isNewPasswordShown ? 'text' : 'password'}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword ? errors.newPassword.message : ''}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={handleClickShowNewPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isNewPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                  {...field}
                />
              )}
            />{' '}
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6
            }}
          >
            <Controller
              name='confirmPassword'
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label='Confirmar senha'
                  type={isConfirmPasswordShown ? 'text' : 'password'}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
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
                            <i className={isConfirmPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                  {...field}
                />
              )}
            />{' '}
          </Grid>
          <Grid size={12}>
            <Stack>
              <Typography variant={'h6'}>Requisitos para senha:</Typography>
              <MenuList>
                <ListItem color={hasLength ? 'success' : 'error'}>
                  <Typography
                    variant={'body1'}
                    sx={{
                      color: hasLength ? 'success.main' : 'secondary.main'
                    }}
                  >
                    Deve conter pelo menos 4 caracteres
                  </Typography>
                </ListItem>
              </MenuList>
            </Stack>
          </Grid>
          <Grid size={12} className='flex gap-4 flex-wrap'>
            <Button variant='contained' type='submit' disabled={!canSubmit} loading={isPending}>
              Mudar senha
            </Button>
            <Button variant='outlined' type='reset' color='secondary' onClick={handleReset}>
              Resetar
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default SecurityPassword
