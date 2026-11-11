'use client'
import { Card, CardContent, Tooltip, Typography } from '@mui/material'

import CustomAvatar from '@/@core/components/mui/Avatar'
import { useDashboard } from '@/hooks/details/useDashboard'

export const MostSearchedTerm = () => {
  const { data, isError, isSuccess } = useDashboard()
  const mostSearchedTerm = data?.mostSearchedTerms[0]?.termSearched ?? ''

  return (
    <Card
      sx={{
        height: '100%'
      }}
    >
      <CardContent>
        <div className='flex justify-between items-center is-full mbe-5'>
          <CustomAvatar color='secondary' className='shadow-xs'>
            <i className='ri-menu-search-line' />
          </CustomAvatar>
        </div>
        <div className='flex flex-col gap-2'>
          <Typography variant='body1'>Termo mais pesquisado</Typography>
          <div className='flex gap-x-2 gap-y-0.5 items-center flex-wrap overflow-hidden text-ellipsis'>
            {isError && <Typography variant='body1'>Não foi possível encontrar essa informação</Typography>}
            {isSuccess ? (
              mostSearchedTerm.trim().length === 0 ? (
                <Typography variant='body1'>Não há termos pesquisados</Typography>
              ) : (
                <Tooltip title={mostSearchedTerm}>
                  <Typography className='overflow-hidden text-ellipsis' variant='h6'>
                    {mostSearchedTerm}
                  </Typography>
                </Tooltip>
              )
            ) : null}
          </div>
          <Typography variant='body1'>Neste Ano</Typography>
        </div>
      </CardContent>
    </Card>
  )
}
