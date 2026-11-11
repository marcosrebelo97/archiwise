import { Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid2'

export function SkeletonFileSearch() {
  return (
    <Grid
      size={{
        xs: 12,
        sm: 6,
        md: 4,
        lg: 3
      }}
    >
      <Skeleton
        variant='rounded'
        width={'100%'}
        height={200}
        className='h-[25em] w-[24em] flex flex-col border rounded-2xl shadow-md'
      />
    </Grid>
  )
}
