export function getDateDocument(date: string) {
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  } as const

  return new Date(date).toLocaleDateString('pt-BR', options)
}
