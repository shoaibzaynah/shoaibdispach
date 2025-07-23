              <p className="text-sm text-muted-foreground mb-4">
                I can help you with courier management, tracking, data formatting, and more. I have access to your complete shipment database.
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Track any shipment: "'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, Sparkles, Minimize2, Maximize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatMessage } from '@/types'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export function GPTAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Use advanced GPT API with full database access
      const response = await fetch('/api/gpt/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversation_history: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.data?.message || 'I can help you with courier management, tracking, and more!',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])

      // Show function result if available
      if (data.data?.function_called && data.data?.function_result) {
        toast.success(`Executed: ${data.data.function_called}`)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to get AI response')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  const clearChat = () => {
    setMessages([])
  }

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all z-40 group"
      >
        <MessageSquare className="w-6 h-6 text-primary-foreground group-hover:scale-110 transition-transform" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
      </motion.button>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={cn(
          "fixed right-0 top-0 h-full bg-card border-l border-border shadow-2xl z-50 flex flex-col",
          isMinimized ? "w-80" : "w-full lg:w-96"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="w-5 h-5 text-primary" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <p className="font-medium mb-2">Hi! I'm your AI assistant</p>
              <p className="text-sm text-muted-foreground mb-4">
                I can help you with courier management, tracking, data formatting, and more. I have access to your complete shipment database.
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Track any shipment: "Track PX123456"</p>
                <p>• Search by customer: "Find shipments for Ali Ahmed"</p>
                <p>• Cancel orders: "Cancel PX123456 - customer request"</p>
                <p>• Get stats: "Show PostEx performance this month"</p>
                <p>• Create booking: "Book shipment to Karachi"</p>
                <p>• Revenue data: "Total revenue this week"</p>
                <p>• Search by amount: "Show orders above 5000 PKR"</p>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Cmd</kbd> + <kbd className="px-1 py-0.5 bg-muted rounded text-xs">/</kbd> to toggle
              </div>
            </motion.div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-lg text-sm",
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-4'
                    : 'bg-muted mr-4'
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm">AI is thinking...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-muted/50">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
            >
              Clear conversation
            </button>
          )}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 input text-sm"
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Powered by GPT-4</span>
            <span>{input.length}/500</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
