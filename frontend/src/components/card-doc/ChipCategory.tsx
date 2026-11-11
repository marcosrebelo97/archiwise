import { Tooltip } from '@mui/material'

import { useListCategories } from '@/hooks/list/useListCategories'

interface Props {
  categoryId: string
}

export const ChipCategory = ({ categoryId }: Props) => {
  const { data: listCategories } = useListCategories()
  const category = listCategories?.find(category => category.id === categoryId)

  return category ? (
    <Tooltip title={category.name}>
      <div
        className='text-white text-xs p-2 rounded-lg w-fit max-w-[150px] overflow-hidden'
        style={{ backgroundColor: `${category.color ? category.color : '#32BAFF'}` }}
      >
      <p className='text-ellipsis line-clamp-1 break-words'>{category.name}</p>
      </div>
    </Tooltip>
  ) : (
    <div className='text-white text-xs p-2 rounded-lg w-fit' style={{ backgroundColor: 'gray' }}>
      Sem Categoria
    </div>
  )
}
