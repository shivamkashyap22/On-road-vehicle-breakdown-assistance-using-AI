import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Battery, CircleDot, Thermometer, Car, MessageCircle, LogOut, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/axios'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import ThemeToggle from '../../components/common/ThemeToggle'
import MapView from '../../components/map/MapView'

const PROBLEMS = [
  { type: 'BATTERY_DEAD', label: 'Battery Dead', icon: Battery },
  { type: 'TYRE_PUNCTURE', label: 'Tyre Puncture', icon: CircleDot },
  { type: 'ENGINE_OVERHEATING', label: 'Engine Overheating', icon: Thermometer },
  { type: 'VEHICLE_NOT_STARTING', label: 'Vehicle Not Starting', icon: Car },
]

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [position, setPosition] = useState({ lat: 28.6139, lng: 77.2090 })
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [requests, setRequests] = useState([])

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    )
  }, [])

  useEffect(() => {
    api.get('/api/breakdown/my-requests').then((res) => setRequests(res.data)).catch(() => {})
  }, [])

  const handleRequest = async () => {
    if (!selectedProblem) return
    setLoading(true)
    try {
      const { data } = await api.post('/api/breakdown/request', {
        problemType: selectedProblem,
        userLatitude: position.lat,
        userLongitude: position.lng,
        description: description || undefined,
      })
      setRequests((r) => [data, ...r])
      navigate(`/request/${data.id}`)
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to create request')
    } finally {
      setLoading(false)
    }
  }

  const latestRequest = requests[0]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="glass border-b border-white/10 dark:border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg text-gray-900 dark:text-white">Dashboard</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{user?.fullName}</span>
            <Link to={latestRequest ? `/chat/${latestRequest.id}` : '/chat'}>
              <Button variant="ghost" className="gap-1">
                <MessageCircle className="w-4 h-4" /> Chat
              </Button>
            </Link>
            <ThemeToggle />
            <Button variant="ghost" onClick={() => { logout(); navigate('/'); }} className="gap-1">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden h-[280px] md:h-[320px]"
        >
          <MapView
            center={position}
            zoom={15}
            markers={[{ lat: position.lat, lng: position.lng, label: 'You' }]}
            className="w-full h-full"
          />
        </motion.div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">What's the problem?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PROBLEMS.map((p) => (
              <motion.div
                key={p.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedProblem(selectedProblem === p.type ? null : p.type)}
                className={`glass-card cursor-pointer transition-all border-2 ${
                  selectedProblem === p.type
                    ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-transparent'
                }`}
              >
                <p.icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" />
                <p className="font-medium text-gray-900 dark:text-white text-sm">{p.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {selectedProblem && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="glass-card"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Details (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your situation..."
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 min-h-[80px] focus:ring-2 focus:ring-primary-500 outline-none"
              rows={3}
            />
            <Button
              className="mt-3 w-full md:w-auto"
              loading={loading}
              onClick={handleRequest}
            >
              <MapPin className="w-4 h-4 inline mr-2" /> Request Mechanic
            </Button>
          </motion.div>
        )}

        {requests.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Your requests</h2>
            <div className="space-y-2">
              {requests.slice(0, 5).map((req) => (
                <Link key={req.id} to={`/request/${req.id}`}>
                  <Card hover className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">#{req.id} - {req.problemType?.replace(/_/g, ' ')}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      req.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                      req.status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                    }`}>
                      {req.status}
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
