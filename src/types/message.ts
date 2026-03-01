export interface Message {
  content: string
  type: 'incoming' | 'outgoing'
  timestamp: Date
}
