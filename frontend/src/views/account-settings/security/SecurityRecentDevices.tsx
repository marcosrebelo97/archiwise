'use client'

// MUI Imports
import * as React from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

import TableRecentsDevices from '@components/table/TableRecentsDevices'

const SecurityRecentDevices = () => {
  return (
    <Card>
      <CardHeader title='Dispositivos recentes' />
      <TableRecentsDevices />
    </Card>
  )
}

export default SecurityRecentDevices
