import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Google Map with custom theme and markers.
 * Expects window.google from script loaded in index.html or parent.
 * Props: center = { lat, lng }, zoom, markers = [{ lat, lng, label }]
 */
export default function MapView({ center = { lat: 28.6139, lng: 77.2090 }, zoom = 14, markers = [], className = '' }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [mapReady, setMapReady] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (key && !window.google && !document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
    const check = setInterval(() => {
      if (window.google && mapRef.current) {
        clearInterval(check)
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: center.lat, lng: center.lng },
          zoom,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        })
        mapInstanceRef.current = map
        setMapReady(true)
      }
    }, 300)
    const fail = setTimeout(() => {
      clearInterval(check)
      if (!mapInstanceRef.current) setLoadError(true)
    }, 10000)
    return () => { clearInterval(check); clearTimeout(fail) }
  }, [])

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return
    mapInstanceRef.current.setCenter(center)
    mapInstanceRef.current.setZoom(zoom)
  }, [mapReady, center?.lat, center?.lng, zoom])

  const markersRef = useRef([])
  useEffect(() => {
    if (!mapReady || !window.google || !mapInstanceRef.current) return
    const map = mapInstanceRef.current
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = markers.map((m) => {
      const marker = new window.google.maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        map,
        title: m.label || '',
      })
      return marker
    })
    return () => markersRef.current.forEach((m) => m.setMap(null))
  }, [mapReady, markers])

  if (loadError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 ${className}`}
      >
        <p>Map unavailable. Add Google Maps API key.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={mapRef}
      className={`rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  )
}
