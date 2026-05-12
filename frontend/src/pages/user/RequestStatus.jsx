import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../../api/axios'
import { useWebSocket } from '../../hooks/useWebSocket'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import StatusBadge from '../../components/common/StatusBadge'
import MapView from '../../components/map/MapView'

const STEPS = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED']

export default function RequestStatus() {
  const { id } = useParams()
  const [request, setRequest] = useState(null)
  const [mechanicLocation, setMechanicLocation] = useState(null)
  const { data: wsData } = useWebSocket(id ? `/topic/request/${id}` : null)

  useEffect(() => {
    if (!id) return
    api.get(`/api/breakdown/${id}`).then((res) => setRequest(res.data)).catch(() => setRequest(null))
  }, [id])

  useEffect(() => {
    if (wsData?.latitude != null && wsData?.longitude != null) {
      setMechanicLocation({ lat: Number(wsData.latitude), lng: Number(wsData.longitude) })
    }
    if (wsData?.status) setRequest((r) => (r ? { ...r, status: wsData.status } : null))
    if (wsData?.id) setRequest((r) => (r ? { ...r, ...wsData } : wsData))
  }, [wsData])

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const userPos = {
    lat: Number(request.userLatitude),
    lng: Number(request.userLongitude),
  }
  const markers = [
    { lat: userPos.lat, lng: userPos.lng, label: 'You' },
    ...(mechanicLocation ? [{ ...mechanicLocation, label: 'Mechanic' }] : []),
  ]
  const center = mechanicLocation
    ? {
        lat: (userPos.lat + mechanicLocation.lat) / 2,
        lng: (userPos.lng + mechanicLocation.lng) / 2,
      }
    : userPos

  const currentStepIndex = STEPS.indexOf(request.status) >= 0 ? STEPS.indexOf(request.status) : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/dashboard" className="inline-block text-primary-600 dark:text-primary-400 hover:underline">
          ← Back to dashboard
        </Link>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Request #{request.id}</h1>
              <p className="text-gray-600 dark:text-gray-400 capitalize">
                {request.problemType?.replace(/_/g, ' ')}
              </p>
            </div>
            <StatusBadge status={request.status} />
          </div>
        </Card>

        <div className="glass-card">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Status timeline</h2>
          <div className="flex justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 mx-8" style={{ width: 'calc(100% - 4rem)' }} />
            {STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center flex-1 relative z-10">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: i <= currentStepIndex ? 'rgb(59, 130, 246)' : 'rgb(229, 231, 235)',
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800 shadow"
                >
                  {i < currentStepIndex ? '✓' : i + 1}
                </motion.div>
                <span className="text-xs mt-1 text-gray-600 dark:text-gray-400 capitalize">
                  {step.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden h-[300px]">
          <MapView center={center} zoom={14} markers={markers} className="w-full h-full" />
        </div>

        {request.status === 'COMPLETED' && (
          <Link to={`/payment/${request.id}`}>
            <Button className="w-full">Proceed to payment</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
