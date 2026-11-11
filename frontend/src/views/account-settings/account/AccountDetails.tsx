'use client'

// React Imports
// MUI Imports
import * as React from 'react'
import { useEffect } from 'react'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { useMutation } from '@tanstack/react-query'

import type { EditPerfilData } from '@/validation/editPerfil'
import { editPerfilSchema } from '@/validation/editPerfil'
import { useAuthContext } from '@/hooks/contexts/useAuthContext'
import { AuthService } from '@/services/requests/auth'
import { useToast } from '@/hooks/useToast'

const AccountDetails = () => {
  const { user, update } = useAuthContext()
  const { notify } = useToast()

  // States
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<EditPerfilData>({
    resolver: zodResolver(editPerfilSchema),
    defaultValues: {
      name: 'teste'
    }
  })

  const { mutate: onUpdate, isPending } = useMutation({
    mutationFn: (name: string) => AuthService.updateName(name),
    onSuccess: res => {
      if (res) {
        update(res.data)
        notify({ type: 'success', description: 'Perfil atualizado com sucesso' })
      }
    }
  })

  const email = user?.email || ''

  function resetForm() {
    setValue('name', user?.name || '')
  }

  function onSubmit(data: EditPerfilData) {
    if (isPending) return
    onUpdate(data.name)
  }

  useEffect(() => {
    if (user) {
      setValue('name', user.name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const canBeSubmitted = watch().name !== user?.name

  return (
    <Card>
      {/*<CardContent className='mbe-5'>*/}
      {/*  <div className='flex max-sm:flex-col items-center gap-6'>*/}
      {/*    <img height={100} width={100} className='rounded' src={imgSrc} alt='Profile' />*/}
      {/*    <div className='flex flex-grow flex-col gap-4'>*/}
      {/*      <div className='flex flex-col sm:flex-row gap-4'>*/}
      {/*        <Button component='label' size='small' variant='contained' htmlFor='account-settings-upload-image'>*/}
      {/*          Nova foto*/}
      {/*          <input*/}
      {/*            hidden*/}
      {/*            type='file'*/}
      {/*            value={fileInput}*/}
      {/*            accept='image/png, image/jpeg'*/}
      {/*            onChange={handleFileInputChange}*/}
      {/*            id='account-settings-upload-image'*/}
      {/*          />*/}
      {/*        </Button>*/}
      {/*        <Button size='small' variant='outlined' color='error' onClick={handleFileInputReset}>*/}
      {/*          Deletar foto*/}
      {/*        </Button>*/}
      {/*      </div>*/}
      {/*      <Typography>Aceitos JPG, GIF ou PNG. Tamanho máximo de 5MB </Typography>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</CardContent>*/}
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid
              size={{
                xs: 12,
                sm: 6
              }}
            >
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label='Nome'
                    {...field}
                    value={field.value || ''}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6
              }}
            >
              <TextField disabled fullWidth label='Email' value={email} />
            </Grid>

            <Grid size={12} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit' disabled={!canBeSubmitted} loading={isPending}>
                Salvar mudanças
              </Button>
              <Button variant='outlined' type='reset' color='secondary' onClick={resetForm} disabled={!canBeSubmitted}>
                Resetar
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
