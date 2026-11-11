'use client'
import dynamic from 'next/dynamic'

import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import type { ApexOptions } from 'apexcharts'

import { useDashboard } from '@/hooks/details/useDashboard'
import { formatFileSize } from '@/utils/util'
import { STORAGE } from '@/utils/enums'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

export const Storage = () => {
  const colorsStorageChart = (percentage: number) => {
    if (percentage < 50) return '#4CAF50'
    if (percentage > 75 && percentage < 90) return '#FFB400'
    if (percentage >= 90) return '#FF4C51'
  }

  const { data, isSuccess, isError } = useDashboard()

  const userStorage =
    !isNaN(Number(data?.userStorage?.size)) && Number(data?.userStorage?.size) > 0 ? Number(data?.userStorage?.size) : 0

  const chartSeries = [Number(((userStorage / STORAGE.max) * 100).toFixed(2))]

  const options: ApexOptions = {
    chart: {
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: '50%'
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            offsetY: 10,
            fontSize: '27px',
            color: 'var(--mui-palette-text-primary)'
          }
        }
      }
    },
    colors: [colorsStorageChart(chartSeries[0])]
  }

  return (
    <Card
      sx={{
        height: '100%'
      }}
    >
      <CardHeader title='Armazenamento' />
      {isSuccess && (
        <CardContent>
          <AppReactApexCharts options={options} series={chartSeries} type='radialBar' height={300} />
          <Typography variant='h6' align='center' marginTop={2}>
            Usados {formatFileSize(userStorage)}/2GB
          </Typography>
        </CardContent>
      )}
      {isError && (
        <CardContent>
          <Typography variant='h6'>Não foi possível encontrar essa informação</Typography>
        </CardContent>
      )}
    </Card>
  )
}
