// MUI Imports
import Grid from '@mui/material/Grid2'

// Components Imports
/*
import Award from '@views/dashboard/Award'
import DepositWithdraw from '@views/dashboard/DepositWithdraw'
import TotalEarning from '@views/dashboard/TotalEarning'
import Table from '@views/dashboard/Table'
import Transactions from '@views/dashboard/Transactions'
*/
import { Box } from '@mui/material'

import LineChart from '@views/dashboard/LineChart'
import DistributedColumnChart from '@views/dashboard/DistributedColumnChart'
import MostViewdDocs from '@views/dashboard/SalesByCountries'

import MonthUploadActivity from '@/views/dashboard/MonthUploadActivity'
import { Storage } from '@/views/dashboard/Storage'
import { MostSearchedTerm } from '@/views/dashboard/MostSearchedTerm';
import { NewUploadsCount } from '@/views/dashboard/NewUploadsCount';

const DashboardAnalytics = () => {

  return (
    <Grid container spacing={6} alignItems='stretch'>
      {/*  <Grid item xs={12} md={4}>
        <Award />
      </Grid>
      <Grid item xs={12} md={8} lg={8}>
        <Transactions />
      </Grid> */}
      <Grid
        spacing={4}
        size={{
          xs: 12,
          md: 6,
          lg: 8
        }}
        alignItems='stretch'
      >
        <Box sx={{ flexGrow: 1, height: '100%' }}>
          <MonthUploadActivity />
        </Box>
      </Grid>
      {/*
      <Grid item xs={12} md={6} lg={4}>
        <TotalEarning />
      </Grid> */}
      <Grid
        size={{
          xs: 12,
          md: 6,
          lg: 4
        }}
      >
        <Grid
          container
          spacing={6}
          sx={{
            height: '100%'
          }}
          alignItems='stretch'
        >
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <LineChart />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <MostSearchedTerm />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <NewUploadsCount />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <DistributedColumnChart />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 6,
          lg: 8
        }}
      >
        <MostViewdDocs />
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 6,
          lg: 4
        }}
      >
        <Storage />
      </Grid>
      {/* <Grid item xs={12} lg={8}>
        <DepositWithdraw />
      </Grid>
      <Grid item xs={12}>
        <Table />
      </Grid> */}
    </Grid>
  )
}

export default DashboardAnalytics
