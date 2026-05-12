import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { API_BASE } from '../api/endpoints'

/**
 * Subscribe to STOMP topic and receive messages.
 * @param {string} topic - e.g. /topic/request/123
 * @param {string|null} token - JWT for auth (optional; our backend allows /ws without auth for demo)
 */
export function useWebSocket(topic, token = null) {
  const [data, setData] = useState(null)
  const [connected, setConnected] = useState(false)
  const clientRef = useRef(null)
  const subRef = useRef(null)

  useEffect(() => {
    if (!topic) return
    const wsBase = API_BASE.replace(/^http/, 'ws')
    const client = new Client({
      webSocketFactory: () => new SockJS(wsBase + '/ws'),
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true)
        const sub = client.subscribe(topic, (msg) => {
          try {
            const body = JSON.parse(msg.body)
            setData(body)
          } catch {
            setData(msg.body)
          }
        })
        subRef.current = sub
      },
      onDisconnect: () => setConnected(false),
    })
    clientRef.current = client
    client.activate()
    return () => {
      if (subRef.current) subRef.current.unsubscribe()
      client.deactivate()
    }
  }, [topic])

  const send = (destination, body) => {
    if (clientRef.current?.connected && clientRef.current.publish) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      })
    }
  }

  return { data, connected, send }
}
