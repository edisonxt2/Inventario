import { api } from './axios'
import {
  EquipoRequest,
  EquipoResponse,
  CambioEstadoEquipoRequest,
  ReemplazoComponenteRequest,
  HistorialMovimientoResponse,
} from '../types'

export async function fetchEquipos() {
  const response = await api.get<EquipoResponse[]>('/api/equipos')
  return response.data
}

export async function createEquipo(payload: EquipoRequest) {
  const response = await api.post<EquipoResponse>('/api/equipos', payload)
  return response.data
}

export async function updateEquipo(id: number, payload: EquipoRequest) {
  const response = await api.put<EquipoResponse>(`/api/equipos/${id}`, payload)
  return response.data
}

export async function changeEquipoEstado(id: number, payload: CambioEstadoEquipoRequest) {
  const response = await api.patch<EquipoResponse>(`/api/equipos/${id}/estado`, payload)
  return response.data
}

export async function reemplazarComponente(id: number, payload: ReemplazoComponenteRequest) {
  const response = await api.post<EquipoResponse>(`/api/equipos/${id}/componentes/reemplazo`, payload)
  return response.data
}

export async function fetchEquipoHistorial(id: number) {
  const response = await api.get<HistorialMovimientoResponse[]>(`/api/equipos/${id}/historial`)
  return response.data
}

export async function deleteEquipo(id: number) {
  await api.delete(`/api/equipos/${id}`)
}
