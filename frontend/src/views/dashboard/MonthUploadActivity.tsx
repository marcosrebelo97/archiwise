'use client'

// Next Imports

import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Third Party Imports
import type { ApexOptions } from 'apexcharts'

//import { categoryUploads } from '@/mocks/uploadActivity'
// Components Imports
import type { CategoryUploads } from '@/types/project'
import { useDashboard } from '@/hooks/details/useDashboard'

// Styled Component Imports
export enum MONTHS {
  JANUARY = 'Jan',
  FEBRUARY = 'Fev',
  MARCH = 'Mar',
  APRIL = 'Abr',
  MAY = 'Mai',
  JUNE = 'Jun'
}
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

export const MONTHS_ORDER = [MONTHS.JANUARY, MONTHS.FEBRUARY, MONTHS.MARCH, MONTHS.APRIL, MONTHS.MAY, MONTHS.JUNE]

const MonthUploadActivity = () => {
  const { data, isSuccess, isError } = useDashboard()

  const categoryUploads = (data?.monthUploadsByCategory as CategoryUploads) ?? []

  const theme = useTheme()

  // const divider = 'var(--mui-palette-divider)'
  // const disabled = 'var(--mui-palette-text-disabled)'

  const months = MONTHS_ORDER.filter(month => categoryUploads.some(item => item.month === month))

  const categoriesSet = new Set<string>()

  categoryUploads.forEach(monthItem => {
    monthItem.data.forEach(entry => categoriesSet.add(entry.categoryName))
  })
  const categories = Array.from(categoriesSet)

  const series = categories.map(category => ({
    name: category,
    data: months.map(month => {
      const monthData = categoryUploads.find(item => item.month === month)
      const entry = monthData?.data.find(item => item.categoryName === category)

      return entry ? entry.uploads : 0 // Garante que categorias sem uploads naquele mês tenham 0
    })
  }))

  // Gera o array de cores baseado na primeira ocorrência de cada categoria
  const seriesColors = categories.map(category => {
    const firstMonthData = categoryUploads.find(monthItem =>
      monthItem.data.some(entry => entry.categoryName === category)
    )

    const entry = firstMonthData?.data.find(entry => entry.categoryName === category)

    return entry ? entry.color : '#CCCCCC' // Cor padrão caso alguma categoria não tenha cor definida
  })

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      stacked: true
    },
    plotOptions: {
      bar: {
        borderRadius: 12,
        columnWidth: '15%'
      }
    },
    stroke: {
      width: 2,
      colors: ['var(--mui-palette-background-paper)']
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      labels: {
        colors: 'var(--mui-palette-text-primary)',
        useSeriesColors: false
      }
    },
    grid: {
      xaxis: { lines: { show: false } },
      strokeDashArray: 7,
      padding: { left: -9, top: -20, bottom: 13 },
      borderColor: 'var(--mui-palette-divider)'
    },
    dataLabels: { enabled: true },
    colors: seriesColors,
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    },
    xaxis: {
      categories: months,
      tickPlacement: 'on',
      labels: {
        show: true,
        style: { colors: 'var(--mui-palette-text-primary)' }
      },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        offsetY: 2,
        offsetX: -17,
        style: { colors: 'var(--mui-palette-text-primary)', fontSize: theme.typography.body2.fontSize as string },
        formatter: value => `${value}`
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 150 // reduz a altura em telas menores
          },
          plotOptions: {
            bar: {
              columnWidth: '20%' // aumenta a largura das colunas em telas menores
            }
          },
          xaxis: {
            labels: {
              show: false // esconde os labels do eixo X se necessário
            }
          }
        }
      }
    ]
  }

  return (
    <Card
      sx={{
        height: '100%'
      }}
    >
      <CardHeader title='Atividade de Uploads' />
      {isSuccess && (
        <CardContent
          sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 }, height: { lg: 355, md: 343, sm: 400 } }}
        >
          <AppReactApexCharts type='bar' width='100%' height={400} series={series} options={options} />
          <div className='flex items-center mbe-4 gap-4'>{/* Coloque legendas aq */}</div>
        </CardContent>
      )}
      {isError && (
        <CardContent>
          <Typography variant='h4' color='text.primary'>
            Não foi possível atualizar o gráfico
          </Typography>
        </CardContent>
      )}
    </Card>
  )
}

export default MonthUploadActivity
