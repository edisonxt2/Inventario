import { api } from './axios'
import { AsignacionRequest, MonitorResponse, EquipoResponse } from '../types'

export async function asignarEquipo(payload: AsignacionRequest) {
  const response = await api.post<EquipoResponse>('/api/asignaciones/equipos', payload)
  return response.data
}

export async function desasignarEquipo(equipoId: number, observacion?: string) {
  const response = await api.post<EquipoResponse>(`/api/asignaciones/equipos/${equipoId}/desasignar`, null, {
    params: { observacion },
  })
  return response.data
}

export async function cambiarUsuarioEquipo(equipoId: number, payload: AsignacionRequest) {
  const response = await api.post<EquipoResponse>(`/api/asignaciones/equipos/${equipoId}/cambiar-usuario`, payload)
  return response.data
}

export async function asignarMonitor(payload: AsignacionRequest) {
  const response = await api.post<MonitorResponse>('/api/asignaciones/monitores', payload)
  return response.data
}

export async function desasignarMonitor(monitorId: number, observacion?: string) {
  const response = await api.post<MonitorResponse>(`/api/asignaciones/monitores/${monitorId}/desasignar`, null, {
    params: { observacion },
  })
  return response.data
}

export async function cambiarUsuarioMonitor(monitorId: number, payload: AsignacionRequest) {
  const response = await api.post<MonitorResponse>(`/api/asignaciones/monitores/${monitorId}/cambiar-usuario`, payload)
  return response.data
}
