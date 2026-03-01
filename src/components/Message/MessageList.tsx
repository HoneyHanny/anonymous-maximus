import type { Message } from '@/types/message'

interface MessageListProps {
  messages: Message[]
}

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg, index) => {
        const isOutgoing = msg.type === 'outgoing'
        return (
          <div
            key={index}
            className={`flex w-full ${isOutgoing ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
                isOutgoing
                  ? 'bg-primary text-primary-foreground rounded-tr-none'
                  : 'bg-muted text-foreground rounded-tl-none'
              }`}
            >
              <div className="text-sm break-words">{msg.content}</div>
              <div
                className={`text-[10px] mt-1 opacity-70 ${
                  isOutgoing ? 'text-right' : 'text-left'
                }`}
              >
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MessageList
