import { api } from './axios'
import {
  ProveedorRequest,
  ProveedorResponse,
  CentroCostoRequest,
  CentroCostoResponse,
  ContratoRentingRequest,
  ContratoRentingResponse,
  UsuarioRequest,
  UsuarioResponse,
} from '../types'

export async function fetchProveedores() {
  const response = await api.get<ProveedorResponse[]>('/api/proveedores')
  return response.data
}

export async function createProveedor(payload: ProveedorRequest) {
  const response = await api.post<ProveedorResponse>('/api/proveedores', payload)
  return response.data
}

export async function updateProveedor(id: number, payload: ProveedorRequest) {
  const response = await api.put<ProveedorResponse>(`/api/proveedores/${id}`, payload)
  return response.data
}

export async function deleteProveedor(id: number) {
  await api.delete(`/api/proveedores/${id}`)
}

export async function fetchCentrosCosto() {
  const response = await api.get<CentroCostoResponse[]>('/api/centros-costo')
  return response.data
}

export async function createCentroCosto(payload: CentroCostoRequest) {
  const response = await api.post<CentroCostoResponse>('/api/centros-costo', payload)
  return response.data
}

export async function updateCentroCosto(id: number, payload: CentroCostoRequest) {
  const response = await api.put<CentroCostoResponse>(`/api/centros-costo/${id}`, payload)
  return response.data
}

export async function deleteCentroCosto(id: number) {
  await api.delete(`/api/centros-costo/${id}`)
}

export async function fetchContratos() {
  const response = await api.get<ContratoRentingResponse[]>('/api/contratos')
  return response.data
}

export async function createContrato(payload: ContratoRentingRequest) {
  const response = await api.post<ContratoRentingResponse>('/api/contratos', payload)
  return response.data
}

export async function updateContrato(id: number, payload: ContratoRentingRequest) {
  const response = await api.put<ContratoRentingResponse>(`/api/contratos/${id}`, payload)
  return response.data
}

export async function deleteContrato(id: number) {
  await api.delete(`/api/contratos/${id}`)
}

export async function fetchUsuarios() {
  const response = await api.get<UsuarioResponse[]>('/api/usuarios')
  return response.data
}

export async function createUsuario(payload: UsuarioRequest) {
  const response = await api.post<UsuarioResponse>('/api/usuarios', payload)
  return response.data
}

export async function updateUsuario(id: number, payload: UsuarioRequest) {
  const response = await api.put<UsuarioResponse>(`/api/usuarios/${id}`, payload)
  return response.data
}

export async function deleteUsuario(id: number) {
  await api.delete(`/api/usuarios/${id}`)
}
