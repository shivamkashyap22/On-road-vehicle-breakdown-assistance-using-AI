import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
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

    console.log("EMAIL:", email)
    console.log("PASSWORD:", password)

    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required')
      return
    }

    setLoading(true)

    try {

      console.log("LOGIN START")

      const data = await login(email, password)

      console.log("LOGIN SUCCESS:", data)

      navigate('/dashboard')

    } catch (err) {

      console.log("LOGIN ERROR:", err)

      setError(
        err.response?.data?.message ||
        err.message ||
        'Login failed'
      )

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

            <span className="font-bold text-xl">
              BreakdownAssist
            </span>

          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Sign in
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => {

                  console.log("EMAIL INPUT:", e.target.value)

                  setEmail(e.target.value)

                }}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="you@example.com"
                autoComplete="email"
              />

            </div>

            <div>

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => {

                  console.log("PASSWORD INPUT:", e.target.value)

                  setPassword(e.target.value)

                }}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Enter password"
                autoComplete="current-password"
              />

            </div>

            {error && (

              <p className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>

            )}

            {/* NORMAL BUTTON USE KARO */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
            >
              {loading ? 'Loading...' : 'Sign in'}
            </button>

          </form>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">

            Don't have an account?{' '}

            <Link
              to="/register"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Register
            </Link>

          </p>

        </motion.div>

      </div>

    </div>
  )
}