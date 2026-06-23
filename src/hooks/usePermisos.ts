import { RolSistema } from '../types'
import { useAuth } from '../contexts/AuthContext'

export function usePermisos() {
    const { rol } = useAuth()

    const canManage = rol === 'ADMIN' || rol === 'EDITOR'
    const canViewAdmin = rol === 'ADMIN'
    const canRead = ['ADMIN', 'EDITOR', 'LECTOR'].includes(rol ?? '')

    return { rol, canManage, canViewAdmin, canRead }
}
