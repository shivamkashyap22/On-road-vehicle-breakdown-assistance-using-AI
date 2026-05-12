// API and WebSocket endpoints for viva reference
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
export const WS_URL = (API_BASE.replace(/^http/, 'ws') + '/ws').replace(':8080', ':8080')

export const ROUTES = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me',
  },
  BREAKDOWN: {
    CREATE: '/api/breakdown/request',
    MY_REQUESTS: '/api/breakdown/my-requests',
    GET: (id) => `/api/breakdown/${id}`,
    ACCEPT: (id) => `/api/breakdown/${id}/accept`,
    REJECT: (id) => `/api/breakdown/${id}/reject`,
    START: (id) => `/api/breakdown/${id}/start`,
    COMPLETE: (id) => `/api/breakdown/${id}/complete`,
  },
  MECHANIC: {
    INCOMING: '/api/mechanic/incoming',
    STATUS: '/api/mechanic/status',
    LOCATION: '/api/mechanic/location',
  },
  CHAT: {
    SEND: '/api/chat',
    HISTORY: (requestId) => `/api/chat/${requestId}`,
  },
}
