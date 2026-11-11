// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import SecurityPassword from '@views/account-settings/security/SecurityPassword'

const Security = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <SecurityPassword />
      </Grid>
      {/*<Grid size={12}>*/}
      {/*  <SecurityRecentDevices />*/}
      {/*</Grid>*/}
    </Grid>
  )
}

export default Security
