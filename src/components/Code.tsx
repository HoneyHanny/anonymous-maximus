import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from './ui/button'
import { Copy, Eye, EyeOff } from 'lucide-react'
import { copyText } from '@/lib/utils'

interface CodeProps {
  id: string
}

async function fetchRoom(id: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/rooms/${id}`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch room')
  }
  return response.json()
}

const Code = ({ id }: CodeProps) => {
  const [hidden, setHidden] = useState<boolean>(true)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['room', id],
    queryFn: () => fetchRoom(id),
    enabled: !!id,
  })

  if (isLoading) return <div>Loading room...</div>
  if (isError) return <div>Error: {(error as Error).message}</div>

  return (
    <div className="flex items-center gap-2">
      <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
        {hidden ? '••••••' : data.code}
      </code>
      <Button onClick={() => setHidden(!hidden)}>
        {hidden ? <EyeOff /> : <Eye />}
      </Button>
      <Button
        onClick={() => copyText(data!.code)}
      >
        <Copy />
      </Button>
    </div>
  )
}

export default Code
