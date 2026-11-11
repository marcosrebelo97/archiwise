'use client'

// Next Imports
import dynamic from 'next/dynamic'

//MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import type { ApexOptions } from 'apexcharts'

import { useListAllDocuments } from '@/hooks/list/useListAllDocuments'
import { useDashboard } from '@/hooks/details/useDashboard'
import { useSettings } from '@/@core/hooks/useSettings'

// Styled Component Imports
interface DailyUpload {
  date: string
  uploads: number
}

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))


// Vars
// const series = [{ data: [0, 20, 5, 30, 15, 45] }]

const LineChart = () => {
  const {documents} = useListAllDocuments();
  const {data, isSuccess, isError} = useDashboard();

  const dailyUploads: DailyUpload[] = data?.dailyUploads ?? [];
  const {settings} = useSettings();

  moment.locale('pt-br');

  const series = [
    {
      name: "Uploads diários",
      data: [...dailyUploads.map(data => data.uploads)],
      days: [...dailyUploads.map(data => moment(data.date).format('D [de] MMM. [de] YYYY'))]
    }]

  const primaryColor = 'var(--mui-palette-primary-main)'

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    grid: {
      strokeDashArray: 6,
      borderColor: 'var(--mui-palette-divider)',
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: -10,
        left: -7,
        right: 5,
        bottom: 5
      }
    },
    stroke: {
      width: 3,
      lineCap: 'butt',
      curve: 'straight'
    },
    tooltip: {
      theme: settings.mode,
    },
    colors: [primaryColor],
    markers: {
      size: 6,
      offsetY: 4,
      offsetX: -2,
      strokeWidth: 3,
      colors: ['transparent'],
      strokeColors: 'transparent',
      discrete: [
        {
          size: 5.5,
          seriesIndex: 0,
          strokeColor: primaryColor,
          fillColor: 'var(--mui-palette-background-paper)',
          dataPointIndex: series[0].data.length - 1
        }
      ]
    },
    xaxis: { // Define labels do eixo X
      categories: series[0].days,
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false},
      labels: { show: false },

    }
  };

  return (
    <Card
      sx={{
        height: '100%'
      }}
    >
      {isSuccess &&
    <CardContent>
      <Typography variant='h4'>{documents.length > 1 ? documents.length + " arquivos" : documents.length + " arquivo"}</Typography>
      <AppReactApexCharts type='line' height={88} width='100%' options={options} series={series} />
      <Typography color='text.primary' className='font-medium text-center'>
        Uploads diários da semana
      </Typography>
    </CardContent>
      }
      {isError &&
    <CardContent>
      <Typography variant='h6'>{documents.length} Não foi possível carregar esse gráfico.</Typography>
    </CardContent>
      }

    </Card>
  )
}

export default LineChart
