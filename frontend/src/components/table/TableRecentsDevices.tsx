// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'

// Third-party Imports
// Components Imports
// Styles Imports
import tableStyles from '@core/styles/table.module.css'

// Vars
const rowsData = [
  {
    browser: 'Chrome on Windows',
    device: 'HP Spectre 360',
    location: 'Switzerland',
    recentActivities: '10, Sept 20:07'
  },
  {
    browser: 'Chrome on iPhone',
    device: 'iPhone 12x',
    location: 'Australia',
    recentActivities: '13, Sept 10:10'
  },
  {
    browser: 'Chrome on Android',
    device: 'Oneplus 9 Pro',
    location: 'Dubai',
    recentActivities: '14, Sept 15:15'
  },
  {
    browser: 'Chrome on MacOS',
    device: 'Apple iMac',
    location: 'India',
    recentActivities: '16, Sept 16:17'
  },
  {
    browser: 'Chrome on Windows',
    device: 'HP Spectre 360',
    location: 'Switzerland',
    recentActivities: '20, Sept 21:01'
  },
  {
    browser: 'Chrome on Android',
    device: 'Oneplus 9 Pro',
    location: 'Dubai',
    recentActivities: '21, Sept 12:22'
  }
] as const

function IconForPlatafform({ browser }: { browser: string }) {
  const splitBrowser = browser.split(' ')
  const browserDevice = splitBrowser[splitBrowser.length - 1]

  if (browserDevice === 'Windows') {
    return <i className='ri-microsoft-fill' style={{ color: '#00A8E8' }} />
  }

  if (browserDevice === 'iPhone') {
    return <i className='ri-apple-fill' style={{ color: '#000' }} />
  }

  if (browserDevice === 'Android') {
    return <i className='ri-android-fill' style={{ color: '#3DDC84' }} />
  }

  if (browserDevice === 'MacOS') {
    return <i className='ri-apple-fill' style={{ color: '#000' }} />
  }

  return null
}

const TableRecentsDevices = () => {
  return (
    <Card>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Navegador</th>
              <th>Dispositivo</th>
              <th>Localização</th>
              <th>Último acesso</th>
            </tr>
          </thead>
          <tbody>
            {rowsData.map((row, index) => (
              <tr key={index}>
                <td className='!plb-1'>
                  <div className={'flex gap-4'}>
                    <IconForPlatafform browser={row.browser} />
                    <Typography>{row.browser}</Typography>
                  </div>
                </td>
                <td className='!plb-1'>
                  <Typography>{row.device}</Typography>
                </td>
                <td className='!plb-1'>
                  <Typography>{row.location}</Typography>

                  {/*<div className='flex gap-2'>*/}
                  {/*  <i className={classnames(row.roleIcon, row.iconClass, 'text-[22px]')} />*/}
                  {/*  <Typography color='text.primary'>{row.role}</Typography>*/}
                  {/*</div>*/}
                </td>
                <td className='!pb-1'>
                  <Typography>{row.recentActivities}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default TableRecentsDevices
