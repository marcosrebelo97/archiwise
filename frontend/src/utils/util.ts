// import { filesAllowed } from "./enums"

export function iconTypeFile(type: string) {
  // Para PDF (application/pdf)
  if (type === 'application/pdf') {
    return '/images/logos/file-pdf.png'
  }

  // Para Word (application/msword ou application/vnd.openxmlformats-officedocument.wordprocessingml.document)
  if (
    type === 'application/msword' ||
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return '/images/logos/file-doc.png'
  }

  // Caso não seja PDF ou DOC/DOCX, retornamos algo genérico (ou string vazia, se preferir)
  return '/images/logos/file-generic.png'
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  const fileSize = (bytes / Math.pow(k, i)).toFixed(2)

  return `${fileSize} ${sizes[i]}`
}

export function validateFileName(name: string) {
  const filesAllowed = ['pdf', 'doc', 'docx', 'pptx', 'ppt', 'xls', 'xlsx', 'odt', 'ods', 'odp']
  const extension = name.slice(name.indexOf('.'), name.length - 1)

  if (!filesAllowed.includes(extension)) {
    throw new Error('Name not allowed')
  }

  if (name.trim().length === 0) {
  }
}
