import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = false, ...props }) {
  const Comp = motion.div
  return (
    <Comp
      className={`glass-card ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { scale: 1.02, transition: { duration: 0.2 } } : undefined}
      {...props}
    >
      {children}
    </Comp>
  )
}
