import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AuthResponse } from '../types'

interface AuthState {
    token: string | null
    username: string | null
    rol: AuthResponse['rol'] | null
}

interface AuthContextValue extends AuthState {
    login: (data: AuthResponse) => void
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'inventario-auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({ token: null, username: null, rol: null })

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            setState(JSON.parse(stored) as AuthState)
        }
    }, [])

    const login = useCallback((data: AuthResponse) => {
        const nextState = { token: data.token, username: data.username, rol: data.rol }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
        setState(nextState)
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY)
        setState({ token: null, username: null, rol: null })
        window.location.href = '/login'
    }, [])

    const isAuthenticated = useMemo(() => Boolean(state.token), [state.token])

    return (
        <AuthContext.Provider value={{ ...state, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
