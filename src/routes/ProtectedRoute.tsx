import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
    requiredRoles?: string[]
}

export function ProtectedRoute({ requiredRoles }: ProtectedRouteProps) {
    const { isAuthenticated, rol } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (requiredRoles && rol && !requiredRoles.includes(rol)) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}
