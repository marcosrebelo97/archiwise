import Image from 'next/image'

import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'

import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'

import { Skeleton } from '@mui/material'

import Link from '@components/Link'

import { ChipCategory } from '@components/card-doc/ChipCategory'

import { useListDocsByTitle } from '@/hooks/list/useListDocsByTitle'
import type { UserDocument } from '@/types/project'
import { getDateDocument } from '@/utils/data'
import { useRegisterSearch } from '@/hooks/create/useRegisterSearch'

interface Props {
  search: string
  categoryId: string
  onClose?: () => void
}

function ShimmerItemDoc() {
  return <Skeleton variant='text' width={'100%'} height={20} />
}

function ItemDoc({ doc }: { doc: UserDocument }) {
  return (
    <Link href={`/arquivos/${doc.id}`} passHref>
      <MenuItem className={'flex flex-row gap-4 w-full items-center'}>
        <Image
          src={doc.name.includes('.pdf') ? '/doc-icons/pdf.png' : '/doc-icons/doc.png'}
          alt='Doc Icon'
          width={25}
          height={25}
        />
        <div className={'flex flex-col gap-1 overflow-hidden text-ellipsis'}>
          <Typography variant='body1' className={'overflow-hidden text-ellipsis'}>
            {doc.name}
          </Typography>
          <Typography variant='caption'>{getDateDocument(doc.createdAt)}</Typography>
        </div>
        <div className={'flex-1 flex justify-end items-center'}>
          <ChipCategory categoryId={doc.categoryId} />
        </div>
      </MenuItem>
    </Link>
  )
}

function Loading() {
  return (
    <>
      <ShimmerItemDoc />
      <ShimmerItemDoc />
    </>
  )
}

export function ListSearch({ categoryId, search, onClose }: Props) {
  const { data, isLoading } = useListDocsByTitle(search, categoryId)
  const isResultEmpty = !isLoading && data && data.length === 0
  const { onRegisterSearch } = useRegisterSearch()

  const registerAdvancedSearch = () => {
    if (search.trim().length > 0) {
      onRegisterSearch(search)
    }
  }

  return (
    <Paper className='flex  gap-2 flex-col absolute top-full left-0 right-0 mt-1'>
      <MenuList className={'flex flex-col gap-2'}>
        {isLoading && <Loading />}
        {!isResultEmpty && data?.map(doc => <ItemDoc key={doc.id} doc={doc} />)}
        {isResultEmpty && (
          <Typography variant='body1' className={'mx-2'}>
            Nenhum resultado encontrado. Faça uma pesquisa avançada para resultados mais precisos.
          </Typography>
        )}
      </MenuList>
      <Link href={`/pesquisa?q=${search}`} passHref onClick={registerAdvancedSearch}>
        <Button className={'flex flex-row gap-2 justify-start w-full'} color={'secondary'} onClick={onClose}>
          <i className='ri-search-line' />
          <div className='whitespace-nowrap select-none text-textDisabled'>
            <span className={'mr-3 font-bold italic'}>{search}</span> Pesquisa avançada
          </div>
        </Button>
      </Link>
    </Paper>
  )
}
