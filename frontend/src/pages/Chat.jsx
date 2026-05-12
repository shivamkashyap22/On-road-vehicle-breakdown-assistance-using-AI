import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../api/axios'
import ChatWindow from '../components/chat/ChatWindow'

export default function Chat() {
  const { requestId } = useParams()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!requestId) {
      setMessages([])
      return
    }
    api.get(`/api/chat/${requestId}`).then((res) => setMessages(res.data)).catch(() => setMessages([]))
  }, [requestId])

  const handleSend = async (text) => {
    if (!requestId) return
    setMessages((m) => [...m, { id: Date.now(), senderType: 'USER', message: text, createdAt: new Date().toISOString() }])
    setLoading(true)
    try {
      const { data } = await api.post('/api/chat', { requestId: Number(requestId), message: text })
      setMessages((m) => [...m, { ...data, id: data.id || Date.now() + 1 }])
    } catch (e) {
      setMessages((m) => m.filter((x) => x.id !== Date.now()))
      alert(e.response?.data?.message || 'Send failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="glass border-b border-white/10 dark:border-gray-700/50 p-4 flex items-center gap-4">
        <Link to="/dashboard" className="text-primary-600 dark:text-primary-400 hover:underline">
          ← Back
        </Link>
        <h1 className="font-semibold text-gray-900 dark:text-white">
          {requestId ? `Chat — Request #${requestId}` : 'AI Assistant'}
        </h1>
      </header>
      <div className="flex-1 max-w-2xl w-full mx-auto p-4 flex flex-col">
        {requestId ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 min-h-[400px]"
          >
            <ChatWindow
              messages={messages}
              onSend={handleSend}
              loading={loading}
              placeholder="Ask for help or describe your issue..."
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex items-center justify-center text-gray-600 dark:text-gray-400"
          >
            <p>Start a breakdown request from the dashboard to chat with the AI assistant for that request.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
