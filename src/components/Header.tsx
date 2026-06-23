import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { usePermisos } from '../hooks/usePermisos'

export function Header() {
    const { username, logout } = useAuth()
    const { rol, canManage, canViewAdmin } = usePermisos()

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-4 sm:px-6">
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-lg font-semibold text-slate-900">Inventario Renting</Link>
                    <nav className="hidden items-center gap-2 md:flex">
                        <NavLink to="/" className={({ isActive }) => isActive ? 'rounded-2xl bg-slate-900 px-3 py-2 text-sm text-white' : 'rounded-2xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100'}>Dashboard</NavLink>
                        <NavLink to="/equipos" className={({ isActive }) => isActive ? 'rounded-2xl bg-slate-900 px-3 py-2 text-sm text-white' : 'rounded-2xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100'}>Equipos</NavLink>
                        <NavLink to="/monitores" className={({ isActive }) => isActive ? 'rounded-2xl bg-slate-900 px-3 py-2 text-sm text-white' : 'rounded-2xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100'}>Monitores</NavLink>
                        {canManage && (
                            <NavLink to="/asignaciones" className={({ isActive }) => isActive ? 'rounded-2xl bg-slate-900 px-3 py-2 text-sm text-white' : 'rounded-2xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100'}>Asignaciones</NavLink>
                        )}
                        {canManage && (
                            <NavLink to="/bajas" className={({ isActive }) => isActive ? 'rounded-2xl bg-slate-900 px-3 py-2 text-sm text-white' : 'rounded-2xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100'}>Bajas</NavLink>
                        )}
                        <NavLink to="/reportes" className={({ isActive }) => isActive ? 'rounded-2xl bg-slate-900 px-3 py-2 text-sm text-white' : 'rounded-2xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100'}>Reportes</NavLink>
                        {(canManage || canViewAdmin) && <NavLink to="/catalogos" className={({ isActive }) => isActive ? 'rounded-2xl bg-slate-900 px-3 py-2 text-sm text-white' : 'rounded-2xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100'}>Catálogos</NavLink>}
                        {canViewAdmin && <NavLink to="/usuarios-sistema" className={({ isActive }) => isActive ? 'rounded-2xl bg-slate-900 px-3 py-2 text-sm text-white' : 'rounded-2xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100'}>Usuarios del sistema</NavLink>}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700 sm:block">{username} • {rol}</div>
                    <button onClick={logout} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-700">Cerrar sesión</button>
                </div>
            </div>
        </header>
    )
}
