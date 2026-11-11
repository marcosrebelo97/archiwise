import Box from '@mui/material/Box'

import { MoreOptions } from '@views/arquivos/ViewPDF/Options/MoreOptions'
import { Zoom } from '@views/arquivos/ViewPDF/Options/Zoom'
import { Search } from '@views/arquivos/ViewPDF/Options/Search'
import { Download } from '@views/arquivos/ViewPDF/Options/Download'
import { Print } from '@views/arquivos/ViewPDF/Options/Print'
import { Pages } from '@views/arquivos/ViewPDF/Options/Pages'

export function ToolbarPDF() {
  return (
    <Box
      className={'w-full  p-4 flex justify-between items-center'}
      sx={{
        backgroundColor: 'primary.main',
        color: 'white'
      }}
    >
      <div className={'flex items-center '}>
        <Search />
        <Pages />
      </div>
      <div>
        <Zoom />
      </div>
      <div>
        <Download />
        <Print />
        <MoreOptions />
      </div>
    </Box>
  )
}
