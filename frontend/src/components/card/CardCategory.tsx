import { useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { Stack } from '@mui/material'

import IconButton from '@mui/material/IconButton'

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import { MenuItemDanger } from '@components/menu/Menu'

import Link from '@components/Link'
import { Circle } from '@components/cicle'

import { useCategoriesContext } from '@/hooks/contexts/useCategoriesContext'
import type { Category } from '@/types/project'

interface Props {
  category: Category
}

export function CardCategory({ category }: Props) {
  const { handleEditCategory, handleDeleteCategory } = useCategoriesContext()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  function handleDelete() {
    handleDeleteCategory(category)
    handleClose()
  }

  function handleEdit() {
    handleEditCategory(category)
    handleClose()
  }

  const color = '#32BAFF'

  return (
    <Card className={'h-full'}>
      <CardContent>
        <Stack direction={'row'} spacing={2} alignItems={'center'}>
          <Link
            href={`/categorias/${category.id}`}
            className={'flex row gap-4 flex-1 hover:underline hover:cursor-pointer items-center'}
          >
            <Circle color={category.color ? category.color : color} />
            <div className={'flex flex-col gap-0 overflow-hidden'}>
              <Typography variant={'h6'} className=' text-ellipsis break-all line-clamp-1'>{category.name}</Typography>
              {category.description && <Typography variant={'body2'} className='text-ellipsis break-words line-clamp-2'>{category.description}</Typography>}
            </div>
          </Link>

          <IconButton onClick={handleClick}>
            <i className='ri-more-fill' />
          </IconButton>
        </Stack>
      </CardContent>
      <Menu
        id='menu-category'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem className='gap-3 pr-8' onClick={handleEdit}>
          <i className='ri-pencil-line' />
          <Typography color='text.primary'>Editar</Typography>
        </MenuItem>
        <MenuItemDanger className='gap-3' onClick={handleDelete}>
          <i className='ri-delete-bin-line' />
          <Typography color='text.primary'>Excluir</Typography>
        </MenuItemDanger>
      </Menu>
    </Card>
  )
}
