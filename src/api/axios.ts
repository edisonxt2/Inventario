import axios from 'axios'
import { API_URL } from '../utils/constants'

export const api = axios.create({
  baseURL: API_URL,
})

const STORAGE_KEY = 'inventario-auth'

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem(STORAGE_KEY)
  const token = stored ? (JSON.parse(stored) as { token?: string }).token : null
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEY)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
