import MenuItem from '@mui/material/MenuItem'
import { lighten, styled } from '@mui/material/styles'

export const MenuItemDanger = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.error.main,
  '&:hover': {
    backgroundColor: lighten(theme.palette.error.light, 0.85)
  },
  '& .MuiListItemIcon-root': {
    color: theme.palette.error.main
  },
  '& .MuiListItemText-root': {
    color: theme.palette.error.main
  },
  '& .MuiTypography-root': {
    color: theme.palette.error.main
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.error.main
  },
  '& .MuiSvgIcon-root path': {
    fill: theme.palette.error.main
  }
}))
