import { Header } from '../components/Header'
import { Outlet } from 'react-router-dom'

export function DashboardLayout() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="mx-auto max-w-screen-xl p-4 sm:p-6 lg:p-8">
                <Outlet />
            </main>
        </div>
    )
}
