import React from 'react'

import type { AvatarProps } from '@mui/material/Avatar'
import Avatar from '@mui/material/Avatar'
import { Skeleton } from '@mui/material'

interface User {
  name?: string
  photoURL?: string | null
}

interface CustomAvatarProps extends AvatarProps {
  user?: User
}

const getInitials = (fullName: string): string => {
  const names = fullName.trim().split(' ')

  if (names.length === 1) {
    // Se não houver sobrenome, retorna a primeira letra duas vezes
    return names[0][0].toUpperCase() + names[0][0].toUpperCase()
  }

  // Retorna as iniciais do primeiro nome e do último nome
  return (names[0][0] + names[names.length - 1][0]).toUpperCase()
}

function stringToColor(string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff

    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      color: 'white !important'
    },
    children: getInitials(name)
  }
}

const UserAvatar: React.FC<CustomAvatarProps> = ({ user, ...avatarProps }) => {
  if (!user) {
    return <Avatar {...avatarProps} src='/images/avatars/8.png' />
  }

  const { name, photoURL } = user

  // Função para gerar as iniciais
  if (photoURL) {
    return <Avatar {...avatarProps} src={photoURL} alt={name} />
  }

  if (name) {
    return <Avatar {...avatarProps} {...stringAvatar(name)} />
  }

  return <Skeleton variant='circular' width={40} height={40} />
}

export default UserAvatar
