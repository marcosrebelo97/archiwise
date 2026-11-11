import { LoadingButton as LoadingButtonMui } from '@mui/lab'
import { styled } from '@mui/material'

export const LoadingButton = styled(LoadingButtonMui)`
  &.MuiButton-loading {
    background-color: ${({ theme }) => theme.palette.action.disabledBackground};
    color: transparent !important;
  }
`
