import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../api/axios'
import { LoginRequest, AuthResponse, ApiError } from '../types'

export function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)

        try {
            const payload: LoginRequest = { username, password }
            const response = await api.post<AuthResponse>('/api/auth/login', payload)
            login(response.data)
            navigate('/')
        } catch (err) {
            const apiError = (err as { response?: { data?: ApiError } }).response?.data
            setError(apiError?.message ?? 'Error al iniciar sesión')
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/20">
                <h1 className="text-3xl font-semibold text-white mb-6">Inventario Renting</h1>
                <p className="mb-6 text-slate-400">Ingrese con sus credenciales para continuar.</p>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <label className="block">
                        <span className="mb-2 block text-sm text-slate-300">Usuario</span>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
                            placeholder="admin"
                            autoComplete="username"
                        />
                    </label>
                    <label className="block">
                        <span className="mb-2 block text-sm text-slate-300">Contraseña</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </label>
                    {error && <div className="rounded-2xl bg-rose-950/70 p-3 text-sm text-rose-200">{error}</div>}
                    <button
                        type="submit"
                        className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-white transition hover:bg-sky-400"
                    >
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    )
}
