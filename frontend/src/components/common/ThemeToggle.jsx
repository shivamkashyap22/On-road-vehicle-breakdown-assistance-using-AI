import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { dark, toggle } = useTheme()
  return (
    <motion.button
      type="button"
      onClick={toggle}
      className="p-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </motion.button>
  )
}
