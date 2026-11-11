import Image from 'next/image'

interface Type {
  documentUser: { type: string; name: string }
}

export function IconFile({ documentUser }: Type) {
  function getIcon(type: string) {
    if (type === 'pdf') return '/doc-icons/pdf.png'
    if (type === 'doc' || type === 'docx' || type === 'odt') return '/doc-icons/doc.png'
    if (type === 'pptx' || type === 'odp' || type === 'ppt') return '/doc-icons/ppt.png'
    if (type === 'xls' || type === 'xlsx' || type === 'ods') return '/doc-icons/xls.png'

    return '/doc-icons/doc.png'
  }

  const icon = getIcon(documentUser.name.split('.').pop() || '')

  return <Image src={icon} alt='Doc Icon' width={25} height={25} style={{ cursor: 'cli', objectPosition: 'top' }} />
}
