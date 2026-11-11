import { saveAs } from 'file-saver'

export function downloadFile(fileUrl: string, fileName: string) {
  // Faz a chamada GET na rota de download
  saveAs(fileUrl, fileName)
}
