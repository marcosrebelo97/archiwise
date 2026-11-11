'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

import { useDashboard } from '@/hooks/details/useDashboard'
import { useListCategories } from '@/hooks/list/useListCategories'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const DistributedColumnChart = () => {
  // Hooks
  const theme = useTheme()
  const { data, isSuccess, isError } = useDashboard()

  const {
    data: categories,
    isError: isErrorFetchingCategories,
    isSuccess: isSuccessFetchingCategories
  } = useListCategories()

  const categoriesData = data?.categoriesFiles || []

  const series = [
    {
      name: 'Uploads',
      data: categoriesData.map((category: any) => category.data)
    }
  ]

  const categoryColors = categoriesData.map((category: any) => category.color || 'var(--mui-palette-primary-main)')

  // const categoryLabels = categoriesData.map((category: any) => category.name)

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: false,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    grid: {
      show: true,
      padding: {
        top: -10,
        left: -3,
        right: -2,
        bottom: 5
      }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: categoryColors, // Aplica cores diferentes para cada barra
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '30%',
        borderRadius: 4,
        distributed: true // Garante que cada barra tenha uma cor diferente
      }
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: { show: true, style: { colors: 'var(--mui-palette-text-primary)' } },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    responsive: [
      {
        breakpoint: 900,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '20%'
            }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '12%'
            }
          }
        }
      }
    ]
  }

  return (
    <Card sx={{ height: '100%' }}>
      {isSuccess && (
        <CardContent>
          <Typography variant='h6'>
            {isSuccessFetchingCategories && categories?.length > 1
              ? `${categories?.length} categorias`
              : `${categories?.length} categoria`}
            {isErrorFetchingCategories && 'Não foi possível disponibilizar essa informação'}
          </Typography>
          <AppReactApexCharts type='bar' height={150} width='100%' options={options} series={series} />
          <Typography color='text.primary' className='font-medium text-center'>
            Categorias com mais arquivos
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

export default DistributedColumnChart
