import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Archiwise',
    short_name: 'Archiwise',
    description: 'Plataforma para gerenciamento e indexação de arquivos',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#EF8354', // Azul do MUI
    scope: '/',
    id: '/',
    icons: [
      {
        src: 'favicon.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon'
      }
    ],
    categories: ['productivity', 'utilities'],
    related_applications: [],
    prefer_related_applications: false
  }
}
