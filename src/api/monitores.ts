import { api } from './axios'
import { MonitorRequest, MonitorResponse, HistorialMovimientoResponse } from '../types'

export async function fetchMonitores() {
  const response = await api.get<MonitorResponse[]>('/api/monitores')
  return response.data
}

export async function createMonitor(payload: MonitorRequest) {
  const response = await api.post<MonitorResponse>('/api/monitores', payload)
  return response.data
}

export async function updateMonitor(id: number, payload: MonitorRequest) {
  const response = await api.put<MonitorResponse>(`/api/monitores/${id}`, payload)
  return response.data
}

export async function fetchMonitorHistorial(id: number) {
  const response = await api.get<HistorialMovimientoResponse[]>(`/api/monitores/${id}/historial`)
  return response.data
}

export async function deleteMonitor(id: number) {
  await api.delete(`/api/monitores/${id}`)
}
