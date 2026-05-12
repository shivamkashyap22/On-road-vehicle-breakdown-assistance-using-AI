import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wrench, MapPin, MessageCircle, Shield } from 'lucide-react'
import Button from '../components/common/Button'
import ThemeToggle from '../components/common/ThemeToggle'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-primary-900/20">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Wrench className="w-8 h-8 text-primary-600" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">BreakdownAssist</span>
          </motion.div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-20 px-4">
        <section className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6"
          >
            On-Road Vehicle{' '}
            <span className="text-primary-600 dark:text-primary-400">Breakdown Assistance</span>
            <br />
            <span className="text-lg md:text-2xl font-normal text-gray-600 dark:text-gray-300 mt-2 block">
              AI-Powered Help When You Need It
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Stuck on the road? Request a mechanic in one tap. Track help in real time and chat with our AI assistant for instant tips.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/register">
              <Button variant="primary" className="text-lg px-8 py-3">
                I need help
              </Button>
            </Link>
            <Link to="/register?role=mechanic">
              <Button variant="secondary" className="text-lg px-8 py-3">
                I'm a mechanic
              </Button>
            </Link>
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mt-32 grid md:grid-cols-3 gap-8"
        >
          {[
            { icon: MapPin, title: 'Live tracking', desc: 'See your mechanic on the map in real time.' },
            { icon: MessageCircle, title: 'AI chat', desc: 'Get instant advice from our AI assistant.' },
            { icon: Shield, title: 'Safe & fast', desc: 'Verified mechanics and quick response.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card text-center"
            >
              <item.icon className="w-12 h-12 mx-auto text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </motion.section>
      </main>
    </div>
  )
}
