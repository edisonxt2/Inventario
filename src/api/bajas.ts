import { api } from './axios'
import { BajaRequest, DocumentoBajaResponse, TipoEntidad } from '../types'

export async function fetchBajasEquipos() {
  const response = await api.get('/api/bajas/equipos')
  return response.data
}

export async function fetchBajasMonitores() {
  const response = await api.get('/api/bajas/monitores')
  return response.data
}

export async function subirBajaEquipo(equipoId: number, payload: BajaRequest, file?: File) {
  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  if (file) formData.append('archivo', file)
  const response = await api.post(`/api/bajas/equipos/${equipoId}`, formData)
  return response.data
}

export async function subirBajaMonitor(monitorId: number, payload: BajaRequest, file?: File) {
  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  if (file) formData.append('archivo', file)
  const response = await api.post(`/api/bajas/monitores/${monitorId}`, formData)
  return response.data
}

export async function fetchDocumentos(tipo: TipoEntidad, entidadId: number) {
  const response = await api.get<DocumentoBajaResponse[]>(`/api/bajas/documentos/${tipo}/${entidadId}`)
  return response.data
}

export async function descargarDocumento(documentoId: number) {
  const response = await api.get<Blob>(`/api/bajas/documentos/download/${documentoId}`, {
    responseType: 'blob',
  })
  return response.data
}
