import { motion } from 'framer-motion'

export default function Loader({ size = 'md' }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-12 h-12', lg: 'w-16 h-16' }
  return (
    <motion.div
      className={`${sizes[size]} border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin`}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    />
  )
}
