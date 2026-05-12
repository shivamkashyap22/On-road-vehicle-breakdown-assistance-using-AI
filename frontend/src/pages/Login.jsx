import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import ThemeToggle from '../components/common/ThemeToggle'
import { Wrench } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Email and password are required')
      return
    }
    setLoading(true)
    try {
      const data = await login(email, password)
      if (data.role === 'MECHANIC') navigate('/mechanic')
      else navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <header className="p-4 flex justify-end">
        <ThemeToggle />
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass-card"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Wrench className="w-8 h-8 text-primary-600" />
            <span className="font-bold text-xl">BreakdownAssist</span>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Sign in</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <Button type="submit" className="w-full" loading={loading}>
              Sign in
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
