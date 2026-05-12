import { motion } from 'framer-motion'

const statusConfig = {
  PENDING: { label: 'Pending', class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  ACCEPTED: { label: 'Accepted', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  IN_PROGRESS: { label: 'In Progress', class: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' },
  COMPLETED: { label: 'Completed', class: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
  REJECTED: { label: 'Rejected', class: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
}

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}
    >
      {config.label}
    </motion.span>
  )
}
