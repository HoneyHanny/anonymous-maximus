import Code from '@/components/Code'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'

export const Route = createFileRoute('/rooms/$roomId')({
  component: RouteComponent,
})

import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import type { Message } from '@/types/message'
import MessageList from '@/components/Message/MessageList'
import Chatbox from '@/components/Message/Chatbox'

function RouteComponent() {
  const { roomId } = Route.useParams()

  const [authorized, setAuthorized] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)

  // Get code from query params using React best practices
  const [code, setCode] = useState<string | null>(null)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setCode(params.get('code'))
  }, [])

  // Verify code with API using tanstack query
  const fetchMessagesMutation = useMutation({
    mutationFn: async (roomId: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/rooms/${roomId}/messages`,
      )
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      return response.json()
    },
    onSuccess: (data) => {
      setMessages(
        data.map((m: any) => ({
          content: m.content,
          type: 'incoming', // Default to incoming for history for now
          timestamp: new Date(m.timestamp),
        })),
      )
    },
  })

  const verifyCodeMutation = useMutation({
    mutationFn: async ({ roomId, code }: { roomId: string; code: string }) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/rooms/${roomId}/verify-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        },
      )
      if (!response.ok) {
        throw new Error('Invalid code')
      }
      return response.json()
    },
    onSuccess: () => {
      setAuthorized(true)
      fetchMessagesMutation.mutate(roomId)
      // Remove code from URL after verification
      const params = new URLSearchParams(window.location.search)
      params.delete('code')
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}?${params.toString()}`,
      )
    },
    onError: () => {
      setAuthorized(false)
    },
  })
  useEffect(() => {
    if (code && !authorized) {
      verifyCodeMutation.mutate({ roomId, code })
    }
  }, [code, authorized, roomId])

  // Connect to socket.io server with roomId and code (when authorized)

  useEffect(() => {
    if (!authorized || !code) return
    const s: Socket = io(import.meta.env.VITE_API_URL, {
      auth: { roomId, code },
    })
    setSocket(s)
    s.on(
      'receiveMessage',
      (msg: {
        content: string
        timestamp: string
        senderSocketId?: string
      }) => {
        setMessages((prev) => [
          ...prev,
          {
            content: msg.content,
            type: msg.senderSocketId === s.id ? 'outgoing' : 'incoming',
            timestamp: new Date(msg.timestamp),
          },
        ])
      },
    )
    return () => {
      if (s) s.disconnect()
    }
  }, [authorized, code, roomId])

  // ...existing code...

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (socket && message.trim()) {
      socket.emit('sendMessage', {
        content: message,
        roomId,
        timestamp: new Date().toISOString(),
      })
      setMessage('')
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      {/* Header Info */}
      <div className="sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur py-3 px-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Room Code
              </span>
              <Code id={roomId} />
            </div>
            <div className="h-8 w-1px bg-border mx-2" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Room ID
              </span>
              <code className="text-sm font-mono font-medium truncate max-w-30">
                {roomId}
              </code>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {verifyCodeMutation.isPending && (
              <span className="text-xs font-medium text-muted-foreground animate-pulse">
                Connecting...
              </span>
            )}
            {verifyCodeMutation.isError && (
              <span className="text-xs font-medium text-destructive">
                Failed to connect
              </span>
            )}
            {authorized && !verifyCodeMutation.isPending && !verifyCodeMutation.isError && (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground">
                  Live
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto pb-32 pt-6 px-8">
        <div className="max-w-3xl mx-auto">
          <MessageList messages={messages} />
        </div>
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-linear-to-t from-background via-background to-transparent pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <Chatbox
            message={message}
            setMessage={(value) => {
              setMessage(value)
            }}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}
