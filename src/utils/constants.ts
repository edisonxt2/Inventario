import { EstadoEquipo, EstadoMonitor } from '../types'

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export const estadoEquipoLabels: Record<EstadoEquipo, string> = {
  EN_BODEGA: 'En bodega',
  ASIGNADO: 'Asignado',
  PENDIENTE_DEVOLUCION: 'Pendiente devolución',
  ROBADO_EN_BUSQUEDA: 'Robado / en búsqueda',
  DEVUELTO_PROVEEDOR: 'Devuelto proveedor',
}

export const estadoMonitorLabels: Record<EstadoMonitor, string> = {
  EN_BODEGA: 'En bodega',
  ASIGNADO: 'Asignado',
  DEVUELTO_PROVEEDOR: 'Devuelto proveedor',
}

export const estadoEquipoColors: Record<EstadoEquipo, string> = {
  EN_BODEGA: 'bg-emerald-100 text-emerald-800',
  ASIGNADO: 'bg-sky-100 text-sky-800',
  PENDIENTE_DEVOLUCION: 'bg-amber-100 text-amber-800',
  ROBADO_EN_BUSQUEDA: 'bg-rose-100 text-rose-800',
  DEVUELTO_PROVEEDOR: 'bg-slate-100 text-slate-800',
}

export const estadoMonitorColors: Record<EstadoMonitor, string> = {
  EN_BODEGA: 'bg-emerald-100 text-emerald-800',
  ASIGNADO: 'bg-sky-100 text-sky-800',
  DEVUELTO_PROVEEDOR: 'bg-slate-100 text-slate-800',
}
