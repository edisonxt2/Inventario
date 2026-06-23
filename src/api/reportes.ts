import { api } from './axios'

export async function fetchReporteInventarioEquipos() {
  const response = await api.get('/api/reportes/inventario/equipos')
  return response.data
}

export async function fetchReporteInventarioMonitores() {
  const response = await api.get('/api/reportes/inventario/monitores')
  return response.data
}

export async function fetchReporteEquiposPorProveedor(proveedorId: number) {
  const response = await api.get(`/api/reportes/equipos/por-proveedor/${proveedorId}`)
  return response.data
}

export async function fetchReporteMonitoresPorProveedor(proveedorId: number) {
  const response = await api.get(`/api/reportes/monitores/por-proveedor/${proveedorId}`)
  return response.data
}

export async function fetchReporteEquiposPorContrato(contratoId: number) {
  const response = await api.get(`/api/reportes/equipos/por-contrato/${contratoId}`)
  return response.data
}

export async function fetchReporteEquiposPorCentroCosto(centroCostoId: number) {
  const response = await api.get(`/api/reportes/equipos/por-centro-costo/${centroCostoId}`)
  return response.data
}

export async function fetchReporteEquiposAsignados() {
  const response = await api.get('/api/reportes/equipos/asignados')
  return response.data
}

export async function fetchReporteMonitoresAsignados() {
  const response = await api.get('/api/reportes/monitores/asignados')
  return response.data
}

export async function fetchReporteEquiposDisponibles() {
  const response = await api.get('/api/reportes/equipos/disponibles')
  return response.data
}

export async function fetchReporteMonitoresDisponibles() {
  const response = await api.get('/api/reportes/monitores/disponibles')
  return response.data
}

export async function fetchReporteActivosDevueltosEquipos() {
  const response = await api.get('/api/reportes/activos/devueltos/equipos')
  return response.data
}

export async function fetchReporteActivosDevueltosMonitores() {
  const response = await api.get('/api/reportes/activos/devueltos/monitores')
  return response.data
}

export async function fetchReporteCostosPorProveedor() {
  const response = await api.get('/api/reportes/costos/por-proveedor')
  return response.data
}

export async function fetchReporteCostosPorContrato(contratoId: number) {
  const response = await api.get(`/api/reportes/costos/por-contrato/${contratoId}`)
  return response.data
}

export async function fetchReporteCostosPorCentroCosto() {
  const response = await api.get('/api/reportes/costos/por-centro-costo')
  return response.data
}
