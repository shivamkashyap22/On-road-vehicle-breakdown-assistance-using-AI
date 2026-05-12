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

function PrivateRoute({ children, allowedRole }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'MECHANIC' ? '/mechanic' : '/dashboard'} replace />
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
          <PrivateRoute allowedRole="USER">
            <UserDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/request/:id"
        element={
          <PrivateRoute allowedRole="USER">
            <RequestStatus />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment/:id"
        element={
          <PrivateRoute allowedRole="USER">
            <Payment />
          </PrivateRoute>
        }
      />
      <Route
        path="/mechanic"
        element={
          <PrivateRoute allowedRole="MECHANIC">
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
