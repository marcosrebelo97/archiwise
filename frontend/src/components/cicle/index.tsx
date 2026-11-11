interface Props {
  color: string
  size?: number
}

export function Circle({ color, size = 20 }: Props) {
  return <div className=' rounded-full' style={{ backgroundColor: color, width: size, height: size }} />
}
