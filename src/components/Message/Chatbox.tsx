import { type FormEvent } from 'react'
import { SendHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface ChatboxProps {
  onSubmit: (e: FormEvent) => void
  message: string
  setMessage: (value: string) => void
}

const Chatbox = ({ onSubmit, message, setMessage }: ChatboxProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex gap-2 items-center p-2 bg-background border rounded-full shadow-lg"
    >
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim()}
        className="rounded-full h-10 w-10 shrink-0 shadow-sm"
      >
        <SendHorizontal className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  )
}

export default Chatbox
