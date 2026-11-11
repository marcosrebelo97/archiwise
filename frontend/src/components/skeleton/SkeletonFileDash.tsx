import { Skeleton } from '@mui/material'

export function SkeletonFileDash() {
  return (
    <Skeleton
      variant='rounded'
      width={250}
      height={290}
      className='w-[24em] flex flex-col border rounded-2xl shadow-md'
    />
  )
}
