import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { DashboardLayout } from './pages/DashboardLayout'
import { EquiposPage } from './pages/EquiposPage'
import { MonitoresPage } from './pages/MonitoresPage'
import { AsignacionesPage } from './pages/AsignacionesPage'
import { BajasPage } from './pages/BajasPage'
import { ReportesPage } from './pages/ReportesPage'
import { CatalogosPage } from './pages/CatalogosPage'
import { UsuariosSistemaPage } from './pages/UsuariosSistemaPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="equipos" element={<EquiposPage />} />
                <Route path="monitores" element={<MonitoresPage />} />
                <Route path="reportes" element={<ReportesPage />} />
                <Route element={<ProtectedRoute requiredRoles={['ADMIN', 'EDITOR']} />}>
                  <Route path="asignaciones" element={<AsignacionesPage />} />
                  <Route path="bajas" element={<BajasPage />} />
                  <Route path="catalogos" element={<CatalogosPage />} />
                </Route>
                <Route element={<ProtectedRoute requiredRoles={['ADMIN']} />}>
                  <Route path="usuarios-sistema" element={<UsuariosSistemaPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
