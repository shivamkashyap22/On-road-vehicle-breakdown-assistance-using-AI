import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Register from '../pages/Register'

import UserDashboard from '../pages/user/UserDashboard'
import RequestStatus from '../pages/user/RequestStatus'
import Payment from '../pages/user/Payment'

import MechanicDashboard from '../pages/mechanic/MechanicDashboard'

import Chat from '../pages/Chat'

function PrivateRoute({ children }) {

  const { token, loading } = useAuth()

  // loading wait
  if (loading) {
    return <div>Loading...</div>
  }

  // sirf token check karo
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function AppRoutes() {

  return (

    <Routes>

      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/request/:id"
        element={
          <PrivateRoute>
            <RequestStatus />
          </PrivateRoute>
        }
      />

      <Route
        path="/payment/:id"
        element={
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        }
      />

      <Route
        path="/mechanic"
        element={
          <PrivateRoute>
            <MechanicDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />

      <Route
        path="/chat/:requestId"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  )
}