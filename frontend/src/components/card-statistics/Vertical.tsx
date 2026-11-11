// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Types Imports
import { Tooltip } from '@mui/material'

import type { CardStatsVerticalProps } from '@/types/pages/widgetTypes'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

const CardStatVertical = (props: CardStatsVerticalProps) => {
  // Props
  const { title, stats, avatarIcon, avatarColor, trendNumber, trend, subtitle, avatarSkin, avatarSize } = props

  const color = trend === 'negative' ? 'error.main' : trend === 'neutral' ? 'text.disabled' : 'success.main'

  return (
    <Card
      sx={{
        height: '100%'
      }}
    >
      <CardContent>
        <div className='flex justify-between items-center is-full mbe-5'>
          <CustomAvatar color={avatarColor} skin={avatarSkin} size={avatarSize} className='shadow-xs'>
            <i className={avatarIcon} />
          </CustomAvatar>
        </div>
        <div className='flex flex-col gap-1'>
          <Typography color='text.primary' className='font-medium'>
            {title}
          </Typography>
          <div className='flex gap-x-2 gap-y-0.5 items-center flex-wrap'>
            <Tooltip title={stats}>
              <Typography variant='h2'>{stats}</Typography>
            </Tooltip>
            {trend ? (
              <Typography variant='h4' color={color}>
                {`${trend === 'negative' ? '-' : '+'}${trendNumber}`}
              </Typography>
            ) : null}
          </div>
          <Typography variant='body2'>{subtitle}</Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardStatVertical
