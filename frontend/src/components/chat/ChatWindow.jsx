import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SenderType = { USER: 'USER', MECHANIC: 'MECHANIC', AI: 'AI' }

export default function ChatWindow({ messages = [], onSend, loading = false, placeholder = 'Type a message...' }) {
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = inputRef.current?.value?.trim()
    if (!text || loading) return
    onSend(text)
    inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.senderType === SenderType.USER ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.senderType === SenderType.USER
                    ? 'bg-primary-600 text-white rounded-br-md'
                    : msg.senderType === SenderType.AI
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
                    : 'bg-green-100 dark:bg-green-900/40 text-gray-900 dark:text-gray-100 rounded-bl-md'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                {msg.createdAt && (
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-2 flex gap-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            disabled={loading}
          />
          <motion.button
            type="submit"
            className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50"
            whileTap={{ scale: 0.98 }}
          >
            Send
          </motion.button>
        </div>
      </form>
    </div>
  )
}
