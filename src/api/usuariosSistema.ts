import { api } from './axios'
import { AuthResponse } from '../types'

export interface UsuarioSistemaRequest {
  username: string
  password: string
  rol: AuthResponse['rol']
}

export interface UsuarioSistemaResponse {
  id: number
  username: string
  rol: AuthResponse['rol']
  activo: boolean
}

export async function fetchUsuariosSistema() {
  const response = await api.get<UsuarioSistemaResponse[]>('/api/auth/usuarios-sistema')
  return response.data
}

export async function createUsuarioSistema(payload: UsuarioSistemaRequest) {
  const response = await api.post<UsuarioSistemaResponse>('/api/auth/usuarios-sistema', payload)
  return response.data
}

export async function desactivarUsuarioSistema(id: number) {
  const response = await api.patch<UsuarioSistemaResponse>(`/api/auth/usuarios-sistema/${id}/desactivar`)
  return response.data
}
