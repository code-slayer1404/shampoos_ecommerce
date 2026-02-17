import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Spinner } from './ui/Spinner'

interface ProtectedRouteProps {
  children: React.ReactElement
  role?: string
}

const ProtectedRoute = ({ children, role = 'admin' }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
