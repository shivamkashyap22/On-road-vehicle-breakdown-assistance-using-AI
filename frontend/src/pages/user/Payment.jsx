import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import Button from '../../components/common/Button'

export default function Payment() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2500)
    }, 1500)
  }

  if (success) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
      >
        <div className="glass-card text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you. This is a dummy payment for demo.
          </p>
          <Button onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Request #{id} — Dummy payment for demo (no real charge).
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="4242 4242 4242 4242"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="MM/YY"
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            Pay (demo)
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
