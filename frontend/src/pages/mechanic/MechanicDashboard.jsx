import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../../api/axios'
import { useWebSocket } from '../../hooks/useWebSocket'
import { LogOut, MapPin, Check, X, Navigation } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import ThemeToggle from '../../components/common/ThemeToggle'
import MapView from '../../components/map/MapView'
import StatusBadge from '../../components/common/StatusBadge'

export default function MechanicDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [online, setOnline] = useState(false)
  const [incoming, setIncoming] = useState([])
  const [acceptedRequest, setAcceptedRequest] = useState(null)
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090 })
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [completingId, setCompletingId] = useState(null)

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    )
  }, [])

  const fetchIncoming = () => {
    api.get('/api/mechanic/incoming').then((res) => setIncoming(res.data)).catch(() => setIncoming([]))
  }

  useEffect(() => {
    fetchIncoming()
    const t = setInterval(fetchIncoming, 8000)
    return () => clearInterval(t)
  }, [])

  const toggleOnline = async () => {
    try {
      const { data } = await api.patch('/api/mechanic/status')
      setOnline(data.isOnline)
      if (data.isOnline) {
        await api.put('/api/mechanic/location', {
          latitude: location.lat,
          longitude: location.lng,
        })
      }
      fetchIncoming()
    } catch (e) {
      alert(e.response?.data?.message || 'Failed')
    }
  }

  const sendLocation = (requestId) => {
    api.put('/api/mechanic/location', {
      latitude: location.lat,
      longitude: location.lng,
    }).then(() => {})
  }

  useEffect(() => {
    if (!acceptedRequest?.id || !online) return
    const interval = setInterval(() => sendLocation(acceptedRequest.id), 4000)
    return () => clearInterval(interval)
  }, [acceptedRequest?.id, online, location.lat, location.lng])

  const acceptRequest = async (req) => {
    try {
      await api.patch(`/api/breakdown/${req.id}/accept`)
      setAcceptedRequest(req)
      setIncoming((list) => list.filter((r) => r.id !== req.id))
      await api.patch(`/api/breakdown/${req.id}/start`)
      setAcceptedRequest((r) => (r?.id === req.id ? { ...r, status: 'IN_PROGRESS' } : r))
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to accept')
    }
  }

  const rejectRequest = async (req) => {
    try {
      await api.patch(`/api/breakdown/${req.id}/reject`)
      setIncoming((list) => list.filter((r) => r.id !== req.id))
    } catch (e) {
      alert(e.response?.data?.message || 'Failed')
    }
  }

  const completeRequest = async (reqId) => {
    setCompletingId(reqId)
    try {
      await api.patch(`/api/breakdown/${reqId}/complete`)
      setShowCompleteModal(false)
      setAcceptedRequest(null)
      setCompletingId(null)
    } catch (e) {
      alert(e.response?.data?.message || 'Failed')
      setCompletingId(null)
    }
  }

  const userPos = acceptedRequest
    ? { lat: Number(acceptedRequest.userLatitude), lng: Number(acceptedRequest.userLongitude) }
    : null
  const markers = [
    { lat: location.lat, lng: location.lng, label: 'You' },
    ...(userPos ? [{ ...userPos, label: 'Customer' }] : []),
  ]
  const center = userPos
    ? { lat: (location.lat + userPos.lat) / 2, lng: (location.lng + userPos.lng) / 2 }
    : location

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="glass border-b border-white/10 dark:border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg text-gray-900 dark:text-white">Mechanic Dashboard</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{user?.fullName}</span>
            <ThemeToggle />
            <Button variant="ghost" onClick={() => { logout(); navigate('/'); }} className="gap-1">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <Card className="flex flex-row items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Status</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {online ? 'You are visible to users' : 'Go online to receive requests'}
            </p>
          </div>
          <motion.button
            onClick={toggleOnline}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              online ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={{ x: online ? 24 : 4 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow"
            />
          </motion.button>
        </Card>

        {online && (
          <>
            <div className="rounded-2xl overflow-hidden h-[260px]">
              <MapView center={center} zoom={14} markers={markers} className="w-full h-full" />
            </div>

            {!acceptedRequest && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Incoming requests</h2>
                {incoming.length === 0 ? (
                  <Card>
                    <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                      No pending requests. Wait for users to request help.
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {incoming.map((req) => (
                      <Card key={req.id} className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            #{req.id} — {req.problemType?.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {req.userFullName || 'User'} • {req.userLatitude?.toFixed(4)}, {req.userLongitude?.toFixed(4)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="secondary" onClick={() => rejectRequest(req)} className="gap-1">
                            <X className="w-4 h-4" /> Reject
                          </Button>
                          <Button onClick={() => acceptRequest(req)} className="gap-1">
                            <Check className="w-4 h-4" /> Accept
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {acceptedRequest && (
              <Card>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Active job #{acceptedRequest.id}</h3>
                    <StatusBadge status={acceptedRequest.status || 'IN_PROGRESS'} />
                  </div>
                  <Button
                    onClick={() => setShowCompleteModal(true)}
                  >
                    Mark completed
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Customer location: {acceptedRequest.userLatitude?.toFixed(5)}, {acceptedRequest.userLongitude?.toFixed(5)}
                </p>
              </Card>
            )}
          </>
        )}
      </main>

      {showCompleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCompleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card max-w-sm w-full"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Complete job?</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Confirm that you have finished the job for request #{acceptedRequest?.id}.
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setShowCompleteModal(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                loading={completingId === acceptedRequest?.id}
                onClick={() => completeRequest(acceptedRequest?.id)}
              >
                Confirm
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
